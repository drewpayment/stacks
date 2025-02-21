import { i, type InstaQLEntity } from '@instantdb/core';

export const schema = i.schema({
  entities: {
    documents: i.entity({
      id: i.string(),
      filename: i.string(),
      mimeType: i.string(),
      googleDriveFileId: i.string(),
      uploadDate: i.date(),
      userId: i.string(),
      documentType: i.string(),
      fileSize: i.number(),
      status: i.string(),
    }),
  }
})

export type Documents = InstaQLEntity<typeof schema, 'documents'>;