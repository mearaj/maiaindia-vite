export interface FormImage {
  url: string;
  height: number;
  width: number;
  extension: string;
  file: File | null;
}

export interface ImageMetadata {
  srcSet?: string;
  src?: string;
  sizes?: string;
}
