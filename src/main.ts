import 'dotenv/config'
import {WeaviateService} from "./weaviate/weaviate.service";
import {DataService} from "./data/data.service";

const weaviate = new WeaviateService();
const data = new DataService();

(async() => {
    // Initialize the weaviate client & build schema
    await weaviate.init()

    // Generate seed data
    const seedData = await data.generateSeedData("cats", 20)

    // Seed the data into the weaviate instance
    await weaviate.seedData(seedData || [])

})();
