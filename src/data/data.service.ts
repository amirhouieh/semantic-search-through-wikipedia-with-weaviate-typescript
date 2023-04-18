import {getRelatedPagesContent, parseWikiRawContentToBlock} from "./wikipedia";
import {Article} from "../types/data.types";


export class DataService{
    constructor() {
    }

    public async generateSeedData(topic: string, numberOfArticles: number): Promise<Article[]> {
        const pages = await getRelatedPagesContent(topic, numberOfArticles);
        return pages.map((page) => ({
            title: page.title,
            contentBlocks: parseWikiRawContentToBlock(page.content)
        }))
    }
}
