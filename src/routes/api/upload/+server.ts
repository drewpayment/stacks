import { json } from '@sveltejs/kit';
import dayjs from 'dayjs';
import { StorageService } from '$lib/server/supabase/storage.js';
import type { FileUploadResult } from '$lib/types/file-upload.js';


export async function POST({ request, locals }): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get('file');
  const documentType = formData.get('documentType') as string;
  const storageService = new StorageService();
  
  if (!file || !(file instanceof File)) {
    return json({ error: 'No file provided.' }, { status: 400 });
  }
  
  const buffer = await file.arrayBuffer();
  try {
    const filePath = await storageService.uploadFile(Buffer.from(buffer), file.type, file.name);
    
    const metadata = {
      fileName: file.name,
      mimeType: file.type,
      filePath,
      uploadDate: dayjs().toDate(),
      userId: locals.user.id,
      documentType,
      fileSize: file.size,
      status: 'uploaded',
    } as FileUploadResult;
    
    return json(metadata);
  } catch (error) {
    console.error(`Upload failed.`, error);
    
    return json(error, { status: 400, statusText: 'Bad Request' });
  }
}