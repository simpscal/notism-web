import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { IconContext } from './icon-provider';
import type { SvgIconType } from '@/app/assets/icons/generated';

interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  className = '',
  onClick,
}: IconProps) {
  const { getIcon } = useContext(IconContext);

  const iconInfo = getIcon(name as SvgIconType);

  if (!iconInfo) {
    throw new Error(`Icon "${name}" not found`);
  }

  return (
    <div
      className={cn('inline-flex items-center justify-center', className)}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        color,
      }}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: iconInfo.data }}
    />
  );
}

export type { ISvgIcon } from '@/app/assets/icons/generated';
