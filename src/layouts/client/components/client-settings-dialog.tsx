import { memo } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/dialog';
import { Field, FieldLabel } from '@/components/field';
import { Label } from '@/components/label';
import { RadioGroup, RadioGroupItem } from '@/components/radio-group';
import { useTheme } from '@/core/contexts/theme.context';

interface ClientSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function ClientSettingsDialog({ open, onOpenChange }: ClientSettingsDialogProps) {
    const { theme, setTheme } = useTheme();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>Manage your application preferences</DialogDescription>
                </DialogHeader>

                <div className='space-y-6 py-4'>
                    <Field>
                        <FieldLabel>Theme</FieldLabel>
                        <RadioGroup
                            value={theme}
                            onValueChange={value => setTheme(value as 'light' | 'dark' | 'system')}
                        >
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='light' id='light' />
                                <Label htmlFor='light' className='font-normal cursor-pointer'>
                                    Light
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='dark' id='dark' />
                                <Label htmlFor='dark' className='font-normal cursor-pointer'>
                                    Dark
                                </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <RadioGroupItem value='system' id='system' />
                                <Label htmlFor='system' className='font-normal cursor-pointer'>
                                    System
                                </Label>
                            </div>
                        </RadioGroup>
                    </Field>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default memo(ClientSettingsDialog);
