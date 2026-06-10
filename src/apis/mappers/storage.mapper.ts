import type { PresignedUrlResponseModel } from '../models';

import type { PresignedUrlViewModel } from '@/features/storage/models';

export function toPresignedUrl(response: PresignedUrlResponseModel): PresignedUrlViewModel {
    return {
        uploadUrl: response.uploadUrl,
        fileKey: response.fileKey,
    };
}
