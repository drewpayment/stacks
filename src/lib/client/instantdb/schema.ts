import { i, type InstaQLEntity } from '@instantdb/core';

export const schema = i.schema({
  entities: {
    documents: i.entity({
      id: i.string(),
      filename: i.string(),
      mimeType: i.string(),
      filePath: i.string(),
      uploadDate: i.date(),
      userId: i.string(),
      documentType: i.string(),
      fileSize: i.number(),
      status: i.string(),
    }),
    workflows: i.entity({
      id: i.string(),
      executedByUserId: i.string(),
      description: i.string(),
      data: i.json(),
      status: i.string(),
      startDate: i.date(),
      endDate: i.date(),
    }),
  }
})

export type Documents = InstaQLEntity<typeof schema, 'documents'>;

export type Workflow = InstaQLEntity<typeof schema, 'workflows'>;