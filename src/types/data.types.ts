export type ContentBlock = {
    title: string,
    content: string,
    order: number
    type: "paragraph" | "heading"
}

export type Article = {
    title: string,
    contentBlocks: ContentBlock[]
}
