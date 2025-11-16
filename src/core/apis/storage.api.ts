import { apiClient } from '@/core/apis/client.api';
import { API_ENDPOINTS } from '@/shared/constants';

export const storageApi = {
    getPresignedUrl: async (filename: string, contentType: string): Promise<{ uploadUrl: string; fileKey: string }> => {
        return apiClient.post(API_ENDPOINTS.STORAGE.PRESIGNED_URL_UPLOAD, {
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
            throw new Error('Failed to upload file to presigned URL');
        }

        return response;
    },
};
