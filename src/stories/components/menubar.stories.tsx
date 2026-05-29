import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from '@/components/menubar';

const meta = {
    title: 'Components/Navigation/Menubar',
    component: Menubar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        New Window <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>New Incognito Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                        Print... <MenubarShortcut>⌘P</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                        Cut <MenubarShortcut>⌘X</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Copy <MenubarShortcut>⌘C</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Paste <MenubarShortcut>⌘V</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem>
                        Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                        Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                        Full Screen <MenubarShortcut>⌘⇧F</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};
