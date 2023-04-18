import {WeaviateClass} from "weaviate-ts-client";

export type ParagraphClassProperties = {
  content: string;
  order: number;
  title: string;
  inArticle: [{
    beacon: string;
  }]
}

export const ParagraphClass: WeaviateClass = {
  class: 'Paragraph',
  description: 'A wiki paragraph',
  // vectorIndexConfig: {
  //   vectorCacheMaxObjects: 150000000000,
  //   ef: 256,
  //   efConstruction: 512,
  //   maxConnections: 128,
  // },
  vectorizer: 'text2vec-cohere',
  properties: [
    {
      dataType: ['string'],
      description: 'Title of the paragraph',
      name: 'title',
      indexInverted: true,
      moduleConfig: {
        'text2vec-cohere': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      dataType: ['text'],
      description: 'The content of the paragraph',
      name: 'content',
      indexInverted: true,
      moduleConfig: {
        'text2vec-cohere': {
          skip: false,
          vectorizePropertyName: false,
        },
      },
    },
    {
      dataType: ['int'],
      description: 'Order of the paragraph',
      name: 'order',
      indexInverted: true,
      moduleConfig: {
        'text2vec-cohere': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
    {
      dataType: ['Article'],
      description: 'Article this paragraph is in',
      name: 'inArticle',
      moduleConfig: {
        'text2vec-cohere': {
          skip: true,
          vectorizePropertyName: false,
        },
      },
    },
  ],
}
