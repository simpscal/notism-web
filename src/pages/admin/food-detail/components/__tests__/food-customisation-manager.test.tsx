import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import FoodCustomisationManager from '../food-customisation-manager';

import { renderWithProviders } from '@/test/utils';

const GROUPS_URL = '*/admin/foods/food-1/customisation-groups';
const GROUP_URL = '*/admin/foods/food-1/customisation-groups/group-1';
const OPTIONS_URL = '*/admin/foods/food-1/customisation-groups/group-1/options';
const OPTION_URL = '*/admin/foods/food-1/customisation-groups/group-1/options/option-1';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockCustomisations = [
    {
        id: 'group-1',
        label: 'Size',
        required: true,
        options: [
            { value: 'option-1', label: 'Small', surcharge: undefined },
            { value: 'option-2', label: 'Large', surcharge: 2 },
        ],
    },
];

describe('FoodCustomisationManager', () => {
    it('renders empty state when no customisation groups exist', () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={[]} />);

        expect(screen.getByText(/no customisation groups yet/i)).toBeInTheDocument();
    });

    it('renders customisation groups with options', () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('Size')).toBeInTheDocument();
        expect(screen.getByText('Small')).toBeInTheDocument();
        expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('renders Required badge for required groups', () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('renders surcharge for options that have one', () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('+2 ₫')).toBeInTheDocument();
    });

    it('renders dash for options with no surcharge', () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('opens add group dialog when Add group button is clicked', async () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add group/i });
        await userEvent.click(addGroupBtn);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText(/group label/i)).toBeInTheDocument();
    });

    it('Save group button is disabled when label is empty', async () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add group/i });
        await userEvent.click(addGroupBtn);

        const saveBtn = screen.getByRole('button', { name: /^save group$/i });
        expect(saveBtn).toBeDisabled();
    });

    it('adds a customisation group when dialog form is submitted', async () => {
        server.use(
            http.post(GROUPS_URL, () =>
                HttpResponse.json({
                    id: 'group-new',
                    foodId: 'food-1',
                    label: 'Spice Level',
                    isRequired: false,
                    displayOrder: 0,
                })
            )
        );

        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add group/i });
        await userEvent.click(addGroupBtn);

        const labelInput = screen.getByLabelText(/group label/i);
        await userEvent.type(labelInput, 'Spice Level');

        const saveBtn = screen.getByRole('button', { name: /^save group$/i });
        await userEvent.click(saveBtn);

        // After success the dialog closes and the new group appears
        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Spice Level')).toBeInTheDocument();
    });

    it('opens add option dialog when Add option button is clicked on a group', async () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const addOptionBtn = screen.getByRole('button', { name: /add option/i });
        await userEvent.click(addOptionBtn);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByLabelText(/option label/i)).toBeInTheDocument();
    });

    it('Save option button is disabled when option label is empty', async () => {
        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const addOptionBtn = screen.getByRole('button', { name: /add option/i });
        await userEvent.click(addOptionBtn);

        const saveBtn = screen.getByRole('button', { name: /^save option$/i });
        expect(saveBtn).toBeDisabled();
    });

    it('adds an option to a group when option dialog is submitted', async () => {
        server.use(
            http.post(OPTIONS_URL, () =>
                HttpResponse.json({
                    id: 'option-new',
                    groupId: 'group-1',
                    label: 'Medium',
                    surcharge: null,
                    displayOrder: 2,
                })
            )
        );

        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const addOptionBtn = screen.getByRole('button', { name: /add option/i });
        await userEvent.click(addOptionBtn);

        const optionLabelInput = screen.getByLabelText(/option label/i);
        await userEvent.type(optionLabelInput, 'Medium');

        const saveBtn = screen.getByRole('button', { name: /^save option$/i });
        await userEvent.click(saveBtn);

        await waitFor(() => {
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });
        expect(screen.getByText('Medium')).toBeInTheDocument();
    });

    it('triggers delete group mutation after confirming the alert dialog', async () => {
        let deleteGroupCalled = false;
        server.use(
            http.delete(GROUP_URL, () => {
                deleteGroupCalled = true;
                return new HttpResponse(null, { status: 204 });
            })
        );

        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const trashButtons = screen.getAllByRole('button').filter(btn => {
            return btn.querySelector('svg.lucide-trash-2') !== null;
        });
        // First trash button opens the group delete confirmation dialog
        await userEvent.click(trashButtons[0]);

        const confirmButton = await screen.findByRole('button', { name: 'Remove' });
        await userEvent.click(confirmButton);

        await waitFor(() => {
            expect(deleteGroupCalled).toBe(true);
        });
    });

    it('triggers delete option mutation after confirming the alert dialog', async () => {
        let deleteOptionCalled = false;
        server.use(
            http.delete(OPTION_URL, () => {
                deleteOptionCalled = true;
                return new HttpResponse(null, { status: 204 });
            })
        );

        renderWithProviders(<FoodCustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const trashButtons = screen.getAllByRole('button').filter(btn => {
            return btn.querySelector('svg.lucide-trash-2') !== null;
        });
        // Second trash button is the first option-level delete trigger
        await userEvent.click(trashButtons[1]);

        const confirmButton = await screen.findByRole('button', { name: 'Remove' });
        await userEvent.click(confirmButton);

        await waitFor(() => {
            expect(deleteOptionCalled).toBe(true);
        });
    });
});
