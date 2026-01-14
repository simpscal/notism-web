import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';

import { Button } from './button';
import { Input } from './input';

export type PasswordInputProps = Omit<React.ComponentProps<'input'>, 'type'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div className='relative'>
            <Input ref={ref} type={isVisible ? 'text' : 'password'} className={className} {...props} />
            <Button
                type='button'
                variant='ghost'
                size='sm'
                onClick={() => setIsVisible(!isVisible)}
                className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
                disabled={props.disabled}
            >
                {isVisible ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
            </Button>
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';
