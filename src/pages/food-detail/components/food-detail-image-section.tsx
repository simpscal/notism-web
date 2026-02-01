import { memo, useCallback, useEffect, useState } from 'react';

import type { CarouselApi } from '@/components/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/carousel';
import { FoodImage } from '@/features/food/components';

interface FoodDetailImageSectionProps {
    imageUrls: string[];
    foodName: string;
    isAvailable: boolean;
}

function FoodDetailImageSection({ imageUrls, foodName, isAvailable }: FoodDetailImageSectionProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollTo = useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api]
    );

    // Use placeholder if no images or empty array
    const displayImages = imageUrls.length > 0 ? imageUrls : [''];

    return (
        <div className='relative space-y-4'>
            <Carousel className='w-full rounded-3xl overflow-hidden' opts={{ loop: true }} setApi={setApi}>
                <CarouselContent className='rounded-3xl'>
                    {displayImages.map((imageUrl, index) => (
                        <CarouselItem key={index}>
                            <div className='relative aspect-square overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-secondary shadow-2xl'>
                                <FoodImage
                                    src={imageUrl}
                                    alt={`${foodName} - Image ${index + 1}`}
                                    className='absolute inset-0 h-full w-full object-cover'
                                />

                                {/* Badges - Only show on first image */}
                                {index === 0 && !isAvailable && (
                                    <div className='absolute inset-0 z-10 flex items-center justify-center bg-card/80'>
                                        <span className='rounded-full bg-muted px-6 py-3 text-lg font-semibold text-foreground'>
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {displayImages.length > 1 && (
                    <>
                        <CarouselPrevious variant='secondary' className='left-4' />
                        <CarouselNext variant='secondary' className='right-4' />
                    </>
                )}
            </Carousel>

            {/* Thumbnail Navigation */}
            {displayImages.length > 1 && (
                <div className='flex gap-2 justify-center'>
                    {displayImages.map((imageUrl, index) => (
                        <button
                            key={index}
                            type='button'
                            onClick={() => scrollTo(index)}
                            className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-all ${
                                current === index
                                    ? 'border-primary scale-105'
                                    : 'border-transparent hover:border-muted-foreground/50'
                            }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <FoodImage
                                src={imageUrl}
                                alt={`${foodName} thumbnail ${index + 1}`}
                                className='absolute inset-0 h-full w-full object-cover'
                            />
                            {current === index && <div className='absolute inset-0 bg-primary/20' />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default memo(FoodDetailImageSection);
