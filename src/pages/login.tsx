import { useState } from 'react';

import { Icon } from '@/components/icon/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInput } from '@/core/hooks';

function Login() {
  const [email, bindEmail] = useInput('');
  const [password, bindPassword] = useInput('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement API call
    console.log('Login attempt:', { email, password });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordVisibilityToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleForgotPasswordClick = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    e.preventDefault();
    // TODO: Navigate to forgot password page
    console.log('Forgot password clicked');
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    console.log('Google login clicked');
  };

  const handleGithubLogin = () => {
    // TODO: Implement GitHub OAuth login
    console.log('GitHub login clicked');
  };

  const handleSignUpClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // TODO: Navigate to sign up page
    console.log('Sign up clicked');
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Welcome back</h1>
        <p className='text-sm text-muted-foreground'>
          Enter your credentials to access your account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleFormSubmit} className='space-y-4'>
        {/* Email Field */}
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='name@example.com'
            {...bindEmail}
            required
            disabled={isLoading}
            autoComplete='email'
            className='w-full'
          />
        </div>

        {/* Password Field */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
            <a
              href='#'
              className='text-sm text-primary hover:underline'
              onClick={handleForgotPasswordClick}
            >
              Forgot password?
            </a>
          </div>
          <div className='relative'>
            <Input
              id='password'
              type={isPasswordVisible ? 'text' : 'password'}
              placeholder='Enter your password'
              {...bindPassword}
              required
              disabled={isLoading}
              autoComplete='current-password'
              className='w-full pr-10'
            />
            <Button
              type='button'
              variant='ghost'
              size='sm'
              onClick={handlePasswordVisibilityToggle}
              className='absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
              disabled={isLoading}
            >
              <Icon name={isPasswordVisible ? 'eyeOff' : 'eye'} size={16} />
            </Button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <Separator />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-card px-2 text-muted-foreground'>
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className='grid grid-cols-2 gap-3'>
        <Button
          type='button'
          variant='outline'
          disabled={isLoading}
          onClick={handleGoogleLogin}
        >
          <Icon name='google' size={16} />
          Google
        </Button>
        <Button
          type='button'
          variant='outline'
          disabled={isLoading}
          onClick={handleGithubLogin}
        >
          <Icon name='github' size={16} />
          GitHub
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className='text-center text-sm'>
        <span className='text-muted-foreground'>Don't have an account? </span>
        <a
          href='#'
          className='text-primary hover:underline font-medium'
          onClick={handleSignUpClick}
        >
          Sign up
        </a>
      </div>
    </div>
  );
}

export default Login;
