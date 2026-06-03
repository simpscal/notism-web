import { CustomisationGroupModel } from '@/apis/models/food.model';
import { CartItemCustomisationOptionViewModel } from '@/features/cart/models';

/**
 * Builds the default selection map for a food's customisation groups.
 *
 * Each REQUIRED group is pre-selected to its first option's value so a valid
 * starting choice (and any surcharge it carries) always exists. Non-required
 * groups are left unselected.
 */
export function getDefaultRequiredSelections(
    customisations: CustomisationGroupModel[] | undefined
): Record<string, string> {
    return (customisations ?? []).reduce<Record<string, string>>((acc, group) => {
        if (group.required && group.options.length > 0) {
            acc[group.id] = group.options[0].value;
        }
        return acc;
    }, {});
}

export interface CartCustomisationFields {
    customisationGroupId: string | null;
    customisationGroupLabel: string | null;
    customisationOptionId: string | null;
    customisationLabel: string | null;
    surcharge: number | null;
    customisationOptions: CartItemCustomisationOptionViewModel[];
}

/**
 * Derives the customisation fields stored on a cart item from a food's
 * customisation groups and the customer's selections.
 *
 * The cart item model carries a SINGLE representative group for display/edit,
 * but `surcharge` holds the AGGREGATE sum of every selected option's surcharge
 * so the cart total reflects all chosen surcharges (see cart-iterm.model).
 *
 * The representative group is the first required group with a selection, falling
 * back to the first group that has a selection.
 */
export function buildCartCustomisation(
    customisations: CustomisationGroupModel[] | undefined,
    selections: Record<string, string>
): CartCustomisationFields {
    const groups = customisations ?? [];

    const aggregateSurcharge = groups.reduce((sum, group) => {
        const chosen = selections[group.id];
        if (!chosen) return sum;
        const option = group.options.find(o => o.value === chosen);
        return sum + (option?.surcharge ?? 0);
    }, 0);

    const selectedGroups = groups.filter(group => !!selections[group.id]);
    const representative = selectedGroups.find(group => group.required) ?? selectedGroups[0] ?? null;

    if (!representative) {
        return {
            customisationGroupId: null,
            customisationGroupLabel: null,
            customisationOptionId: null,
            customisationLabel: null,
            surcharge: aggregateSurcharge > 0 ? aggregateSurcharge : null,
            customisationOptions: [],
        };
    }

    const selectedValue = selections[representative.id];
    const selectedOption = representative.options.find(o => o.value === selectedValue) ?? null;

    return {
        customisationGroupId: representative.id,
        customisationGroupLabel: representative.label,
        customisationOptionId: selectedValue,
        customisationLabel: selectedOption?.label ?? null,
        surcharge: aggregateSurcharge,
        customisationOptions: representative.options.map(option => ({
            id: option.value,
            label: option.label,
            surcharge: option.surcharge ?? null,
        })),
    };
}
