export type WikiPageContentRaw = {
    title: string
    content: string
}

export type WikiSearchResultItem = {
    ns: number
    title: string
    pageid: number
    size: number
    wordcount: number
    snippet: string
    timestamp: string
}

export type WikiSearchResult = {
    userId: number
    id: number
    title: string
    completed: boolean,
    query: {
        searchinfo: {
            totalhits: number,
            suggestion: string,
            suggestionsnippet: string,
        },
        search: WikiSearchResultItem[]
    }
}
