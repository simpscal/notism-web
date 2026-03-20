import { memo } from 'react';
import { Outlet } from 'react-router-dom';

function AuthLayout() {
    return (
        <div className='min-h-screen w-screen overflow-y-auto bg-background'>
            <div className='mx-auto flex min-h-screen max-w-7xl flex-col items-stretch lg:flex-row'>
                <section className='relative hidden w-full flex-1 items-center justify-center overflow-hidden lg:block lg:w-1/2'>
                    <div className='absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent' />
                    <div className='relative px-10'>
                        <div className='inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm'>
                            Fresh meals, fast checkout
                        </div>

                        <h1 className='mt-6 text-4xl font-semibold tracking-tight text-primary'>Notism</h1>
                        <p className='mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground'>
                            Log in to manage your orders, track delivery status, and update your preferences in seconds.
                        </p>

                        <ul className='mt-8 grid gap-3 text-sm text-muted-foreground'>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>Curated menu with real-time availability</span>
                            </li>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>Clear checkout summary and fast payments</span>
                            </li>
                            <li className='flex items-start gap-3'>
                                <span className='mt-2 h-2 w-2 rounded-full bg-primary' />
                                <span>Order tracking and quick re-order</span>
                            </li>
                        </ul>
                    </div>
                </section>

                <section className='flex flex-1 items-center justify-center p-4 sm:p-6 lg:w-1/2'>
                    <div className='w-full max-w-md rounded-lg border bg-card p-4 shadow-sm sm:p-6 md:p-8'>
                        <Outlet />
                    </div>
                </section>
            </div>
        </div>
    );
}

export default memo(AuthLayout);
