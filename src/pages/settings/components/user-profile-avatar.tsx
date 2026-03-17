import { Camera, Trash2, Upload } from 'lucide-react';
import { memo, useRef, useState } from 'react';
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
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

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
            toast.error('Please select an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
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

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
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
        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
            <div
                className='relative group cursor-pointer'
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleAvatarClick}
            >
                <div
                    className={`relative transition-all duration-300 group-hover:scale-105 ${
                        isDragging ? 'scale-105 ring-4 ring-primary ring-offset-2' : ''
                    }`}
                >
                    <Avatar className='h-32 w-32 border-4 border-background shadow-lg ring-2 ring-border'>
                        <AvatarImage
                            src={currentAvatarUrl || undefined}
                            alt={`${firstName} ${lastName}`}
                            className='object-cover'
                        />
                        <AvatarFallback className='text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/40 text-primary'>
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>

                    {/* Overlay on hover */}
                    <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
                        <div className='flex flex-col items-center gap-1 text-white'>
                            <Camera className='h-6 w-6' />
                            <span className='text-xs font-medium'>Change Photo</span>
                        </div>
                    </div>

                    {/* Loading overlay */}
                    {isLoading && (
                        <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center'>
                            <div className='h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent' />
                        </div>
                    )}

                    {/* Remove button */}
                    {currentAvatarUrl && !isLoading && (
                        <Button
                            onClick={handleRemoveAvatar}
                            size='icon'
                            variant='destructive'
                            className='absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg ring-2 ring-background hover:scale-110 transition-transform'
                            aria-label='Remove avatar'
                        >
                            <Trash2 className='h-4 w-4' />
                        </Button>
                    )}
                </div>

                {/* Drag and drop indicator */}
                {isDragging && (
                    <div className='absolute inset-0 rounded-full border-4 border-dashed border-primary bg-primary/10 flex items-center justify-center z-10'>
                        <div className='flex flex-col items-center gap-2 text-primary'>
                            <Upload className='h-8 w-8' />
                            <span className='text-sm font-medium'>Drop image here</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex-1 space-y-3'>
                <div>
                    <h3 className='text-sm font-medium mb-1'>Profile Picture</h3>
                    <p className='text-sm text-muted-foreground mb-4'>
                        Upload a photo to personalize your profile. JPG, PNG or GIF. Max size of 5MB.
                    </p>
                </div>
                <div className='flex flex-wrap gap-2'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleAvatarClick}
                        disabled={isLoading}
                        className='gap-2'
                    >
                        <Upload className='h-4 w-4' />
                        {currentAvatarUrl ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                    {currentAvatarUrl && (
                        <Button
                            type='button'
                            variant='outline'
                            onClick={handleRemoveAvatar}
                            disabled={isLoading}
                            className='gap-2 text-destructive hover:text-destructive'
                        >
                            <Trash2 className='h-4 w-4' />
                            Remove
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
