import { Clock } from 'lucide-react';
import { memo } from 'react';

interface TimelineItem {
    title: string;
    description?: string;
    icon: React.ComponentType<{ className?: string }>;
    isCompleted: boolean;
    isCurrent: boolean;
    completedAt?: string | null;
}

interface TimelineProps {
    items: TimelineItem[];
}

function Timeline({ items }: TimelineProps) {
    return (
        <div className='relative space-y-4'>
            {items.map((item, index) => {
                const ItemIcon = item.icon;
                const isLast = index === items.length - 1;
                const hasValue = !!item.completedAt;
                const shouldHighlight = item.isCompleted || hasValue;

                return (
                    <div key={index} className='flex items-start gap-4'>
                        <div className='flex flex-col items-center'>
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    shouldHighlight
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                <ItemIcon className='h-5 w-5' />
                            </div>
                            {!isLast && (
                                <div className={`mt-2 h-16 w-0.5 ${shouldHighlight ? 'bg-primary' : 'bg-muted'}`} />
                            )}
                        </div>
                        <div className='flex-1 pb-8'>
                            <div
                                className={`font-semibold ${
                                    item.isCurrent
                                        ? 'text-primary'
                                        : shouldHighlight
                                          ? 'text-foreground'
                                          : 'text-muted-foreground'
                                }`}
                            >
                                {item.title}
                            </div>
                            {item.completedAt && (
                                <div className='mt-1 text-sm text-muted-foreground'>
                                    {new Date(item.completedAt).toLocaleString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </div>
                            )}
                            {item.isCurrent && !item.completedAt && (
                                <div className='mt-1 flex items-center gap-2 text-sm text-muted-foreground'>
                                    <Clock className='h-4 w-4' />
                                    <span>In progress</span>
                                </div>
                            )}
                            {item.description && (
                                <div className='mt-1 text-sm text-muted-foreground'>{item.description}</div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default memo(Timeline);
