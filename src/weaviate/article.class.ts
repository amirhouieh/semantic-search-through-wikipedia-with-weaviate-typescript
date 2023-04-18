import { WeaviateClass } from "weaviate-ts-client";
import { ParagraphClassProperties } from "./paragraph.class";

export type ArticleClassProperties = {
  title: string;
  content: string;
  hasParagraphs: ParagraphClassProperties[]
}

export const ArticleClass: WeaviateClass = {
  class: 'Article',
  description: 'A wikipedia article with a title and crefs',
  vectorizer: 'none',
  vectorIndexConfig: {
    skip: true,
  },
  properties: [
    {
      dataType: ['string'],
      description: 'Title of the article',
      name: 'title',
      indexInverted: true,
    },
    {
      dataType: ['Paragraph'],
      description: 'List of paragraphs this article has',
      name: 'hasParagraphs',
      indexInverted: true,
    },
    {
      dataType: ['Article'],
      description: 'Articles this page links to',
      name: 'linksToArticles',
      indexInverted: true,
    },
  ],
};
