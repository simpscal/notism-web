export interface AdminCustomisationGroupViewModel {
    id: string;
    foodId: string;
    label: string;
    isRequired: boolean;
    displayOrder: number;
}

export interface AdminCustomisationOptionViewModel {
    id: string;
    groupId: string;
    label: string;
    surcharge: number | null;
    displayOrder: number;
}
