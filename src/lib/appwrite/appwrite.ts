import { Client, Storage, ID, Databases, Query, ImageGravity, ImageFormat, type Models } from 'node-appwrite';
import { SERVER_API_KEY, BUCKET_USER_IMAGES_ID, APPWRITE_PROJECT_ID, APPWRITE_URL, DB_USER_IMAGES, COLLECTION_USER_IMAGES } from '$env/static/private';
import type { UserImage } from './models';
  
export class AppWrite {
  static #instance: AppWrite;
  private client: Client;
  private userImageStorage: Storage;
  private db: Databases;
  
  constructor() {
    this.client = new Client();
    
    this.client
      .setEndpoint(APPWRITE_URL)
      .setProject(APPWRITE_PROJECT_ID)
      .setKey(SERVER_API_KEY);
      
    this.userImageStorage = new Storage(this.client);
    this.db = new Databases(this.client);
  }
  
  public static get instance(): AppWrite {
    if (!AppWrite.#instance) {
       AppWrite.#instance = new AppWrite();
     }
     return AppWrite.#instance;
  }
  
  async saveUserImage(imageMeta: UserImage, file: File) {
    try {
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
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  
  // write a method that gets the user image by the user's userid from the user_images database collection 
  // and then get the image preview url from the user_images storage bucket
  // and then return the image preview url
  async getUserImage(userId: string) {
    let imageMetas: Models.DocumentList<Models.Document>;
    
    try {
      imageMetas = await this.db.listDocuments(
        DB_USER_IMAGES,
        COLLECTION_USER_IMAGES,
        [Query.equal('userId', userId)],
      );
    } catch (err) {
      return  null;
    }
    
    if (!imageMetas.documents.length) {
      return null;
    }
    
    const imageMeta = imageMetas.documents[0];
    
    const image = await this.userImageStorage.getFilePreview(
      BUCKET_USER_IMAGES_ID,
      imageMeta.fileName,
      300,
      0,
      ImageGravity.Center,
      90,
      0,
      '',
      0,
      1,
      0,
      'FFFFFF',
      ImageFormat.Jpg,
    );
    
    return image;
  }
  
}