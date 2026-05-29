import type { Meta, StoryObj } from '@storybook/react-vite';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/resizable';

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

export const Horizontal: Story = {
    render: () => (
        <ResizablePanelGroup direction='horizontal' className='min-h-[200px] max-w-md rounded-lg border'>
            <ResizablePanel defaultSize={50}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Panel One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Panel Two</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

export const Vertical: Story = {
    render: () => (
        <ResizablePanelGroup direction='vertical' className='min-h-[400px] max-w-md rounded-lg border'>
            <ResizablePanel defaultSize={25}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Header</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Content</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};

export const WithHandle: Story = {
    render: () => (
        <ResizablePanelGroup direction='horizontal' className='min-h-[200px] max-w-md rounded-lg border'>
            <ResizablePanel defaultSize={50}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Panel One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px',
                    }}
                >
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>Panel Two</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    ),
};
