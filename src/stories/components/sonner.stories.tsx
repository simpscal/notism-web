import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Button } from '@/components/button';
import { Toaster } from '@/components/sonner';

function SonnerDemo() {
    const { t } = useTranslation();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <Button
                variant='outline'
                onClick={() =>
                    toast(t('storybook.sonner.eventCreated'), { description: t('storybook.sonner.eventDescription') })
                }
            >
                {t('storybook.sonner.showDefault')}
            </Button>
            <Button variant='outline' onClick={() => toast.success(t('storybook.sonner.profileUpdated'))}>
                {t('storybook.sonner.showSuccess')}
            </Button>
            <Button variant='outline' onClick={() => toast.error(t('storybook.sonner.somethingWrong'))}>
                {t('storybook.sonner.showError')}
            </Button>
            <Button variant='outline' onClick={() => toast.warning(t('storybook.sonner.lowStorage'))}>
                {t('storybook.sonner.showWarning')}
            </Button>
            <Button variant='outline' onClick={() => toast.info(t('storybook.sonner.updateAvailable'))}>
                {t('storybook.sonner.showInfo')}
            </Button>
            <Toaster />
        </div>
    );
}

const meta = {
    title: 'Components/Utilities/Sonner',
    component: SonnerDemo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof SonnerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
