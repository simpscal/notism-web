import { memo, useState } from 'react';

interface FoodImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'onLoad' | 'onError'> {
    src?: string | null;
    alt: string;
    placeholderClassName?: string;
}

function FoodPlaceholderSVG({ className = '', alt = 'Food placeholder' }: { className?: string; alt?: string }) {
    return (
        <svg
            className={className}
            viewBox='0 0 400 300'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-label={alt}
        >
            <defs>
                <linearGradient id='bgGradient' x1='0' y1='0' x2='400' y2='300' gradientUnits='userSpaceOnUse'>
                    <stop stopColor='#f3f4f6' />
                    <stop offset='1' stopColor='#e5e7eb' />
                </linearGradient>
                <style>
                    {`
                        .dark #bgGradient stop:first-child { stop-color: #374151; }
                        .dark #bgGradient stop:last-child { stop-color: #4b5563; }
                        .dark .plate { fill: #1f2937; }
                        .dark .utensil { fill: #9ca3af; }
                        .dark .decorative { fill: #6b7280; }
                    `}
                </style>
            </defs>
            {/* Background */}
            <rect width='400' height='300' fill='none' />

            {/* Plate */}
            <ellipse cx='200' cy='200' rx='120' ry='40' className='plate' fill='#ffffff' />
            <ellipse cx='200' cy='190' rx='100' ry='30' className='plate' fill='#f9fafb' />
            <ellipse cx='200' cy='185' rx='90' ry='25' fill='#e5e7eb' />

            {/* Utensils */}
            <g className='utensil' fill='#6b7280'>
                {/* Fork */}
                <rect x='120' y='100' width='8' height='80' rx='4' />
                <rect x='118' y='100' width='12' height='20' rx='2' />
                <line x1='124' y1='100' x2='124' y2='120' stroke='#9ca3af' strokeWidth='1.5' />
                <line x1='126' y1='100' x2='126' y2='120' stroke='#9ca3af' strokeWidth='1.5' />

                {/* Knife */}
                <rect x='200' y='90' width='8' height='90' rx='4' />
                <line x1='204' y1='90' x2='204' y2='110' stroke='#9ca3af' strokeWidth='2.5' />
                <ellipse cx='204' cy='95' rx='3' ry='2' fill='#d1d5db' />

                {/* Spoon */}
                <ellipse cx='280' cy='110' rx='12' ry='8' />
                <rect x='272' y='110' width='16' height='80' rx='8' />
                <ellipse cx='280' cy='115' rx='6' ry='4' fill='#d1d5db' />
            </g>

            {/* Decorative dots */}
            <circle cx='100' cy='80' r='4' className='decorative' fill='#d1d5db' />
            <circle cx='320' cy='70' r='3' className='decorative' fill='#d1d5db' />
            <circle cx='80' cy='220' r='3.5' className='decorative' fill='#d1d5db' />
        </svg>
    );
}

function FoodImage({ src, alt, className = '', placeholderClassName = '', ...imgProps }: FoodImageProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(false);
    };

    const hasValidImage = src && !imageError;

    return (
        <>
            {hasValidImage ? (
                <>
                    {!imageLoaded && (
                        <div className='absolute inset-0'>
                            <FoodPlaceholderSVG className={placeholderClassName || 'h-full w-full'} alt={alt} />
                        </div>
                    )}
                    <img
                        src={src}
                        alt={alt}
                        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        {...imgProps}
                    />
                </>
            ) : (
                <div className='absolute inset-0'>
                    <FoodPlaceholderSVG className={placeholderClassName || 'h-full w-full'} alt={alt} />
                </div>
            )}
        </>
    );
}

export default memo(FoodImage);
