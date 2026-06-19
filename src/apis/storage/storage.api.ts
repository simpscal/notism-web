import { toast } from 'sonner';

import { apiClient } from '../client';

import { toPresignedUrl } from './storage.mapper';
import { PresignedUrlResponseModel } from './storage.response';

import { API_ENDPOINTS } from '@/app/constants';
import { PresignedUrlUploadEnum } from '@/app/enums';

export const STORAGE_QUERY_KEYS = {};

export const storageApi = {
    getPresignedUrl: async (filename: string, contentType: string, presignedUrlType: PresignedUrlUploadEnum) => {
        const response = await apiClient.post<PresignedUrlResponseModel>(
            API_ENDPOINTS.STORAGE.PRESIGNED_URL_UPLOAD(presignedUrlType),
            {
                filename,
                contentType,
            }
        );
        return toPresignedUrl(response);
    },

    uploadToPresignedUrl: async (presignedUrl: string, file: File) => {
        const response = await fetch(presignedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!response.ok) {
            toast.error('Failed to upload file to presigned URL');
        }

        return response;
    },
};
