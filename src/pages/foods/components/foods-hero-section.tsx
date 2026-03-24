import { Search } from 'lucide-react';
import { memo } from 'react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';

interface FoodsHeroSectionProps {
    searchInput: string;
    onSearchChange: (value: string) => void;
}

function FoodsHeroSection({ searchInput, onSearchChange }: FoodsHeroSectionProps) {
    return (
        <section className='relative overflow-hidden border-b bg-gradient-to-br from-primary/20 via-primary/5 to-background px-4 py-12 sm:py-16 lg:py-20'>
            {/* Decorative blobs */}
            <div className='pointer-events-none absolute inset-0 overflow-hidden' aria-hidden='true'>
                <div className='absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl' />
                <div className='absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-primary/8 blur-2xl' />
            </div>

            <div className='relative mx-auto max-w-3xl text-center'>
                <div className='mb-5 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 backdrop-blur-sm'>
                    <span className='h-2 w-2 animate-pulse rounded-full bg-primary' />
                    <span className='text-xs font-medium sm:text-sm'>Fresh &amp; Delicious</span>
                </div>

                <h1 className='mb-5 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl'>
                    Discover <span className='text-primary'>Amazing</span>
                    <br />
                    <span className='text-primary'>Food</span>
                </h1>

                <p className='mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg'>
                    Explore our curated selection of mouth-watering dishes,
                    <br className='hidden sm:block' /> crafted with love and the finest ingredients.
                </p>

                <InputGroup className='mx-auto h-12 max-w-2xl rounded-2xl border-2 shadow-sm sm:h-14'>
                    <InputGroupInput
                        type='text'
                        placeholder='Search for your favorite dish...'
                        value={searchInput}
                        onChange={e => onSearchChange(e.target.value)}
                        className='h-full w-full rounded-[inherit] border-0 bg-background pr-4 text-sm sm:text-base'
                    />
                    <InputGroupAddon className='pl-3.5 sm:[&>svg]:h-5 sm:[&>svg]:w-5'>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </section>
    );
}

export default memo(FoodsHeroSection);
