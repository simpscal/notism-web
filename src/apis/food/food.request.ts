export interface GetFoodsRequestModel {
    skip?: number;
    take?: number;
    category?: string;
    keyword?: string;
    isAvailable?: boolean;
    sortBy?: string;
    sortOrder?: string;
}
