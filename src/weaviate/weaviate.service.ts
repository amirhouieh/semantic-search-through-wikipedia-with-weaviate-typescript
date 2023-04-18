import {schemaClasses} from "./config";
import weaviate, {WeaviateClass, WeaviateClient, WeaviateError} from "weaviate-ts-client";
import {ArticleClass} from "./article.class";
import {uuid} from 'uuidv4';
import {getNoneReferenceProperties, getReferenceProperties} from "./weaviate.utils";
import {Article} from "../types/data.types";

export class WeaviateService {
    private client: WeaviateClient;

    constructor() {
        this.client = weaviate.client({
            scheme: 'https',
            host: process.env.WEAVIATE_HOST || 'localhost',
        });
    }

    async init() {
        const {classes = []} = await this.getExistingClasses();
        if (classes.length === 0) {
            await this.createClassesWithoutReferences()
            await this.addReferences()
        }
        // await this.flushClasses()
    }

    private async getExistingClasses() {
        return this.client.schema.getter().do()
    }

    private async createClassesWithoutReferences() {
        const classesWithoutReferences = schemaClasses.map((classObj) => {
            if (classObj.properties === undefined) return classObj;
            return {
                ...classObj,
                properties: getNoneReferenceProperties(classObj.properties, schemaClasses)
            }
        })

        for await (const classObj of classesWithoutReferences) {
            const data = await this.createClass(classObj)
        }
    }

    private async addReferences() {
        for await (const classObj of schemaClasses) {
            const propertiesWithReferences = getReferenceProperties(classObj.properties || [], schemaClasses)
            for await (const property of propertiesWithReferences) {
                try {
                    await this.client.schema
                        .propertyCreator()
                        .withClassName(classObj.class as string)
                        .withProperty(property)
                        .do()
                } catch (e: WeaviateError | any) {
                    console.log("error in adding property", `in class ${classObj.class}`, `property ${property.name}`, property);
                    console.log(e)
                }
            }
        }
    }

    private listSchemaClasses() {
        return this.client
            .schema
            .getter()
            .do()

    }

    private async flushClasses() {
        const {classes} = await this.listSchemaClasses();
        for await (const classObj of classes as WeaviateClass[]) {
            await this.client.schema.classDeleter().withClassName(classObj.class as string).do()
        }
    }

    private async createClass(classObj: WeaviateClass) {
        return this.client
            .schema
            .classCreator()
            .withClass(classObj)
            .do()
    }

    public async seedData(data: Article[]) {
        // delete all existing objects
        await this.flushExistingObjects(ArticleClass)

        // add new articles
        const storedArticles = await this.addArticlesInBatch(data)
        console.log(`Stored ${storedArticles.length} articles`);

        // TODO
        // add paragraphs

        //TODO
        // create references
    }


    private async flushExistingObjects(classObj: WeaviateClass) {
        const {objects = []} = await this.client.data.getter().withClassName('Article').do()
        if (objects.length > 0) {
            const deleted = await this.flushObjects(ArticleClass)
            console.log("deleted objects", deleted.results?.matches || 0);
        }
    }

    private async flushObjects(classObj: WeaviateClass){
        return this.client.batch.objectsBatchDeleter()
            .withClassName(classObj.class as string)
            //TODO
            // this should be Equal, but it doesn't work
            .withWhere({operator: "NotEqual", path: ["title"], valueString: "*"})
            .do()
    }

    private async addArticlesInBatch(data: Article[]) {
      return this.client.batch.objectsBatcher()
          .withObjects(
              ...data.map((article) => ({
                id: uuid(),
                "class": ArticleClass.class,
                properties: {
                  title: article.title,
                }
              }))
          )
          .do()
    }

}
