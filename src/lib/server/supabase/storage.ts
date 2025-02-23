import { supabase } from './client';


export class StorageService {
  
  private bucketName = "uploads";
  
  async uploadFile(file: Buffer, mimeType: string, fileName: string) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          contentType: mimeType,
        });
        
      if (error) throw error;
      
      return data.path;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  }
  
  async generateSignedUrl(filePath: string, expiresInSeconds = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .createSignedUrl(filePath, expiresInSeconds);
        
      if (error) throw error;
      
      return data.signedUrl;
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      throw error;
    }
  }
  
  getFileType(filePath: string) {
    try {
      // Extract MIME type from the file extension or metadata
      const fileExtension = filePath.split('.').pop()?.toLowerCase();
      switch (fileExtension) {
        case 'pdf':
          return 'application/pdf';
        case 'jpg':
        case 'jpeg':
          return 'image/jpeg';
        case 'png':
          return 'image/png';
        case 'docx':
          return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        default:
          return 'application/octet-stream'; // Default MIME type
      }
    } catch (error) {
      console.error('Failed to get file type:', error);
      throw error;
    }
  }
  
}