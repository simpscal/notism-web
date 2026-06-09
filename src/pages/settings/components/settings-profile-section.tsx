import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Phone, MapPin } from 'lucide-react';
import { memo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import UserProfileAvatar from './user-profile-avatar';

import { storageApi, userApi } from '@/apis';
import { PresignedUrlUploadEnum } from '@/app/enums';
import { Button } from '@/components/button';
import { Field, FieldError, FieldLabel } from '@/components/field';
import { Input } from '@/components/input';
import { Separator } from '@/components/separator';
import { useAppDispatch, useAppSelector } from '@/core/hooks';
import { updateUser } from '@/store/user/user.slice';

function SettingsProfileSection() {
    const { t } = useTranslation();
    const profileSchema = z.object({
        firstName: z.string().min(1, { message: t('auth.validation.firstNameRequired') }),
        lastName: z.string().min(1, { message: t('auth.validation.lastNameRequired') }),
        email: z.string().email(),
        avatarUrl: z.string().nullable().optional(),
        phone: z.string().optional(),
        location: z.string().optional(),
    });

    type ProfileFormValues = z.infer<typeof profileSchema>;
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
            location: user.location || '',
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
                location: values.location || null,
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
                    location: formValues.location || undefined,
                })
            );
            form.reset(values);
            setSelectedFile(null);
            setAvatarRemoved(false);
            toast.success(t('settings.profile.updateSuccess'));
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
            location: user.location || '',
        });
        setSelectedFile(null);
        setAvatarRemoved(false);
    };

    const isPristine = !isDirty && !selectedFile && !avatarRemoved;

    return (
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className='flex flex-col'>
            <div className='space-y-6 px-6 py-6'>
                {/* Pane heading */}
                <div className='space-y-1'>
                    <h2 className='text-lg font-semibold tracking-tight'>{t('settings.profile.paneTitle')}</h2>
                    <p className='text-sm text-muted-foreground'>{t('settings.profile.subtitle')}</p>
                </div>

                {/* Avatar group */}
                <UserProfileAvatar
                    avatarUrl={avatarRemoved ? null : form.watch('avatarUrl') || user.avatarUrl || null}
                    firstName={form.watch('firstName') || user.firstName || ''}
                    lastName={form.watch('lastName') || user.lastName || ''}
                    isLoading={isLoading}
                    onAvatarChange={handleAvatarChange}
                    onAvatarRemove={handleAvatarRemove}
                />

                <Separator />

                {/* Name group */}
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <Field data-invalid={!!errors.firstName}>
                        <FieldLabel htmlFor='firstName'>{t('settings.profile.firstName')}</FieldLabel>
                        <Input
                            id='firstName'
                            placeholder={t('settings.profile.enterFirstName')}
                            disabled={isLoading}
                            aria-invalid={!!errors.firstName}
                            {...form.register('firstName')}
                        />
                        {errors.firstName && <FieldError>{errors.firstName.message}</FieldError>}
                    </Field>

                    <Field data-invalid={!!errors.lastName}>
                        <FieldLabel htmlFor='lastName'>{t('settings.profile.lastName')}</FieldLabel>
                        <Input
                            id='lastName'
                            placeholder={t('settings.profile.enterLastName')}
                            disabled={isLoading}
                            aria-invalid={!!errors.lastName}
                            {...form.register('lastName')}
                        />
                        {errors.lastName && <FieldError>{errors.lastName.message}</FieldError>}
                    </Field>
                </div>

                <Field>
                    <FieldLabel htmlFor='email' className='flex items-center gap-2'>
                        <Mail className='h-4 w-4' />
                        {t('settings.profile.email')}
                    </FieldLabel>
                    <Input
                        id='email'
                        type='email'
                        value={form.watch('email')}
                        disabled
                        className='cursor-not-allowed bg-muted'
                    />
                </Field>

                <Separator />

                {/* Contact group — optional fields */}
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
                    <Field data-invalid={!!errors.phone}>
                        <FieldLabel htmlFor='phone' className='flex items-center gap-2'>
                            <Phone className='h-4 w-4' />
                            {t('settings.profile.phoneNumber')}
                        </FieldLabel>
                        <Input
                            id='phone'
                            type='tel'
                            placeholder={t('settings.profile.phonePlaceholder')}
                            disabled={isLoading}
                            aria-invalid={!!errors.phone}
                            {...form.register('phone')}
                        />
                        {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
                    </Field>

                    <Field data-invalid={!!errors.location}>
                        <FieldLabel htmlFor='location' className='flex items-center gap-2'>
                            <MapPin className='h-4 w-4' />
                            {t('settings.profile.location')}
                        </FieldLabel>
                        <Input
                            id='location'
                            placeholder={t('settings.profile.locationPlaceholder')}
                            disabled={isLoading}
                            aria-invalid={!!errors.location}
                            {...form.register('location')}
                        />
                        {errors.location && <FieldError>{errors.location.message}</FieldError>}
                    </Field>
                </div>
            </div>

            {/* Pane footer */}
            <div className='flex items-center justify-end gap-2 border-t bg-muted/20 px-6 py-4'>
                <Button type='button' variant='outline' onClick={handleCancel} disabled={isLoading || isPristine}>
                    {t('settings.profile.cancel')}
                </Button>
                <Button type='submit' disabled={isLoading || isPristine}>
                    {isLoading ? t('settings.profile.saving') : t('settings.profile.saveChanges')}
                </Button>
            </div>
        </form>
    );
}

export default memo(SettingsProfileSection);
