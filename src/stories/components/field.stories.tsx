import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';

const meta = {
    title: 'Components/Inputs/Field',
    component: Field,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '320px' }}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>{t('storybook.field.emailAddress')}</FieldLabel>
                        <Input type='email' placeholder={t('storybook.field.emailPlaceholder')} />
                        <FieldDescription>{t('storybook.field.neverShare')}</FieldDescription>
                    </Field>
                </FieldGroup>
            </div>
        );
    },
};

export const WithError: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '320px' }}>
                <FieldGroup>
                    <Field>
                        <FieldLabel>{t('storybook.field.emailAddress')}</FieldLabel>
                        <Input type='email' placeholder={t('storybook.field.emailPlaceholder')} aria-invalid />
                        <FieldError errors={[{ message: t('storybook.field.invalidEmail') }]} />
                    </Field>
                </FieldGroup>
            </div>
        );
    },
};

export const Horizontal: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ width: '400px' }}>
                <FieldGroup>
                    <Field orientation='horizontal'>
                        <FieldLabel>{t('storybook.field.username')}</FieldLabel>
                        <Input placeholder={t('storybook.field.usernamePlaceholder')} />
                    </Field>
                </FieldGroup>
            </div>
        );
    },
};
