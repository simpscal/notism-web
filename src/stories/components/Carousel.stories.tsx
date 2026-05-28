import type { Meta, StoryObj } from '@storybook/react-vite';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/carousel';

const meta = {
    title: 'Components/Carousel',
    component: Carousel,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

const slides = [
    { id: 1, color: 'bg-muted', label: 'Slide 1', emoji: '🌅' },
    { id: 2, color: 'bg-accent', label: 'Slide 2', emoji: '🌿' },
    { id: 3, color: 'bg-secondary', label: 'Slide 3', emoji: '🔮' },
    { id: 4, color: 'bg-primary/10', label: 'Slide 4', emoji: '🍊' },
    { id: 5, color: 'bg-muted/60', label: 'Slide 5', emoji: '🌸' },
];

export const Default: Story = {
    render: () => (
        <div className='w-[480px]'>
            <Carousel>
                <CarouselContent>
                    {slides.map(slide => (
                        <CarouselItem key={slide.id}>
                            <div className={`${slide.color} flex h-48 items-center justify-center rounded-xl text-6xl`}>
                                {slide.emoji}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    ),
};

export const MultipleVisible: Story = {
    render: () => (
        <div className='w-[560px]'>
            <Carousel opts={{ align: 'start' }}>
                <CarouselContent>
                    {slides.map(slide => (
                        <CarouselItem key={slide.id} className='basis-1/3'>
                            <div className={`${slide.color} flex h-36 items-center justify-center rounded-xl text-4xl`}>
                                {slide.emoji}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    ),
};

export const CardSlides: Story = {
    render: () => (
        <div className='w-[480px]'>
            <Carousel>
                <CarouselContent>
                    {slides.map(slide => (
                        <CarouselItem key={slide.id}>
                            <div className='border rounded-xl overflow-hidden shadow-sm'>
                                <div className={`${slide.color} flex h-40 items-center justify-center text-5xl`}>
                                    {slide.emoji}
                                </div>
                                <div className='p-4'>
                                    <p className='font-semibold text-sm'>{slide.label}</p>
                                    <p className='text-muted-foreground text-xs mt-1'>
                                        Swipe or use arrows to navigate
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    ),
};

export const NoLoop: Story = {
    render: () => (
        <div className='w-[480px]'>
            <Carousel opts={{ loop: false }}>
                <CarouselContent>
                    {slides.slice(0, 3).map(slide => (
                        <CarouselItem key={slide.id}>
                            <div className={`${slide.color} flex h-48 items-center justify-center rounded-xl text-6xl`}>
                                {slide.emoji}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <p className='text-center text-xs text-muted-foreground mt-4'>Previous is disabled at the first slide</p>
        </div>
    ),
};
