import {
  type SvgIconType,
  completeIconSet,
} from '@/app/assets/icons/generated';
import { createContext, useCallback, useMemo, type ReactNode } from 'react';
import type { ISvgIcon } from './icon';

interface IconContextType {
  iconMap: Record<SvgIconType, ISvgIcon>;
  getIcon: (name: SvgIconType) => ISvgIcon;
}

export const IconContext = createContext<IconContextType>(undefined!);

interface IconProviderProps {
  children: ReactNode;
}

export function IconProvider({ children }: IconProviderProps) {
  const iconMap = useMemo(() => {
    return completeIconSet.reduce(
      (acc, icon) => {
        acc[icon.name] = icon;

        return acc;
      },
      {} as Record<SvgIconType, ISvgIcon>
    );
  }, []);

  const getIcon = useCallback((name: SvgIconType) => iconMap[name], [iconMap]);

  return (
    <IconContext.Provider value={{ iconMap, getIcon }}>
      {children}
    </IconContext.Provider>
  );
}
