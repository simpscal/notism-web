function Spinner({ size = 'md', className = '' }: { size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
    const sizes = {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
    };

    return (
        <div className={`${sizes[size]} ${className}`}>
            <div
                className={`animate-spin rounded-full border-2  border-blue-400 border-t-transparent h-full w-full`}
            ></div>
        </div>
    );
}

export default Spinner;
