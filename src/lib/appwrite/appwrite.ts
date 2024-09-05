import { Client, Storage, ID, Databases } from 'node-appwrite';
import { SERVER_API_KEY, BUCKET_USER_IMAGES_ID, APPWRITE_PROJECT_ID, APPWRITE_URL, DB_USER_IMAGES, COLLECTION_USER_IMAGES } from '$env/static/private';
import type { UserImage } from './models';
  
export class AppWrite {
  client: Client;
  userImageStorage: Storage;
  db: Databases;
  
  constructor() {
    this.client = new Client();
    
    this.client
      .setEndpoint(APPWRITE_URL)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(SERVER_API_KEY);
      
    this.userImageStorage = new Storage(this.client);
    this.db = new Databases(this.client);
  }
  
  async saveUserImage(imageMeta: UserImage, file: File) {
    const fileMeta = await this.db.createDocument(
      DB_USER_IMAGES,
      COLLECTION_USER_IMAGES,
      ID.unique(),
      imageMeta,
    );
    
    const createdFile = await this.userImageStorage.createFile(
      BUCKET_USER_IMAGES_ID,
      ID.unique(),
      file,
    );
    
    return { fileMeta, createdFile };
  }
  
  // write a method that gets the user image by the user's userid from the user_images database collection 
  // and then get the image preview url from the user_images storage bucket
  // and then return the image preview url
  async getUserImage(userId: string) {
    const image = await this.userImageStorage.listFiles(BUCKET_USER_IMAGES_ID, [
      Query.equal('userId', userId),
    ]);
    return image.files[0].preview;
  }
  
}