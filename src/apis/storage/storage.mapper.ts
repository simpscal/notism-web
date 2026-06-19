import type { PresignedUrlModel } from './storage.model';
import type { PresignedUrlResponseModel } from './storage.response';

export function toPresignedUrl(response: PresignedUrlResponseModel): PresignedUrlModel {
    return {
        uploadUrl: response.uploadUrl,
        fileKey: response.fileKey,
    };
}
