

export interface FileUploadResult {
  fileName: string;
  mimeType: string;
  filePath: string;
  uploadDate: Date;
  documentType: string;
  fileSize: number;
  status: 'uploaded' | 'active' | 'deleted';
}