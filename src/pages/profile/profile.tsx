import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { UserProfileAvatar } from './components';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { storageApi } from '@/core/apis';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { userApi } from '@/features/user/apis';
import { UserProfileVM } from '@/features/user/models';
import { updateUser } from '@/store/user/user.slice';

const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email(),
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
        },
    });

    const {
        formState: { errors, isDirty },
    } = form;

    const handleAvatarChange = (file: File) => {
        setSelectedFile(file);
        setAvatarRemoved(false);
    };

    const handleAvatarRemove = () => {
        setSelectedFile(null);
        setAvatarRemoved(true);
    };

    const uploadAvatarToStorage = async (file: File): Promise<string | null> => {
        const presignedData = await storageApi.getPresignedUrl(file.name, file.type);

        await storageApi.uploadToPresignedUrl(presignedData.uploadUrl, file);

        return presignedData.fileKey;
    };

    const handleFormSubmit = async (values: ProfileFormValues) => {
        setIsLoading(true);

        const updateProfile = (avatarUrl: string | null) => {
            return userApi.updateProfile(user.id, {
                firstName: values.firstName,
                lastName: values.lastName,
                avatarUrl,
            });
        };

        const handleSuccess = (updatedUser: UserProfileVM) => {
            dispatch(updateUser(updatedUser));
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
            updateProfile(user.avatarUrl || null)
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
        });
        setSelectedFile(null);
        setAvatarRemoved(false);
    };

    return (
        <div className='flex items-center justify-center h-full py-8 px-4'>
            <Card className='w-full max-w-2xl'>
                <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Manage your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className='space-y-8'>
                            <div className='space-y-6'>
                                <UserProfileAvatar
                                    avatarUrl={avatarRemoved ? null : user.avatarUrl}
                                    firstName={form.watch('firstName') || user.firstName || ''}
                                    lastName={form.watch('lastName') || user.lastName || ''}
                                    isLoading={isLoading}
                                    onAvatarChange={handleAvatarChange}
                                    onAvatarRemove={handleAvatarRemove}
                                />

                                <Field>
                                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                                    <Input
                                        id='email'
                                        type='email'
                                        value={form.watch('email')}
                                        disabled
                                        className='bg-muted cursor-not-allowed'
                                    />
                                </Field>
                            </div>

                            <Separator />

                            <div className='space-y-6'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                                    <FormField
                                        control={form.control}
                                        name='firstName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <Field data-invalid={!!errors.firstName}>
                                                    <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                                                    <FormControl>
                                                        <Input
                                                            id='firstName'
                                                            placeholder='Enter your first name'
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {errors.firstName && (
                                                        <FieldError>{errors.firstName.message}</FieldError>
                                                    )}
                                                </Field>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name='lastName'
                                        render={({ field }) => (
                                            <FormItem>
                                                <Field data-invalid={!!errors.lastName}>
                                                    <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                                                    <FormControl>
                                                        <Input
                                                            id='lastName'
                                                            placeholder='Enter your last name'
                                                            disabled={isLoading}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    {errors.lastName && (
                                                        <FieldError>{errors.lastName.message}</FieldError>
                                                    )}
                                                </Field>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <Separator />

                            <div className='flex justify-end gap-3 pt-2'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={handleCancel}
                                    disabled={isLoading || (!isDirty && !selectedFile && !avatarRemoved)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    disabled={isLoading || (!isDirty && !selectedFile && !avatarRemoved)}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default Profile;
