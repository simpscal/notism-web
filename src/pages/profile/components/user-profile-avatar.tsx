import { memo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Icon } from '@/components/icon/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserProfileAvatarProps {
    avatarUrl: string | null;
    firstName: string;
    lastName: string;
    isLoading?: boolean;
    onAvatarChange: (file: File) => void;
    onAvatarRemove: () => void;
}

function UserProfileAvatar({
    avatarUrl,
    firstName,
    lastName,
    isLoading = false,
    onAvatarChange,
    onAvatarRemove,
}: UserProfileAvatarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);

    const currentAvatarUrl = localAvatarUrl || avatarUrl;

    const getInitials = () => {
        const first = firstName?.charAt(0) || '';
        const last = lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase() || 'U';
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setLocalAvatarUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
        onAvatarChange(file);
    };

    const handleRemoveAvatar = () => {
        setLocalAvatarUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onAvatarRemove();
    };

    return (
        <div className='flex items-center gap-6'>
            <div className='relative shrink-0'>
                <Avatar className='h-24 w-24'>
                    <AvatarImage
                        src={currentAvatarUrl || undefined}
                        alt={`${firstName} ${lastName}`}
                        className='object-cover'
                    />
                    <AvatarFallback className='text-lg'>{getInitials()}</AvatarFallback>
                </Avatar>
                {currentAvatarUrl && (
                    <Button
                        onClick={handleRemoveAvatar}
                        size='icon'
                        variant='destructive'
                        className='absolute top-0 right-0 h-6 w-6 rounded-full shadow-sm -translate-x-1/2 -translate-y-1/2'
                        aria-label='Remove avatar'
                    >
                        <Icon name='close' size={14} />
                    </Button>
                )}
            </div>
            <div className='space-y-2'>
                <Button type='button' variant='outline' onClick={handleAvatarClick} disabled={isLoading}>
                    {currentAvatarUrl ? 'Change Avatar' : 'Upload Avatar'}
                </Button>
                <p className='text-sm text-muted-foreground'>JPG, PNG or GIF. Max size of 5MB.</p>
            </div>
            <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                onChange={handleAvatarChange}
                className='hidden'
                disabled={isLoading}
            />
        </div>
    );
}

export default memo(UserProfileAvatar);
