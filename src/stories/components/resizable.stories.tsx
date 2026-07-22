import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/uis/resizable';

const meta = {
    title: 'Components/Layout/Resizable',
    component: ResizablePanelGroup,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const panelStyle = {
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
} as const;

const labelStyle = { fontSize: '14px', fontWeight: 500 } as const;

export const Horizontal: Story = {
    args: { direction: 'horizontal' },
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ResizablePanelGroup direction='horizontal' className='min-h-[200px] max-w-md rounded-lg border'>
                <ResizablePanel defaultSize={50}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.panelOne')}</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={50}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.panelTwo')}</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        );
    },
};

export const Vertical: Story = {
    args: { direction: 'horizontal' },
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ResizablePanelGroup direction='vertical' className='min-h-[400px] max-w-md rounded-lg border'>
                <ResizablePanel defaultSize={25}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.header')}</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={75}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.content')}</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        );
    },
};

export const WithHandle: Story = {
    args: { direction: 'horizontal' },
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ResizablePanelGroup direction='horizontal' className='min-h-[200px] max-w-md rounded-lg border'>
                <ResizablePanel defaultSize={50}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.panelOne')}</span>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                    <div style={panelStyle}>
                        <span style={labelStyle}>{t('storybook.resizable.panelTwo')}</span>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        );
    },
};
