import { toast } from 'sonner';

import { apiClient } from '../client';

import { STORAGE_ENDPOINTS } from './storage.constant';
import { toPresignedUrl } from './storage.mapper';
import { PresignedUrlResponseModel } from './storage.response';

import { PresignedUrlUploadType } from '@/app/types';

export const storageApi = {
    getPresignedUrl: async (filename: string, contentType: string, presignedUrlType: PresignedUrlUploadType) => {
        const response = await apiClient.post<PresignedUrlResponseModel>(
            STORAGE_ENDPOINTS.PRESIGNED_URL_UPLOAD(presignedUrlType),
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
