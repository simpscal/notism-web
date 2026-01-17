import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UserProfileAvatar } from './components';

import { storageApi, userApi } from '@/apis';
import { PresignedUrlUploadEnum } from '@/app/enums';
import { Button } from '@/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { updateUser } from '@/store/user/user.slice';

const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
    avatarUrl: z.string().nullable().optional(),
    bio: z.string().max(500, { message: 'Bio must be less than 500 characters' }).optional(),
    phone: z.string().optional(),
    website: z.string().url({ message: 'Please enter a valid URL' }).optional().or(z.literal('')),
    location: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

function Profile() {
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
            bio: '',
            phone: '',
            website: '',
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
            bio: '',
            phone: '',
            website: '',
            location: '',
        });
        setSelectedFile(null);
        setAvatarRemoved(false);
    };

    return (
        <div className='container mx-auto py-8 px-4 max-w-4xl'>
            <div className='space-y-6'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight'>Profile Settings</h1>
                    <p className='text-muted-foreground mt-2'>Manage your account information and preferences</p>
                </div>

                <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-6'>
                    {/* Profile Picture Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Picture</CardTitle>
                            <CardDescription>Upload a profile picture to personalize your account</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserProfileAvatar
                                avatarUrl={avatarRemoved ? null : form.watch('avatarUrl') || user.avatarUrl || null}
                                firstName={form.watch('firstName') || user.firstName || ''}
                                lastName={form.watch('lastName') || user.lastName || ''}
                                isLoading={isLoading}
                                onAvatarChange={handleAvatarChange}
                                onAvatarRemove={handleAvatarRemove}
                            />
                        </CardContent>
                    </Card>

                    {/* Basic Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Your basic account details</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
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
                        </CardContent>
                    </Card>

                    {/* Personal Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Tell us more about yourself</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            <Field data-invalid={!!errors.bio}>
                                <FieldLabel htmlFor='bio'>Bio</FieldLabel>
                                <Textarea
                                    id='bio'
                                    placeholder='Tell us about yourself...'
                                    disabled={isLoading}
                                    rows={4}
                                    className='resize-none'
                                    {...form.register('bio')}
                                />
                                {errors.bio && <FieldError>{errors.bio.message}</FieldError>}
                                <p className='text-sm text-muted-foreground mt-1'>
                                    {form.watch('bio')?.length || 0}/500 characters
                                </p>
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
                        </CardContent>
                    </Card>

                    {/* Contact Information Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                            <CardDescription>Your contact details and online presence</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
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

                            <Field data-invalid={!!errors.website}>
                                <FieldLabel htmlFor='website' className='flex items-center gap-2'>
                                    <Globe className='h-4 w-4' />
                                    Website
                                </FieldLabel>
                                <Input
                                    id='website'
                                    type='url'
                                    placeholder='https://example.com'
                                    disabled={isLoading}
                                    {...form.register('website')}
                                />
                                {errors.website && <FieldError>{errors.website.message}</FieldError>}
                            </Field>
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
        </div>
    );
}

export default memo(Profile);
