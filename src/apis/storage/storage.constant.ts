import { PresignedUrlUploadEnum } from '@/app/enums';

export const STORAGE_ENDPOINTS = {
    PRESIGNED_URL_UPLOAD: (presignedUrlType: PresignedUrlUploadEnum) => `storage/presigned-url/${presignedUrlType}`,
} as const;

export const STORAGE_QUERY_KEYS = {};
