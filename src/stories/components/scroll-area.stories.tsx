import type { Meta, StoryObj } from '@storybook/react-vite';
import { useTranslation } from 'react-i18next';

import { ScrollArea } from '@/components/scroll-area';
import { Separator } from '@/components/separator';

const tags = Array.from({ length: 50 }).map((_, i) => `v1.2.0-beta.${i + 1}`);

const meta = {
    title: 'Components/Layout/ScrollArea',
    component: ScrollArea,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: function Render() {
        const { t } = useTranslation();
        return (
            <ScrollArea className='h-72 w-48 rounded-md border'>
                <div style={{ padding: '16px' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '14px', fontWeight: 500, lineHeight: 1 }}>
                        {t('storybook.scrollArea.tags')}
                    </h4>
                    {tags.map(tag => (
                        <div key={tag}>
                            <div style={{ fontSize: '14px', padding: '4px 0' }}>{tag}</div>
                            <Separator className='my-2' />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        );
    },
};
