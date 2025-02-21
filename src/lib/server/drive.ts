import { GOOGLE_SERVICE_ACCOUNT_JSON } from '$env/static/private';
import { google } from 'googleapis';

export class DriveService {
  private drive; 
  
  constructor() {
    const serviceAccountJson = JSON.parse(
      Buffer.from(GOOGLE_SERVICE_ACCOUNT_JSON, 'base64').toString()
    );
    
    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountJson,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });
    
    this.drive = google.drive({ version: 'v3', auth });
  }
  
  async uploadFile(fileBuffer: Buffer, mimeType: string, filename: string) {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: filename,
          mimeType,
        },
        media: {
          mimeType,
          body: fileBuffer,
        },
      });
      
      return response.data.id;
    } catch (error) {
      console.error(`Upload failed: ${error}`);
      throw error;
    }
  }
}