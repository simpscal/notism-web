import { Camera, Trash2, Upload } from 'lucide-react';
import { memo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/avatar';
import { Button } from '@/components/button';

interface UserProfileAvatarProps {
    avatarUrl: string | null;
    firstName: string;
    lastName: string;
    isLoading?: boolean;
    onAvatarChange: (file: File, base64: string) => void;
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
    const { t } = useTranslation();
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

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error(t('settings.profile.imageTypeError'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('settings.profile.imageSizeError'));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLocalAvatarUrl(base64);
            onAvatarChange(file, base64);
        };
        reader.readAsDataURL(file);
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        processFile(file);
    };

    const handleRemoveAvatar = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLocalAvatarUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onAvatarRemove();
    };

    return (
        <div className='flex flex-col items-start gap-5 sm:flex-row sm:items-center'>
            <div className='relative'>
                <Avatar className='h-20 w-20 border border-border shadow-sm'>
                    <AvatarImage
                        src={currentAvatarUrl || undefined}
                        alt={`${firstName} ${lastName}`}
                        className='object-cover'
                    />
                    <AvatarFallback className='bg-primary/10 text-lg font-semibold text-primary'>
                        {getInitials()}
                    </AvatarFallback>
                </Avatar>
                <span className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow'>
                    <Camera className='h-3 w-3' />
                </span>
            </div>

            <div className='flex-1 space-y-2.5'>
                <div>
                    <h3 className='text-sm font-medium'>{t('settings.profile.profilePhoto')}</h3>
                    <p className='mt-0.5 text-xs text-muted-foreground'>{t('settings.profile.photoHelper')}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button type='button' variant='outline' size='sm' onClick={handleAvatarClick} disabled={isLoading}>
                        <Upload className='h-4 w-4' />
                        {currentAvatarUrl ? t('settings.profile.change') : t('settings.profile.upload')}
                    </Button>
                    {currentAvatarUrl && (
                        <Button
                            type='button'
                            variant='outline'
                            size='sm'
                            onClick={handleRemoveAvatar}
                            disabled={isLoading}
                            className='text-destructive hover:text-destructive'
                        >
                            <Trash2 className='h-4 w-4' />
                            {t('settings.profile.remove')}
                        </Button>
                    )}
                </div>
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
