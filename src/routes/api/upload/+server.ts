import { json } from '@sveltejs/kit';
import { DriveService } from '$lib/server/drive';


const driveService = new DriveService();

export async function POST({ request, locals }) {
  const formData = await request.formData();
  const file = formData.get('file');
  const documentType = formData.get('documentType');
  
  if (!file || !(file instanceof File)) {
    return json({ error: 'No file provided.' }, { status: 400 });
  }
  
  const buffer = await file.arrayBuffer();
  const fileId = await driveService.uploadFile(
    Buffer.from(buffer),
    file.type,
    file.name,
  );
  
  const metadata = {
    fileName: file.name,
    mimeType: file.type,
    googleDriveFileId: fileId,
    uploadDate: new Date(),
    userId: locals.user.id,
    documentType,
    fileSize: file.size,
    status: 'UPLOADED',
  };
  
  return json({ fileId, metadata });
}