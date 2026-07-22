# Components

## Component Conventions

### Component Order

#### Quick Reference Checklist

1. **Imports** (including `memo` from 'react')
2. **Types/Interfaces**
3. **Component Definition**
4. **Hooks** (useState, useRef, useMemo, useCallback for utilities)
5. **useEffect** (under the hooks)
6. **Utilities** (helper functions, above early returns)
7. **Event handlers** (useCallback)
8. **Early returns**
9. **Main render** (always last)
10. **Export** (wrapped with `memo`)

#### Rules

- **Hooks**: Must include `useMemo` for heavy calculated variables
- **useEffect**: Must be placed under all hooks
- **Event handlers**: Must use `useCallback`. Every JSX event attribute must reference either a bare pass-through (e.g. `onClick={onClose}` or `onClick={handleSave}`) or a named handler declared above the return (typically `const handleX = useCallback(...)`). No inline arrow or `.bind` that contains logic — including a single state-setter call such as `onClick={() => setOpen(true)}` or `onChange={e => setName(e.target.value)}` — may appear in a JSX event attribute. A curried named factory (`onClick={handleSelect(item.id)}`) is the approved pattern when a handler needs a value from a map iteration. This is enforced by the `no-restricted-syntax` ESLint rule.
- **Utilities**: Helper functions should be placed above early returns

#### Example

```typescript
// 1. IMPORTS
import { memo, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useCustomHook } from '@/hooks/useCustomHook';

// 2. TYPES/INTERFACES
interface MyComponentProps {
    title: string;
    onAction?: () => void;
}

// 3. COMPONENT DEFINITION
function MyComponent({ title, onAction }: MyComponentProps) {
    // 4. HOOKS
    const [loading, setLoading] = useState(false);
    const dataRef = useRef(null);
    const { data, error } = useCustomHook();

    const memoizedValue = useMemo(() => {
        return data?.map(item => item.value);
    }, [data]);

    // 5. useEffect (under hooks)
    useEffect(() => {
        if (data) {
            dataRef.current = data;
        }
    }, [data]);

    // 6. UTILITIES (above early returns)
    const calculateTotal = (items: Item[]) => {
        return items.reduce((sum, item) => sum + item.price, 0);
    };

    // 7. EVENT HANDLERS (useCallback)
    const handleSubmit = useCallback(() => {
        setLoading(true);
        onAction?.();
    }, [onAction]);

    // 8. EARLY RETURNS
    if (error) return <div>Error occurred</div>;
    if (loading) return <div>Loading...</div>;

    // 9. MAIN RENDER
    return (
        <div>
            <h1>{title}</h1>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
}

// 10. EXPORT (wrapped with memo)
export default memo(MyComponent);
```

### Component Memoization

All components should be wrapped with React's `memo` to optimize re-renders. This prevents unnecessary re-renders when parent components update but the component's props haven't changed.

**Convention:**

- **Always wrap components with `memo`** when exporting
- Import `memo` from 'react'
- Use default export: `export default memo(ComponentName)`

#### Example

```typescript
import { memo } from 'react';

interface UserCardProps {
    user: IUser;
    onEdit?: (user: IUser) => void;
    isLoading?: boolean;
}

function UserCard({ user, onEdit, isLoading }: UserCardProps) {
    const handleEdit = () => onEdit?.(user);

    return (
        <div>
            <h2>{user.name}</h2>
            <button onClick={handleEdit}>Edit</button>
        </div>
    );
}

export default memo(UserCard);
```

#### Custom Comparison

By default, `memo` does a shallow comparison of props. If you need custom comparison logic, provide a comparison function as the second argument:

```typescript
// Custom comparison function (rarely needed)
export default memo(UserCard, (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return prevProps.user.id === nextProps.user.id && prevProps.isLoading === nextProps.isLoading;
});
```

#### Best Practices

- ✅ **Always use `memo`** for exported components
- ✅ Use default export with `memo` wrapper
- ✅ Ensure props are stable (use `useCallback` and `useMemo` in parent components)
- ❌ Don't use `memo` for components that receive frequently changing props
- ❌ Don't use `memo` if it adds unnecessary complexity

#### Notes

- `memo` only prevents re-renders when props are unchanged
- Parent component re-renders will still cause child re-renders if props change
- Use `useCallback` and `useMemo` in parent components to stabilize props passed to memoized children

### Component Responsibilities

Well-designed components follow clear responsibility boundaries that promote **cohesion** (related functionality grouped together) and **loose coupling** (minimal dependencies between components).

#### Core Principles

1. **Single Responsibility Principle**: Each component should have one clear purpose and do it well.
2. **Encapsulation**: Components should manage their own concerns without exposing internal implementation details.
3. **Predictable Data Flow**: Data should flow down through props, and events should bubble up through callbacks.

### State Management Responsibilities

#### ✅ What Components Should Do

##### Own Their Internal State

```javascript
function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleToggleEditing = useCallback(() => setIsEditing(prev => !prev), []);

    return (
        <div>
            {isEditing ? <EditForm /> : <DisplayInfo />}
            <button onClick={handleToggleEditing}>{isEditing ? 'Cancel' : 'Edit'}</button>
        </div>
    );
}
```

##### Use Global State (Read-Only)

```javascript
function Header() {
    const { user, theme } = useGlobalState();
    return <header className={`header ${theme}`}>Welcome, {user.name}</header>;
}
```

##### Request State Changes via Callbacks

```javascript
function TaskItem({ task, onStatusChange, onDelete }) {
    const handleToggleStatus = useCallback(
        () => onStatusChange(task.id, !task.completed),
        [onStatusChange, task.id, task.completed]
    );

    const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id]);

    return (
        <div>
            <span>{task.title}</span>
            <button onClick={handleToggleStatus}>{task.completed ? 'Undo' : 'Complete'}</button>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
}
```

#### ❌ What Components Should Avoid

##### Don't Mutate Props

```javascript
// ❌ Bad: Mutating props
function BadComponent({ items }) {
    items.push(newItem); // Don't do this!
    return <div>{items.length}</div>;
}

// ✅ Good: Use callbacks
function GoodComponent({ items, onAddItem }) {
    const handleAddItem = useCallback(() => onAddItem(newItem), [onAddItem]);

    return (
        <div>
            {items.length}
            <button onClick={handleAddItem}>Add Item</button>
        </div>
    );
}
```

##### Don't Directly Modify Other Components' State

```javascript
// ❌ Bad: Direct component manipulation
function BadSidebar({ mainContentRef }) {
    const handleToggle = () => {
        mainContentRef.current.setState({ collapsed: true }); // Don't do this!
    };
}

// ✅ Good: Use callbacks
function GoodSidebar({ onToggle }) {
    return <button onClick={onToggle}>Toggle Main Content</button>;
}
```

##### Don't Promote Local State Unnecessarily

```javascript
// ❌ Bad: Unnecessary global state
const globalState = {
    isModalOpen: false, // Should be local
    selectedTab: 0, // Should be local
};

// ✅ Good: Keep state local
function Modal() {
    const [isOpen, setIsOpen] = useState(false);
    return isOpen ? <div>Modal Content</div> : null;
}
```

### Component Scope and Communication

#### ✅ Proper Scope Management

##### Direct Child Communication

```javascript
function Dashboard() {
    const [selectedTab, setSelectedTab] = useState('overview');

    return (
        <div>
            <TabNavigation activeTab={selectedTab} onTabChange={setSelectedTab} />
            <TabContent tab={selectedTab} />
        </div>
    );
}
```

##### Event-Based Parent Communication

```javascript
function TodoList({ onListChange }) {
    const [todos, setTodos] = useState([]);

    const handleAddTodo = newTodo => {
        const updatedTodos = [...todos, newTodo];
        setTodos(updatedTodos);
        onListChange(updatedTodos);
    };

    return (
        <div>
            <AddTodoForm onAdd={handleAddTodo} />
            {todos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
            ))}
        </div>
    );
}
```

#### ❌ Scope Violations to Avoid

##### Deep Child Manipulation

```javascript
// ❌ Bad: Deep component manipulation
function BadGrandparent() {
    const grandchildRef = useRef();

    const handleAction = () => {
        grandchildRef.current.someMethod(); // Don't do this!
    };

    return (
        <Parent>
            <Child>
                <Grandchild ref={grandchildRef} />
            </Child>
        </Parent>
    );
}

// ✅ Good: Use props
function GoodGrandparent() {
    const [keyword, setKeyword] = useState('');

    return (
        <Parent>
            <Child>
                <Grandchild keyword={keyword} onUpdate={setKeyword} />
            </Child>
        </Parent>
    );
}
```

### UI Component Responsibilities

#### ✅ Pure UI Components

##### Focus on Presentation

```javascript
// ✅ Pure UI component
function Button({ variant = 'primary', disabled, children, onClick }) {
    return (
        <button className={`btn btn-${variant}`} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
}

// Usage with business logic in parent
function OrderForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        await submitOrder();
        setLoading(false);
    };

    return (
        <form>
            <Button variant='primary' disabled={loading} onClick={handleSubmit}>
                {loading ? 'Processing...' : 'Submit Order'}
            </Button>
        </form>
    );
}
```

#### ❌ UI Components to Avoid

##### Business Logic in UI

```javascript
// ❌ Bad: UI component with business logic
function BadProductCard({ product }) {
    const handleAddToCart = async () => {
        // Business logic doesn't belong in UI components
        const user = await getCurrentUser();
        await addToCart(product.id);
        await updateInventory(product.id, -1);
    };

    return (
        <div className='product-card'>
            <h3>{product.name}</h3>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}
```

##### Customizing Component Color Styles

**Rule: Avoid customizing color, border, shadow, or background styles for components in `@/uis/`.**

Components in the `@/uis/` directory (like `Button`, `Card`, `Badge`, etc.) are part of the design system and should maintain consistent styling. Custom color styles break design system consistency and make it harder to maintain a cohesive UI.

```javascript
// ❌ Bad: Customizing color styles on design system components
import { Button } from '@/uis/button';
import { Card } from '@/uis/card';
import { Badge } from '@/uis/badge';

function FoodCard() {
    return (
        <Card className='border-primary bg-primary/10'>
            <Badge className='bg-blue-500 text-white border-blue-600'>Category</Badge>
            <Button className='border-primary text-primary hover:bg-primary/10'>Add to Cart</Button>
        </Card>
    );
}

// ✅ Good: Use component variants and default styling
import { Button } from '@/uis/button';
import { Card } from '@/uis/card';
import { Badge } from '@/uis/badge';

function FoodCard() {
    return (
        <Card>
            <Badge variant='secondary'>Category</Badge>
            <Button variant='outline'>Add to Cart</Button>
        </Card>
    );
}
```

**What to Avoid:**

- ❌ Custom `bg-*`, `text-*`, `border-*` color classes on design system components
- ❌ Custom `shadow-*` or gradient classes on components
- ❌ Overriding component default colors with inline styles or custom classes
- ❌ Using `!important` to override component styles

**What to Do Instead:**

- ✅ Use component variants (e.g., `variant='primary'`, `variant='outline'`)
- ✅ Use component size props (e.g., `size='sm'`, `size='lg'`)
- ✅ Rely on the design system's default styling
- ✅ If customization is needed, extend the component in `@/uis/` with a new variant
- ✅ Use layout/spacing classes (e.g., `gap-4`, `p-6`, `mb-4`) which are acceptable

**Exceptions:**

- ✅ Layout/spacing utilities (e.g., `gap-4`, `p-6`, `mb-4`) are acceptable
- ✅ Structural classes (e.g., `flex`, `grid`, `w-full`) are acceptable

##### Preferring Semantic CSS Classes

**Rule: Use semantic CSS classes that describe purpose and meaning rather than specific visual properties.**

Semantic classes make code more maintainable, themeable, and accessible. They describe _what_ something is (e.g., `btn-primary`, `text-error`) rather than _how_ it looks (e.g., `bg-blue-500`, `text-red-600`).

```javascript
// ❌ Bad: Using specific visual classes
function ErrorMessage() {
    return (
        <div className='bg-red-50 border-red-200 text-red-800 p-4 rounded'>
            <p className='text-red-600 font-semibold'>Error occurred</p>
        </div>
    );
}

function SuccessMessage() {
    return (
        <div className='bg-green-50 border-green-200 text-green-800 p-4 rounded'>
            <p className='text-green-600 font-semibold'>Success!</p>
        </div>
    );
}

// ✅ Good: Using semantic classes
function ErrorMessage() {
    return (
        <div className='bg-destructive/10 border-destructive/20 text-destructive p-4 rounded'>
            <p className='text-destructive font-semibold'>Error occurred</p>
        </div>
    );
}

function SuccessMessage() {
    return (
        <div className='bg-success/10 border-success/20 text-success p-4 rounded'>
            <p className='text-success font-semibold'>Success!</p>
        </div>
    );
}

// ✅ Better: Using design system components with semantic variants
import { Alert, AlertDescription } from '@/uis/alert';

function ErrorMessage() {
    return (
        <Alert variant='destructive'>
            <AlertDescription>Error occurred</AlertDescription>
        </Alert>
    );
}
```

**What to Avoid:**

- ❌ Hardcoded color values (e.g., `bg-blue-500`, `text-red-600`, `border-gray-300`)
- ❌ Specific spacing values when semantic tokens exist (e.g., `p-4` when `p-card` exists)
- ❌ Visual property classes that should be semantic (e.g., `font-bold` when `text-heading` exists)
- ❌ Magic numbers in class names (e.g., `w-320px`, `h-48px`)

**What to Do Instead:**

- ✅ Use design system tokens (e.g., `bg-primary`, `text-destructive`, `border-muted`)
- ✅ Use component variants (e.g., `variant='destructive'`, `variant='success'`)
- ✅ Use semantic utility classes (e.g., `text-heading`, `text-body`, `spacing-card`)
- ✅ Use CSS custom properties/variables for themeable values
- ✅ Prefer Tailwind's semantic color system (e.g., `bg-background`, `text-foreground`)

**Examples of Semantic vs Specific:**

| Purpose         | ❌ Specific              | ✅ Semantic                          |
| --------------- | ------------------------ | ------------------------------------ |
| Primary action  | `bg-blue-500 text-white` | `bg-primary text-primary-foreground` |
| Error state     | `text-red-600`           | `text-destructive`                   |
| Card background | `bg-white`               | `bg-card`                            |
| Muted text      | `text-gray-500`          | `text-muted-foreground`              |
| Border          | `border-gray-200`        | `border-border`                      |
| Heading text    | `text-2xl font-bold`     | `text-heading` or component variant  |
| Spacing         | `p-4`                    | `p-card` (if semantic token exists)  |

**Benefits:**

- ✅ **Themeable**: Easy to change colors across the app by updating design tokens
- ✅ **Accessible**: Semantic classes often include accessibility considerations
- ✅ **Maintainable**: Changes to design system propagate automatically
- ✅ **Consistent**: Ensures visual consistency across the application
- ✅ **Readable**: Code intent is clearer (e.g., `text-error` vs `text-red-600`)

**When Specific Classes Are Acceptable:**

- ✅ Layout utilities (e.g., `flex`, `grid`, `gap-4`, `w-full`) - these are structural, not visual
- ✅ Responsive utilities (e.g., `md:flex`, `lg:grid-cols-3`) - these describe behavior
- ✅ Animation utilities (e.g., `transition-all`, `duration-300`) - these describe behavior
- ✅ When no semantic alternative exists and the value is truly arbitrary (e.g., `w-[320px]` for a specific fixed width)

### Showing Error State UI

When a query fails (`isError` from `useQuery`), show a dedicated error UI instead of rendering broken or empty content. Use the shared **ErrorState** component from `@/uis/error-state` so error presentation is consistent across the app.

**Rule: Use the `ErrorState` component for API-failure error UIs.** Customize the message and icon via props; avoid duplicating error layout and styles in page-specific components.

**ErrorState props:**

| Prop          | Type           | Required | Description                                                           |
| ------------- | -------------- | -------- | --------------------------------------------------------------------- |
| `title`       | string         | Yes      | Main heading (e.g. "Failed to load food details").                    |
| `description` | string         | No       | Secondary text below the title.                                       |
| `icon`        | ReactNode      | No       | Custom icon (default: `AlertCircle` from lucide-react).               |
| `action`      | ReactNode      | No       | Primary CTA (e.g. Button + Link "Back to list").                      |
| `iconSize`    | `'sm' \| 'md'` | No       | Default `'md'`. Use `'sm'` for compact contexts (tables, list pages). |
| `className`   | string         | No       | Extra classes on the wrapper.                                         |

**Detail pages (with back navigation):** Compose a back link above `ErrorState` and pass an `action` (e.g. "Back to Foods" button). Keep routing and copy in the page; use `ErrorState` only for the icon, title, description, and action block.

```typescript
// ✅ Good: Detail page error – back button + ErrorState with action
const FoodDetailPage = () => {
    const { id } = useParams();
    const { data: food, isLoading, isError } = useQuery({
        queryKey: ['foods', 'detail', id],
        queryFn: () => foodApi.getById(id!),
        enabled: !!id,
    });

    if (isLoading) return <Spinner />;
    if (isError) {
        return (
            <div className='container mx-auto px-4 py-8'>
                <Button variant='ghost' className='mb-8' asChild>
                    <Link to={`/${ROUTES.ADMIN.FOODS}`}>
                        <ArrowLeft className='h-4 w-4' />
                        Back to Foods
                    </Link>
                </Button>
                <ErrorState
                    title='Failed to load food details'
                    description='Please try again later or go back to the foods list.'
                    action={
                        <Button asChild>
                            <Link to={`/${ROUTES.ADMIN.FOODS}`}>Back to Foods</Link>
                        </Button>
                    }
                />
            </div>
        );
    }
    return (/* ... */);
};
```

**List/table or compact layouts:** Use `ErrorState` with `iconSize='sm'` inside a centered container. No back button or action is required if the page context is clear.

```typescript
// ✅ Good: List/table error – centered ErrorState, compact size
const AdminFoodsPage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['admin', 'foods', { page, search }],
        queryFn: () => adminApi.getFoods({ page, search }),
    });

    if (isLoading) return <Spinner />;
    if (isError) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <ErrorState
                    title='Failed to load foods'
                    description='Please try again later.'
                    iconSize='sm'
                />
            </div>
        );
    }
    return (/* ... */);
};
```

**Custom icon:** Pass the `icon` prop when a different icon is needed (e.g. `icon={<AlertTriangle className='h-16 w-16 text-destructive' />}`).

**What to avoid:**

- ❌ Building page-specific error blocks that duplicate ErrorState layout (icon circle, title, description, button).
- ❌ Using raw text or ad-hoc divs for query errors instead of `ErrorState`.
- ❌ Showing error toasts for the same failure that is already shown via `ErrorState` (global API interceptor may still show toasts; avoid duplicating in component).

### Global Error Handling

**Rule: Don't catch an error just to show an error toast from a component — API failures are already handled globally.**

The API client (`src/apis/client.ts`) has a response interceptor that inspects every non-OK response and shows a `toast.error(...)` with a localised title/description per status code (400/403/404/500/503/…). This runs for **every** request. So wrapping a call in `try/catch` (or `.catch`) only to surface another error toast double-notifies the user.

```typescript
// ❌ Bad: component re-reports a failure the interceptor already toasted
const handleSave = useCallback(async () => {
    try {
        await updateItem(payload);
    } catch {
        toast.error(t('common.error')); // duplicate toast
    }
}, [updateItem, t]);
```

```typescript
// ✅ Good: let the global interceptor own the error toast; swallow to avoid
// an unhandled rejection, take no further UI action.
const handleSave = useCallback(() => {
    void updateItem(payload).catch(() => {});
}, [updateItem]);
```

**When a local `catch` IS justified** — the component needs to do something the interceptor cannot:

- Show a **domain-specific message** the generic interceptor doesn't know, not a restatement of the HTTP error.
- **Roll back optimistic UI** or reset local state.
- Branch control flow (retry, navigate, focus a field).

In those cases handle the side effect — do not add a second generic error toast.

### Component Architecture Patterns

#### Composition Over Inheritance

```javascript
// ✅ Good: Composition pattern
function Card({ children, variant = 'default' }) {
    return <div className={`card card-${variant}`}>{children}</div>;
}

function CardHeader({ children }) {
    return <div className='card-header'>{children}</div>;
}

function CardBody({ children }) {
    return <div className='card-body'>{children}</div>;
}

// Usage
function ProfileCard({ user }) {
    return (
        <Card variant='profile'>
            <CardHeader>
                <h2>{user.name}</h2>
            </CardHeader>
            <CardBody>
                <img src={user.avatar} alt={user.name} />
                <p>{user.bio}</p>
                <button>Edit Profile</button>
            </CardBody>
        </Card>
    );
}
```

### Event Handler Conventions

Every JSX event attribute must reference either a bare pass-through (e.g. `onClick={onClose}` or `onClick={handleSave}`) or a named handler declared above the return (typically `const handleX = useCallback(...)`). No inline arrow or `.bind` that contains logic — including a single state-setter call such as `onClick={() => setOpen(true)}` or `onChange={e => setName(e.target.value)}` — may appear in a JSX event attribute. A curried named factory (`onClick={handleSelect(item.id)}`) is the approved pattern when a handler needs a value from a map iteration. This is enforced by the `no-restricted-syntax` ESLint rule.

#### ✅ Good: Dedicated named handlers

```typescript
function CartItem({ item, onRemove, onQuantityChange, onCustomisationChange }) {
    const handleRemove = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onRemove(item.id, item.name);
        },
        [onRemove, item.id, item.name],
    );

    const handleDecrement = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onQuantityChange(item.id, -1);
        },
        [onQuantityChange, item.id],
    );

    const handleIncrement = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            onQuantityChange(item.id, 1);
        },
        [onQuantityChange, item.id],
    );

    // Curried named factory: supplies the group id from the map iteration,
    // returning a handler that still receives the Select's value.
    const handleCustomisationChange = useCallback(
        (groupId: string) => (optionId: string) => {
            onCustomisationChange(item.id, groupId, optionId);
        },
        [onCustomisationChange, item.id],
    );

    return (
        <div>
            <Button onClick={handleRemove}>Remove</Button>
            <Button onClick={handleDecrement}>-</Button>
            <Button onClick={handleIncrement}>+</Button>
            <Select onValueChange={handleCustomisationChange(group.id)} />
        </div>
    );
}
```

#### ❌ Bad: Logic written inline in JSX

```typescript
function CartItem({ item, onRemove, onQuantityChange }) {
    return (
        <div>
            {/* ❌ Multi-step logic inline */}
            <Button onClick={e => { e.stopPropagation(); onRemove(item.id, item.name); }}>
                Remove
            </Button>

            {/* ❌ Logic and argument construction inline */}
            <Button onClick={e => { e.stopPropagation(); onQuantityChange(item.id, -1); }}>
                -
            </Button>

            {/* ❌ Complex derivation inline */}
            <Select
                onValueChange={val => {
                    const updated = item.selections.map(s => s.id === group.id ? { ...s, val } : s);
                    onCustomisationChange(item.id, updated);
                }}
            />
        </div>
    );
}
```

**Rule:** A JSX event attribute may only be a bare reference — a pass-through prop (e.g. `onClick={onClose}`) or a handler declared above the return (e.g. `onClick={handleSave}`). Any inline arrow or `.bind` that contains logic — including a single state-setter call such as `onClick={() => setOpen(true)}` — must be extracted to a named handler. When a handler needs a value from a map iteration, use the curried named factory pattern (`onClick={handleSelect(item.id)}`).

> **Enforcement:** This rule is mechanically enforced by the `no-restricted-syntax` ESLint rule configured in `eslint.config.js`. Storybook stories (`*.stories.tsx`) and test files are exempt — they are fixtures, not shipped UI.

### Component Responsibilities Checklist

#### ✅ Good Component Responsibilities

- [ ] Has a single, clear purpose
- [ ] Manages only its own internal state
- [ ] Communicates with parent via callbacks
- [ ] Controls only immediate children
- [ ] Makes API calls relevant to its purpose
- [ ] Avoids side effects that affect other components
- [ ] UI components focus only on presentation
- [ ] Wrapped with `memo` for performance optimization

#### ❌ Avoid These Anti-Patterns

- [ ] Mutating props or external state
- [ ] Reaching deep into component tree when a props approach can be used instead
- [ ] Making API calls with global side effects
- [ ] Mixing business logic with UI components
- [ ] Promoting local state unnecessarily
- [ ] Tight coupling between unrelated components
- [ ] Forgetting to wrap components with `memo`
- [ ] Customizing color, border, shadow, or background styles on design system components
- [ ] Putting an inline arrow or `.bind` with logic in a JSX event attribute — including a single state-setter such as `onClick={() => setOpen(true)}`; every event attribute must be a bare reference or a named handler (enforced by `no-restricted-syntax`)

---

## Component Examples

### Pure UI Components

```typescript
// components/button/button.tsx
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/app/utils/tailwind.utils';
import styles from './button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export const Button = ({
    variant = 'primary',
    size = 'medium',
    className,
    children,
    ...props
}: ButtonProps) => {
    return (
        <button
            className={cn(styles.button, styles[variant], styles[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};
```

### Layout Components

```typescript
// layouts/page-layout.tsx
import { ReactNode } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import { Sidebar } from './sidebar';

interface PageLayoutProps {
    children: ReactNode;
    title?: string;
    showSidebar?: boolean;
    headerActions?: ReactNode;
}

export const PageLayout = ({
    children,
    title,
    showSidebar = true,
    headerActions,
}: PageLayoutProps) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header title={title} actions={headerActions} />

            <div className="flex flex-1">
                {showSidebar && <Sidebar />}

                <main className="flex-1 p-6">{children}</main>
            </div>

            <Footer />
        </div>
    );
};

// layouts/auth-layout.tsx
export const AuthLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <img src="/logo.svg" alt="Logo" className="mx-auto h-12 w-auto" />
                </div>
                {children}
            </div>
        </div>
    );
};
```

---
