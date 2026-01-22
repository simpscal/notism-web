import { Search, UtensilsCrossed, ChefHat, Sparkles } from 'lucide-react';
import { memo } from 'react';

import { Input } from '@/components/input';

interface FoodsHeroSectionProps {
    searchInput: string;
    totalCount: number;
    categoriesCount: number;
    onSearchChange: (value: string) => void;
}

function FoodsHeroSection({ searchInput, onSearchChange, totalCount, categoriesCount }: FoodsHeroSectionProps) {
    return (
        <section className='container relative mx-auto border-b px-4 py-16 md:py-24'>
            <div className='mx-auto max-w-3xl text-center'>
                <div className='mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5'>
                    <Sparkles className='h-4 w-4' />
                    <span className='text-sm font-medium'>Fresh & Delicious</span>
                </div>

                <h1 className='text-primary mb-4 text-4xl font-black tracking-tight md:text-6xl'>
                    Discover Amazing Food
                </h1>

                <p className='mb-8 text-lg md:text-xl'>
                    Explore our curated selection of mouth-watering dishes, crafted with love and the finest ingredients
                </p>

                <div className='relative mx-auto max-w-xl'>
                    <Search className='absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2' />
                    <Input
                        type='text'
                        placeholder='Search for your favorite dish...'
                        value={searchInput}
                        onChange={e => onSearchChange(e.target.value)}
                        className='h-14 w-full rounded-2xl pl-12 pr-4'
                    />
                </div>

                <div className='mt-10 flex items-center justify-center gap-8 md:gap-12'>
                    <div className='flex items-center gap-2'>
                        <UtensilsCrossed className='h-5 w-5' />
                        <span className='text-sm font-bold'>{totalCount}</span>
                        <span className='text-sm'>Dishes</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <ChefHat className='h-5 w-5' />
                        <span className='text-sm font-bold'>{categoriesCount}</span>
                        <span className='text-sm'>Categories</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(FoodsHeroSection);
