import { toast } from 'sonner';

import { apiClient } from './client';
import { PresignedUrlResponseModel } from './models';

import { API_ENDPOINTS } from '@/app/constants';
import { PresignedUrlUploadEnum } from '@/app/enums';

export const storageApi = {
    getPresignedUrl: async (
        filename: string,
        contentType: string,
        presignedUrlType: PresignedUrlUploadEnum
    ): Promise<PresignedUrlResponseModel> => {
        return apiClient.post(API_ENDPOINTS.STORAGE.PRESIGNED_URL_UPLOAD(presignedUrlType), {
            filename,
            contentType,
        });
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
