import { json } from '@sveltejs/kit';
import { StorageService } from '$lib/server/supabase/storage';


export async function GET({ url }) {
  const service = new StorageService();
  const queryParams = url.searchParams;
  const filePath = queryParams.get('filepath');
  
  if (!filePath) return json(null, { status: 400, statusText: 'Bad Request', });
  
  try {
    const previewUrl = await service.generateSignedUrl(filePath);
    const fileType = service.getFileType(filePath);
    
    return json({
      url: previewUrl,
      fileType,
    });
  } catch (error) {
    return json({
      url: null,
      fileType: null,
    }, { status: 400, statusText: 'Bad Request' });
  }
}