import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin } from 'lucide-react';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import UserProfileAvatar from './user-profile-avatar';

import { storageApi, userApi } from '@/apis';
import { PresignedUrlUploadEnum } from '@/app/enums';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { updateUser } from '@/store/user/user.slice';

const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
    avatarUrl: z.string().nullable().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function SettingsProfileSection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.user)!;
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarRemoved, setAvatarRemoved] = useState(false);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            avatarUrl: user.avatarUrl || null,
            phone: '',
            location: '',
        },
    });

    const {
        formState: { errors, isDirty },
    } = form;

    const handleAvatarChange = (file: File, base64: string) => {
        setSelectedFile(file);
        setAvatarRemoved(false);
        form.setValue('avatarUrl', base64);
    };

    const handleAvatarRemove = () => {
        setSelectedFile(null);
        setAvatarRemoved(true);
        form.setValue('avatarUrl', null);
    };

    const uploadAvatarToStorage = async (file: File): Promise<string | null> => {
        const presignedData = await storageApi.getPresignedUrl(file.name, file.type, PresignedUrlUploadEnum.Avatar);

        await storageApi.uploadToPresignedUrl(presignedData.uploadUrl, file);

        return presignedData.fileKey;
    };

    const handleFormSubmit = (values: ProfileFormValues) => {
        setIsLoading(true);

        const updateProfile = (avatarUrl: string | null) => {
            return userApi.updateProfile({
                firstName: values.firstName,
                lastName: values.lastName,
                avatarUrl,
            });
        };

        const handleSuccess = () => {
            const formValues = form.getValues();
            dispatch(
                updateUser({
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    email: formValues.email,
                    avatarUrl: formValues.avatarUrl || null,
                })
            );
            form.reset(values);
            setSelectedFile(null);
            setAvatarRemoved(false);
            toast.success('Profile updated successfully!');
        };

        if (selectedFile) {
            uploadAvatarToStorage(selectedFile)
                .then(avatarUrl => updateProfile(avatarUrl))
                .then(handleSuccess)
                .finally(() => {
                    setIsLoading(false);
                });
        } else if (avatarRemoved) {
            updateProfile(null)
                .then(handleSuccess)
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            const avatarUrl = form.getValues().avatarUrl ?? user.avatarUrl ?? null;
            updateProfile(avatarUrl)
                .then(handleSuccess)
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const handleCancel = () => {
        form.reset({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            avatarUrl: user.avatarUrl || null,
            phone: '',
            location: '',
        });
        setSelectedFile(null);
        setAvatarRemoved(false);
    };

    return (
        <div className='space-y-6'>
            <div>
                <h2 className='text-2xl font-semibold tracking-tight'>Profile Settings</h2>
                <p className='text-muted-foreground mt-1'>Manage your account information and preferences</p>
            </div>

            <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Manage your account information and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        {/* Profile Picture */}
                        <div>
                            <h3 className='text-sm font-medium mb-2'>Profile Picture</h3>
                            <UserProfileAvatar
                                avatarUrl={avatarRemoved ? null : form.watch('avatarUrl') || user.avatarUrl || null}
                                firstName={form.watch('firstName') || user.firstName || ''}
                                lastName={form.watch('lastName') || user.lastName || ''}
                                isLoading={isLoading}
                                onAvatarChange={handleAvatarChange}
                                onAvatarRemove={handleAvatarRemove}
                            />
                        </div>

                        {/* Basic Information */}
                        <div className='space-y-6 pt-4 border-t'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                <Field data-invalid={!!errors.firstName}>
                                    <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                                    <Input
                                        id='firstName'
                                        placeholder='Enter your first name'
                                        disabled={isLoading}
                                        {...form.register('firstName')}
                                    />
                                    {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
                                </Field>

                                <Field data-invalid={!!errors.lastName}>
                                    <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                                    <Input
                                        id='lastName'
                                        placeholder='Enter your last name'
                                        disabled={isLoading}
                                        {...form.register('lastName')}
                                    />
                                    {errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor='email' className='flex items-center gap-2'>
                                    <Mail className='h-4 w-4' />
                                    Email
                                </FieldLabel>
                                <Input
                                    id='email'
                                    type='email'
                                    value={form.watch('email')}
                                    disabled
                                    className='bg-muted cursor-not-allowed'
                                />
                            </Field>
                        </div>

                        {/* Contact Information */}
                        <div className='space-y-6 pt-4 border-t'>
                            <Field data-invalid={!!errors.phone}>
                                <FieldLabel htmlFor='phone' className='flex items-center gap-2'>
                                    <Phone className='h-4 w-4' />
                                    Phone Number
                                </FieldLabel>
                                <Input
                                    id='phone'
                                    type='tel'
                                    placeholder='+1 (555) 123-4567'
                                    disabled={isLoading}
                                    {...form.register('phone')}
                                />
                                {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                            </Field>

                            <Field data-invalid={!!errors.location}>
                                <FieldLabel htmlFor='location' className='flex items-center gap-2'>
                                    <MapPin className='h-4 w-4' />
                                    Location
                                </FieldLabel>
                                <Input
                                    id='location'
                                    placeholder='City, Country'
                                    disabled={isLoading}
                                    {...form.register('location')}
                                />
                                {errors.location && <FieldError>{errors.location.message}</FieldError>}
                            </Field>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className='flex justify-end gap-3 pt-4 border-t'>
                    <Button
                        type='button'
                        variant='outline'
                        onClick={handleCancel}
                        disabled={isLoading || (!isDirty && !selectedFile && !avatarRemoved)}
                    >
                        Cancel
                    </Button>
                    <Button type='submit' disabled={isLoading || (!isDirty && !selectedFile && !avatarRemoved)}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default memo(SettingsProfileSection);
