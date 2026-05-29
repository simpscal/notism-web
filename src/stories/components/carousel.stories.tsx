import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent } from '@/components/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/carousel';

const meta = {
    title: 'Components/Display/Carousel',
    component: Carousel,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <Carousel className='w-full max-w-xs'>
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                        <div className='p-1'>
                            <Card>
                                <CardContent className='flex aspect-square items-center justify-center p-6'>
                                    <span className='text-4xl font-semibold'>{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
};

export const MultipleSlides: Story = {
    render: () => (
        <Carousel
            opts={{
                align: 'start',
            }}
            className='w-full max-w-sm'
        >
            <CarouselContent>
                {Array.from({ length: 6 }).map((_, index) => (
                    <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/3'>
                        <div className='p-1'>
                            <Card>
                                <CardContent className='flex aspect-square items-center justify-center p-6'>
                                    <span className='text-3xl font-semibold'>{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    ),
};
