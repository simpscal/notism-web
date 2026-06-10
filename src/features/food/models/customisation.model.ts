export interface CustomisationOptionViewModel {
    value: string; // option id
    label: string;
    surcharge?: number; // omitted when null/0
}

export interface CustomisationGroupViewModel {
    id: string;
    label: string;
    required: boolean;
    options: CustomisationOptionViewModel[];
}
