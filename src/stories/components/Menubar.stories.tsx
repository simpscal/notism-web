import type { Meta, StoryObj } from '@storybook/react-vite';

import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from '@/components/menubar';

const meta = {
    title: 'Components/Menubar',
    component: Menubar,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
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
                    <MenubarSub>
                        <MenubarSubTrigger>Share</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem>Email link</MenubarItem>
                            <MenubarItem>Messages</MenubarItem>
                            <MenubarItem>Notes</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem>
                        Print… <MenubarShortcut>⌘P</MenubarShortcut>
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
                    <MenubarGroup>
                        <MenubarLabel>Clipboard</MenubarLabel>
                        <MenubarItem>
                            Cut <MenubarShortcut>⌘X</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Copy <MenubarShortcut>⌘C</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            Paste <MenubarShortcut>⌘V</MenubarShortcut>
                        </MenubarItem>
                    </MenubarGroup>
                    <MenubarSeparator />
                    <MenubarItem variant='destructive'>Delete Selection</MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
                    <MenubarCheckboxItem>Show Statusbar</MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarLabel inset>Zoom</MenubarLabel>
                    <MenubarRadioGroup value='100'>
                        <MenubarRadioItem value='75'>75%</MenubarRadioItem>
                        <MenubarRadioItem value='100'>100%</MenubarRadioItem>
                        <MenubarRadioItem value='125'>125%</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <MenubarItem inset>
                        Toggle Full Screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    ),
};

export const ElevatedMenuContent: Story = {
    name: 'Elevated Shadow Tier',
    render: () => (
        <div className='pb-64'>
            <p className='text-xs tracking-caps text-muted-foreground mb-4'>
                MenubarContent and MenubarSubContent use shadow-elevated (Tier 2)
            </p>
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger>Orders</MenubarTrigger>
                    <MenubarContent className='shadow-elevated'>
                        <MenubarLabel className='tracking-caps text-muted-foreground'>Actions</MenubarLabel>
                        <MenubarSeparator />
                        <MenubarItem>
                            New Order <MenubarShortcut>⌘N</MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem>
                            View Queue <MenubarShortcut>⌘Q</MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>Export</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem>CSV</MenubarItem>
                                <MenubarItem>PDF</MenubarItem>
                                <MenubarItem>Excel</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSeparator />
                        <MenubarItem variant='destructive'>Clear All</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Reports</MenubarTrigger>
                    <MenubarContent className='shadow-elevated'>
                        <MenubarCheckboxItem checked>Daily Summary</MenubarCheckboxItem>
                        <MenubarCheckboxItem>Weekly Trends</MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarRadioGroup value='revenue'>
                            <MenubarLabel inset>Sort by</MenubarLabel>
                            <MenubarRadioItem value='revenue'>Revenue</MenubarRadioItem>
                            <MenubarRadioItem value='orders'>Order Count</MenubarRadioItem>
                            <MenubarRadioItem value='items'>Items Sold</MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    ),
};
