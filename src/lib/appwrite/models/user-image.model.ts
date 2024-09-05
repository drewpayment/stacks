

export interface UserImage {
  id: string;
  userId: string;
  fileName: string; // used as "fileId" in the appwrite image preview method 
  height: number;
  width: number;
  created: Date;
  updated: Date;
}