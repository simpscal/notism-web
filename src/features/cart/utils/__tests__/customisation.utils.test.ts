import { describe, expect, it } from 'vitest';

import { CustomisationGroupModel } from '@/apis/models/food.model';
import { buildCartCustomisation, getDefaultRequiredSelections } from '@/features/cart';

const SIZE_GROUP: CustomisationGroupModel = {
    id: 'group-size',
    label: 'Size',
    required: true,
    options: [
        { value: 'small', label: 'Small' },
        { value: 'large', label: 'Large', surcharge: 5000 },
    ],
};

const EXTRAS_GROUP: CustomisationGroupModel = {
    id: 'group-extras',
    label: 'Extras',
    required: false,
    options: [
        { value: 'cheese', label: 'Cheese', surcharge: 3000 },
        { value: 'none', label: 'None' },
    ],
};

describe('getDefaultRequiredSelections', () => {
    it('returns empty object when there are no customisations', () => {
        expect(getDefaultRequiredSelections(undefined)).toEqual({});
        expect(getDefaultRequiredSelections([])).toEqual({});
    });

    it('pre-selects the first option of each required group only', () => {
        const result = getDefaultRequiredSelections([SIZE_GROUP, EXTRAS_GROUP]);
        expect(result).toEqual({ 'group-size': 'small' });
    });
});

describe('buildCartCustomisation', () => {
    it('returns null fields when nothing is selected', () => {
        const result = buildCartCustomisation([SIZE_GROUP], {});
        expect(result.customisationOptionId).toBeNull();
        expect(result.surcharge).toBeNull();
        expect(result.customisationOptions).toEqual([]);
    });

    it('aggregates surcharge across every selected group', () => {
        const result = buildCartCustomisation([SIZE_GROUP, EXTRAS_GROUP], {
            'group-size': 'large',
            'group-extras': 'cheese',
        });
        expect(result.surcharge).toBe(8000);
    });

    it('uses the first required group with a selection as the representative', () => {
        const result = buildCartCustomisation([EXTRAS_GROUP, SIZE_GROUP], {
            'group-extras': 'cheese',
            'group-size': 'large',
        });
        expect(result.customisationGroupId).toBe('group-size');
        expect(result.customisationOptionId).toBe('large');
        expect(result.customisationLabel).toBe('Large');
        expect(result.customisationOptions).toHaveLength(2);
    });

    it('exposes the representative group surcharge to zero-surcharge default', () => {
        const result = buildCartCustomisation([SIZE_GROUP], { 'group-size': 'small' });
        expect(result.surcharge).toBe(0);
        expect(result.customisationOptionId).toBe('small');
    });
});
