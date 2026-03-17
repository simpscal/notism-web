import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { cn } from '@/app/utils/tailwind.utils';
import Spinner from '@/components/spinner';

export interface KanbanColumn<TItem> {
    id: string;
    title: string;
    items: TItem[];
    totalCount?: number;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

export interface KanbanProps<TItem> {
    columns: KanbanColumn<TItem>[];
    onItemMove?: (itemId: string, sourceColumnId: string, targetColumnId: string) => void;
    renderItem: (item: TItem) => ReactNode;
    getItemId: (item: TItem) => string;
    className?: string;
    isDisabled?: boolean;
    columnWidth?: number;
}

function SortableItem<TItem>({
    item,
    getItemId,
    renderItem,
}: {
    item: TItem;
    getItemId: (item: TItem) => string;
    renderItem: (item: TItem) => ReactNode;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: getItemId(item),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className='flex-shrink-0 cursor-grab active:cursor-grabbing'
        >
            {renderItem(item)}
        </div>
    );
}

function KanbanColumn<TItem>({
    column,
    renderItem,
    getItemId,
    activeId,
    sourceColumnId,
    overColumnId,
}: {
    column: KanbanColumn<TItem>;
    renderItem: (item: TItem) => ReactNode;
    getItemId: (item: TItem) => string;
    activeId: string | null;
    sourceColumnId: string | null;
    overColumnId: string | null;
}) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { ref: loadMoreRef, inView } = useInView();

    const { setNodeRef: setDroppableRef, isOver } = useDroppable({
        id: column.id,
    });

    const isTargetColumn = (overColumnId === column.id && column.id !== sourceColumnId && activeId !== null) || isOver;

    // Handle load more when load more element comes into view
    useEffect(() => {
        if (inView && column.hasMore && !column.isLoadingMore && column.onLoadMore) {
            column.onLoadMore();
        }
    }, [inView, column.hasMore, column.isLoadingMore, column.onLoadMore]);

    return (
        <div className={cn('flex flex-col h-full bg-muted/30 flex-shrink-0')}>
            {/* Column header */}
            <div className='sticky top-0 z-10 border-b border-border bg-background px-4 py-3'>
                <div className='flex items-center justify-between'>
                    <span className='font-semibold text-base'>{column.title}</span>
                    <span className='text-sm font-normal text-muted-foreground'>
                        ({column.totalCount ?? column.items.length})
                    </span>
                </div>
            </div>

            {/* Column content */}
            <div
                ref={node => {
                    setDroppableRef(node);
                    scrollContainerRef.current = node;
                }}
                className='flex-1 space-y-3 p-4 overflow-y-auto'
            >
                {isTargetColumn && (
                    <div className='rounded-xl border-2 border-dashed border-primary bg-primary/10 p-4 flex items-center justify-center min-h-[120px]'>
                        <span className='text-sm text-primary font-medium'>Drop card here</span>
                    </div>
                )}
                <SortableContext items={column.items.map(getItemId)} strategy={verticalListSortingStrategy}>
                    {column.items.map(item => (
                        <SortableItem key={getItemId(item)} item={item} getItemId={getItemId} renderItem={renderItem} />
                    ))}
                </SortableContext>

                {/* Placeholder for empty columns */}
                {column.items.length === 0 && !isTargetColumn && (
                    <div className='rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-4 flex items-center justify-center min-h-[120px]'>
                        <span className='text-sm text-muted-foreground'>Drop items here</span>
                    </div>
                )}

                {/* Load more */}
                {column.hasMore && (
                    <div ref={loadMoreRef} className='flex justify-center py-4'>
                        {column.isLoadingMore ? (
                            <div className='flex items-center gap-2'>
                                <Spinner size='sm' />
                            </div>
                        ) : (
                            <div className='text-sm text-muted-foreground'>Scroll for more</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function Kanban<TItem>({
    columns,
    onItemMove,
    renderItem,
    getItemId,
    className,
    isDisabled = false,
    columnWidth = 280,
}: KanbanProps<TItem>) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [sourceColumnId, setSourceColumnId] = useState<string | null>(null);
    const [overColumnId, setOverColumnId] = useState<string | null>(null);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragStart = useCallback(
        (event: DragStartEvent) => {
            if (isDisabled) return;
            const itemId = event.active.id as string;
            setActiveId(itemId);
            const sourceColumn = columns.find(col => col.items.some(item => getItemId(item) === itemId));
            setSourceColumnId(sourceColumn?.id || null);
            setOverColumnId(null);
        },
        [isDisabled, columns, getItemId]
    );

    const handleDragOver = useCallback(
        (event: DragOverEvent) => {
            if (isDisabled || !event.over) return;
            const overId = event.over.id as string;

            const isColumn = columns.some(col => col.id === overId);
            if (isColumn) {
                setOverColumnId(overId);
            } else {
                const column = columns.find(col => col.items.some(item => getItemId(item) === overId));
                if (column) {
                    setOverColumnId(column.id);
                }
            }
        },
        [isDisabled, columns, getItemId]
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            setActiveId(null);
            setSourceColumnId(null);
            setOverColumnId(null);

            if (isDisabled) return;

            const { active, over } = event;

            if (!over || active.id === over.id || !onItemMove) {
                return;
            }

            const itemId = active.id as string;
            const overId = over.id as string;

            const sourceColumn = columns.find(col => col.items.some(item => getItemId(item) === itemId));
            if (!sourceColumn) return;

            // Check if overId is a column ID (for empty columns) or an item ID
            let targetColumn = columns.find(col => col.id === overId);
            if (!targetColumn) {
                // If not a column, check if it's an item in a column
                targetColumn = columns.find(col => col.items.some(item => getItemId(item) === overId));
            }

            if (!targetColumn) return;

            if (sourceColumn.id === targetColumn.id) return;

            onItemMove(itemId, sourceColumn.id, targetColumn.id);
        },
        [columns, getItemId, onItemMove, isDisabled]
    );

    const activeItem = activeId ? columns.flatMap(col => col.items).find(item => getItemId(item) === activeId) : null;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className={cn('h-full overflow-x-auto', className)}>
                <div
                    className='flex h-full'
                    style={{
                        width: `${columns.length * columnWidth}px`,
                        minWidth: '100%',
                    }}
                >
                    {columns.map(column => (
                        <div
                            key={column.id}
                            className='border-r border-border last:border-r-0'
                            style={{
                                width: `${columnWidth}px`,
                            }}
                        >
                            <KanbanColumn
                                column={column}
                                renderItem={renderItem}
                                getItemId={getItemId}
                                activeId={activeId}
                                sourceColumnId={sourceColumnId}
                                overColumnId={overColumnId}
                            />
                        </div>
                    ))}

                    {/* Filler to match column structure in remaining space */}
                    <div className='flex flex-col h-full flex-1 bg-muted/30'>
                        <div className='sticky top-0 z-10 border-b border-border bg-background px-4 py-3'>
                            <div className='flex items-center justify-between'>
                                <span className='font-semibold text-base'>&nbsp;</span>
                            </div>
                        </div>
                        <div className='flex-1' />
                    </div>
                </div>
            </div>
            <DragOverlay>
                {activeItem && <div style={{ width: `${columnWidth - 32}px` }}>{renderItem(activeItem)}</div>}
            </DragOverlay>
        </DndContext>
    );
}

export default memo(Kanban) as typeof Kanban;
