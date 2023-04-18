import axios from 'axios';
import {WikiPageContentRaw, WikiSearchResult} from "../types/wiki.types";
import {ContentBlock} from "../types/data.types";
import {notEmpty} from "../utils/text.utils";


export async function getRelatedPagesContent(topic: string, limit: number = 10): Promise<WikiPageContentRaw[]> {
    try {
        // Fetch related pages
        const relatedPages = await axios.get<WikiSearchResult>(`https://en.wikipedia.org/w/api.php`, {
            params: {
                action: 'query',
                format: 'json',
                list: 'search',
                srsearch: topic,
                srlimit: limit,
            },
        });

        return Promise.all(
            relatedPages.data.query.search.map(async (page: any) => {
                const pageContents = await axios.get(`https://en.wikipedia.org/w/api.php`, {
                    params: {
                        action: 'query',
                        format: 'json',
                        prop: 'extracts',
                        exlimit: 'max',
                        explaintext: true,
                        exsectionformat: 'wiki',
                        titles: page.title,
                    },
                });
                return {
                    title: page.title,
                    content: pageContents.data.query.pages[page.pageid].extract
                }
            })
        )
    } catch (error) {
        console.error('Error fetching related pages and their content:', error);
        return []
    }
}

export const parseWikiRawContentToBlock = (rawContent: string): ContentBlock[] => {
    // remove empty blocks and blocks after references section or external links section
    const referencesIndex = rawContent.indexOf("== References ==");
    const externalLinksIndex = rawContent.indexOf("== External links ==");
    const endIndex = Math.min(referencesIndex, externalLinksIndex);
    if (endIndex > 0) {
        rawContent = rawContent.substring(0, endIndex);
    }

    return rawContent
        .split("\n")
        .filter(notEmpty)
        .map((content, index) => {
            // Check if the content is a heading by checking if it starts with "="
            const heading = content.match(/^(=+)([^=]+)(=+)$/);
            return {
                title: "",
                content: heading ? heading[2].trim() : content,
                order: index,
                type: heading ? "heading" : "paragraph"
            }
        })
}
