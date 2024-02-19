export interface FileUpload {
  id?: number;
  createdDate?: string | null;
  generatedName?: string;
  mimeType?: string;
  originalName?: string;
  size?: number;
  thumbnail?: string | null;
  thumbnailSize?: number;
  path?: string;
}

export enum UploadMediaType {
  CUSTOMER = "CUSTOMER",
  SUBSCRIPTION = "SUBSCRIPTION",
  ORDER = "ORDER",
}
