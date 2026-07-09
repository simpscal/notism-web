import { memo } from 'react';

// Purely atmospheric line-art for the dark ambient frame — concentric arcs that
// peek around the floating light shell. Hidden from assistive tech and never
// interactive; kept low-contrast so it never competes with the food or the shell.
function FrameDecoration() {
    return (
        <div aria-hidden className='pointer-events-none absolute inset-0 overflow-hidden text-frame-foreground'>
            <svg className='absolute -left-24 -top-24 size-72 opacity-[0.12]' viewBox='0 0 200 200' fill='none'>
                <circle cx='100' cy='100' r='96' stroke='currentColor' strokeWidth='0.75' />
                <circle cx='100' cy='100' r='70' stroke='currentColor' strokeWidth='0.75' />
                <circle cx='100' cy='100' r='44' stroke='currentColor' strokeWidth='0.75' />
            </svg>
            <svg className='absolute -bottom-28 -right-28 size-80 opacity-[0.1]' viewBox='0 0 200 200' fill='none'>
                <circle cx='100' cy='100' r='96' stroke='currentColor' strokeWidth='0.75' />
                <circle cx='100' cy='100' r='66' stroke='currentColor' strokeWidth='0.75' />
                <circle cx='100' cy='100' r='36' stroke='currentColor' strokeWidth='0.75' />
            </svg>
        </div>
    );
}

export default memo(FrameDecoration);
