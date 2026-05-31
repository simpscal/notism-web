import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import CustomisationManager from '../customisation-manager';

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

describe('CustomisationManager', () => {
    it('renders empty state when no customisation groups exist', () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={[]} />);

        expect(screen.getByText(/no customisation groups yet/i)).toBeInTheDocument();
    });

    it('renders customisation groups with options', () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('Size')).toBeInTheDocument();
        expect(screen.getByText('Small')).toBeInTheDocument();
        expect(screen.getByText('Large')).toBeInTheDocument();
    });

    it('renders Required badge for required groups', () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('Required')).toBeInTheDocument();
    });

    it('renders surcharge for options that have one', () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('shows add group form when Add Group button is clicked', async () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add customisation group/i });
        await userEvent.click(addGroupBtn);

        expect(screen.getByPlaceholderText(/group label/i)).toBeInTheDocument();
    });

    it('adds a customisation group when form is submitted', async () => {
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

        renderWithProviders(<CustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add customisation group/i });
        await userEvent.click(addGroupBtn);

        const labelInput = screen.getByPlaceholderText(/group label/i);
        await userEvent.type(labelInput, 'Spice Level');

        const saveBtn = screen.getByRole('button', { name: /^save group$/i });
        await userEvent.click(saveBtn);

        // After success the inline form is hidden and the add button reappears
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /add customisation group/i })).toBeInTheDocument();
        });
        expect(screen.queryByPlaceholderText(/group label/i)).not.toBeInTheDocument();
    });

    it('shows inline error when group label is empty on submit', async () => {
        server.use(http.post(GROUPS_URL, () => HttpResponse.json({ message: 'Label is required' }, { status: 400 })));

        renderWithProviders(<CustomisationManager foodId='food-1' customisations={[]} />);

        const addGroupBtn = screen.getByRole('button', { name: /add customisation group/i });
        await userEvent.click(addGroupBtn);

        const saveBtn = screen.getByRole('button', { name: /^save group$/i });
        await userEvent.click(saveBtn);

        await waitFor(() => {
            expect(screen.getByText(/label is required/i)).toBeInTheDocument();
        });
    });

    it('shows add option form for each group', () => {
        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        expect(screen.getByPlaceholderText(/option label/i)).toBeInTheDocument();
    });

    it('adds an option to a group when option form is submitted', async () => {
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

        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const optionLabelInput = screen.getByPlaceholderText(/option label/i);
        await userEvent.type(optionLabelInput, 'Medium');

        const addOptionBtn = screen.getByRole('button', { name: /^add option$/i });
        await userEvent.click(addOptionBtn);

        await waitFor(() => {
            expect(optionLabelInput).toHaveValue('');
        });
    });

    it('triggers delete group mutation when confirmed in AlertDialog', async () => {
        let deleteGroupCalled = false;
        server.use(
            http.delete(GROUP_URL, () => {
                deleteGroupCalled = true;
                return new HttpResponse(null, { status: 204 });
            })
        );

        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const deleteGroupBtn = screen.getByRole('button', { name: /delete group/i });
        await userEvent.click(deleteGroupBtn);

        const confirmBtn = await screen.findByRole('button', { name: /^delete$/i });
        await userEvent.click(confirmBtn);

        await waitFor(() => {
            expect(deleteGroupCalled).toBe(true);
        });
    });

    it('triggers delete option mutation when confirmed in AlertDialog', async () => {
        let deleteOptionCalled = false;
        server.use(
            http.delete(OPTION_URL, () => {
                deleteOptionCalled = true;
                return new HttpResponse(null, { status: 204 });
            })
        );

        renderWithProviders(<CustomisationManager foodId='food-1' customisations={mockCustomisations} />);

        const deleteOptionBtns = screen.getAllByRole('button', { name: /delete option/i });
        await userEvent.click(deleteOptionBtns[0]);

        const confirmBtn = await screen.findByRole('button', { name: /^delete$/i });
        await userEvent.click(confirmBtn);

        await waitFor(() => {
            expect(deleteOptionCalled).toBe(true);
        });
    });
});
