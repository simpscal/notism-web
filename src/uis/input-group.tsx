import * as React from 'react';
import { memo } from 'react';

import { cn } from '@/app/utils/index';
import { Button } from '@/uis/button';
import { Input } from '@/uis/input';

const INPUT_GROUP_INPUT = 'InputGroupInput';
const INPUT_GROUP_ADDON = 'InputGroupAddon';

type InputGroupAddonAlign = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

interface InputGroupContextValue {
    hasInlineStartAddon: boolean;
    hasInlineEndAddon: boolean;
}

const InputGroupContext = React.createContext<InputGroupContextValue>({
    hasInlineStartAddon: false,
    hasInlineEndAddon: false,
});

function InputGroupComponent({ className, children, ...props }: React.ComponentProps<'div'>) {
    const childArray = React.Children.toArray(children);
    let hasInlineStartAddon = false;
    let hasInlineEndAddon = false;

    childArray.forEach(child => {
        if (
            React.isValidElement(child) &&
            (child.type as { displayName?: string })?.displayName === INPUT_GROUP_ADDON
        ) {
            const align = (child.props as { align?: InputGroupAddonAlign }).align ?? 'inline-start';
            if (align === 'inline-start') hasInlineStartAddon = true;
            if (align === 'inline-end') hasInlineEndAddon = true;
        }
    });

    const contextValue: InputGroupContextValue = { hasInlineStartAddon, hasInlineEndAddon };

    return (
        <InputGroupContext.Provider value={contextValue}>
            <div
                data-slot='input-group'
                className={cn(
                    'border-input focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px] relative flex h-9 w-full min-w-0 rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </InputGroupContext.Provider>
    );
}

const InputGroup = memo(InputGroupComponent);
InputGroup.displayName = 'InputGroup';

function InputGroupInputComponent({ className, ...props }: React.ComponentProps<typeof Input>) {
    const { hasInlineStartAddon, hasInlineEndAddon } = React.useContext(InputGroupContext);

    return (
        <Input
            data-slot='input-group-control'
            className={cn(
                'border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0',
                hasInlineStartAddon && 'pl-9',
                hasInlineEndAddon && 'pr-9',
                className
            )}
            {...props}
        />
    );
}

const InputGroupInput = memo(InputGroupInputComponent);
InputGroupInput.displayName = INPUT_GROUP_INPUT;

interface InputGroupAddonProps extends React.ComponentProps<'div'> {
    align?: InputGroupAddonAlign;
}

function InputGroupAddonComponent({ className, align = 'inline-start', children, ...props }: InputGroupAddonProps) {
    const alignClasses: Record<InputGroupAddonAlign, string> = {
        'inline-start': 'left-0 inset-y-0 flex items-center pl-3',
        'inline-end': 'right-0 left-auto inset-y-0 flex items-center pr-3',
        'block-start': 'left-0 right-0 top-0 flex items-center pb-2',
        'block-end': 'left-0 right-0 bottom-0 top-auto flex items-center pt-2',
    };

    return (
        <div
            data-slot='input-group-addon'
            className={cn(
                'pointer-events-none absolute text-muted-foreground [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0',
                alignClasses[align],
                className
            )}
            aria-hidden
            {...props}
        >
            {children}
        </div>
    );
}

const InputGroupAddon = memo(InputGroupAddonComponent);
InputGroupAddon.displayName = INPUT_GROUP_ADDON;

function InputGroupTextComponent({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot='input-group-text'
            className={cn('text-muted-foreground whitespace-nowrap text-sm', className)}
            {...props}
        />
    );
}

const InputGroupText = memo(InputGroupTextComponent);
InputGroupText.displayName = 'InputGroupText';

interface InputGroupButtonProps extends React.ComponentProps<typeof Button> {
    size?: 'xs' | 'icon-xs' | 'sm' | 'icon-sm';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}

function InputGroupButtonComponent({
    className,
    size = 'icon-xs',
    variant = 'ghost',
    ...props
}: InputGroupButtonProps) {
    return (
        <Button
            data-slot='input-group-button'
            variant={variant}
            size={size}
            className={cn('pointer-events-auto shrink-0', className)}
            {...props}
        />
    );
}

const InputGroupButton = memo(InputGroupButtonComponent);
InputGroupButton.displayName = 'InputGroupButton';

export { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText };
