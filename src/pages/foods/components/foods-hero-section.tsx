import { Search, UtensilsCrossed, ChefHat, Sparkles } from 'lucide-react';
import { memo } from 'react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/input-group';

interface FoodsHeroSectionProps {
    searchInput: string;
    totalCount: number;
    categoriesCount: number;
    onSearchChange: (value: string) => void;
}

function FoodsHeroSection({ searchInput, onSearchChange, totalCount, categoriesCount }: FoodsHeroSectionProps) {
    return (
        <section className='relative border-b bg-gradient-to-b from-primary/15 to-background px-4 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24'>
            <div className='mx-auto max-w-4xl text-center'>
                <div className='mb-4 inline-flex items-center gap-2 rounded-full border bg-background/80 backdrop-blur-sm px-3 py-1 sm:mb-6 sm:px-4 sm:py-1.5'>
                    <Sparkles className='h-3.5 w-3.5 sm:h-4 sm:w-4' />
                    <span className='text-xs font-medium sm:text-sm'>Fresh & Delicious</span>
                </div>

                <h1 className='text-primary mb-3 text-2xl font-bold tracking-tight sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl'>
                    Discover Amazing Food
                </h1>

                <p className='mb-6 text-xs leading-relaxed sm:mb-8 sm:text-sm md:text-base lg:text-lg'>
                    Explore our curated selection of mouth-watering dishes, crafted with love and the finest ingredients
                </p>

                <InputGroup className='mx-auto max-w-xl h-11 rounded-xl border-2 sm:h-12 sm:rounded-2xl'>
                    <InputGroupInput
                        type='text'
                        placeholder='Search for your favorite dish...'
                        value={searchInput}
                        onChange={e => onSearchChange(e.target.value)}
                        className='h-full w-full rounded-[inherit] border-0 bg-background pr-4 text-sm'
                    />
                    <InputGroupAddon className='pl-3 sm:[&>svg]:h-5 sm:[&>svg]:w-5'>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>

                <div className='mt-6 flex flex-wrap items-center justify-center gap-4 text-xs sm:mt-8 sm:gap-6 md:mt-10 md:gap-8 lg:gap-12'>
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                        <UtensilsCrossed className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='font-bold sm:text-sm'>{totalCount}</span>
                        <span className='text-muted-foreground sm:text-sm'>Dishes</span>
                    </div>
                    <div className='flex items-center gap-1.5 sm:gap-2'>
                        <ChefHat className='h-4 w-4 sm:h-5 sm:w-5' />
                        <span className='font-bold sm:text-sm'>{categoriesCount}</span>
                        <span className='text-muted-foreground sm:text-sm'>Categories</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(FoodsHeroSection);
