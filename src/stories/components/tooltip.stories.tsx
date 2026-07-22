import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { Button } from '@/uis/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/uis/tooltip';

const meta = {
    title: 'Components/Utilities/Tooltip',
    component: Tooltip,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant='outline'>{t('storybook.tooltip.hoverMe')}</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('storybook.tooltip.addToLibrary')}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    },
};

export const Positions: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <div style={{ display: 'flex', gap: '32px', padding: '32px' }}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='outline' size='sm'>
                                {t('storybook.tooltip.top')}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='top'>
                            <p>{t('storybook.tooltip.tooltipTop')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='outline' size='sm'>
                                {t('storybook.tooltip.right')}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='right'>
                            <p>{t('storybook.tooltip.tooltipRight')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='outline' size='sm'>
                                {t('storybook.tooltip.bottom')}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='bottom'>
                            <p>{t('storybook.tooltip.tooltipBottom')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant='outline' size='sm'>
                                {t('storybook.tooltip.left')}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side='left'>
                            <p>{t('storybook.tooltip.tooltipLeft')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    },
};
