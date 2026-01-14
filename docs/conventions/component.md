# Component Conventions

## Table of Contents

- [Component Order](#component-order)
    - [Quick Reference Checklist](#quick-reference-checklist)
    - [Examples](#examples)
- [Component Memoization](#component-memoization)
    - [Overview](#overview)
    - [Convention](#convention)
    - [Example](#example)
    - [When to Use Custom Comparison](#when-to-use-custom-comparison)
    - [Best Practices](#best-practices)
    - [Notes](#notes)
- [Component Responsibilities](#component-responsibilities)
    - [Responsibilities Overview](#responsibilities-overview)
    - [Core Principles](#core-principles)
        - [1. Single Responsibility Principle](#1-single-responsibility-principle)
        - [2. Encapsulation](#2-encapsulation)
        - [3. Predictable Data Flow](#3-predictable-data-flow)
    - [State Management Responsibilities](#state-management-responsibilities)
        - [✅ What Components Should Do](#-what-components-should-do)
            - [Own Their Internal State](#own-their-internal-state)
            - [Use Global State (Read-Only)](#use-global-state-read-only)
            - [Request State Changes via Callbacks](#request-state-changes-via-callbacks)
        - [❌ What Components Should Avoid](#-what-components-should-avoid)
            - [Don't Mutate Props](#dont-mutate-props)
            - [Don't Directly Modify Other Components' State](#dont-directly-modify-other-components-state)
            - [Don't Promote Local State Unnecessarily](#dont-promote-local-state-unnecessarily)
    - [Component Scope and Communication](#component-scope-and-communication)
        - [✅ Proper Scope Management](#-proper-scope-management)
            - [Direct Child Communication](#direct-child-communication)
            - [Event-Based Parent Communication](#event-based-parent-communication)
        - [❌ Scope Violations to Avoid](#-scope-violations-to-avoid)
            - [Deep Child Manipulation](#deep-child-manipulation)
    - [UI Component Responsibilities](#ui-component-responsibilities)
        - [✅ Pure UI Components](#-pure-ui-components)
            - [Focus on Presentation](#focus-on-presentation)
        - [❌ UI Components to Avoid](#-ui-components-to-avoid)
            - [Business Logic in UI](#business-logic-in-ui)
    - [Component Architecture Patterns](#component-architecture-patterns)
        - [Composition Over Inheritance](#composition-over-inheritance)
    - [Component Responsibilities Checklist](#component-responsibilities-checklist)
        - [✅ Good Component Responsibilities](#-good-component-responsibilities)
        - [❌ Avoid These Anti-Patterns](#-avoid-these-anti-patterns)

## Component Order

### Quick Reference Checklist

1. **Imports** (including `memo` from 'react')
2. **Types/Interfaces**
3. **Component Definition**
4. **Hooks**
5. **Event handlers**
6. **Early returns**
7. **Main render** (always last)
8. **Export** (wrapped with `memo`)

### Examples

```typescript
// 1. IMPORTS
import { memo, useState } from 'react';
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
  const { data, error } = useCustomHook();

  // 5. EVENT HANDLERS
  const handleSubmit = () => {
    setLoading(true);
    onAction?.();
  };

  // 6. EARLY RETURNS
  if (error) return <div>Error occurred</div>;
  if (loading) return <div>Loading...</div>;

  // 7. MAIN RENDER
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// 8. EXPORT (wrapped with memo)
export default memo(MyComponent);
```

## Component Memoization

### Overview

All components should be wrapped with React's `memo` to optimize re-renders. This prevents unnecessary re-renders when parent components update but the component's props haven't changed.

### Convention

- **Always wrap components with `memo`** when exporting
- Import `memo` from 'react'
- Use default export: `export default memo(ComponentName)`

### Example

```typescript
import { memo } from 'react';

interface UserCardProps {
  user: IUser;
  onEdit?: (user: IUser) => void;
  isLoading?: boolean;
}

function UserCard({ user, onEdit, isLoading }: UserCardProps) {
  // Component implementation
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => onEdit?.(user)}>Edit</button>
    </div>
  );
}

export default memo(UserCard);
```

### When to Use Custom Comparison

By default, `memo` does a shallow comparison of props. If you need custom comparison logic, provide a comparison function as the second argument:

```typescript
// Custom comparison function (rarely needed)
export default memo(UserCard, (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return prevProps.user.id === nextProps.user.id && prevProps.isLoading === nextProps.isLoading;
});
```

### Best Practices

- ✅ **Always use `memo`** for exported components
- ✅ Use default export with `memo` wrapper
- ✅ Ensure props are stable (use `useCallback` and `useMemo` in parent components)
- ❌ Don't use `memo` for components that receive frequently changing props
- ❌ Don't use `memo` if it adds unnecessary complexity

### Notes

- `memo` only prevents re-renders when props are unchanged
- Parent component re-renders will still cause child re-renders if props change
- Use `useCallback` and `useMemo` in parent components to stabilize props passed to memoized children

## Component Responsibilities

### Responsibilities Overview

Well-designed components follow clear responsibility boundaries that promote **cohesion** (related functionality grouped together) and **loose coupling** (minimal dependencies between components).

### Core Principles

### 1. Single Responsibility Principle

Each component should have one clear purpose and do it well.

### 2. Encapsulation

Components should manage their own concerns without exposing internal implementation details.

### 3. Predictable Data Flow

Data should flow down through props, and events should bubble up through callbacks.

### State Management Responsibilities

#### ✅ What Components Should Do

##### Own Their Internal State

```javascript
function UserProfile({ user }) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div>
            {isEditing ? <EditForm /> : <DisplayInfo />}
            <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : 'Edit'}</button>
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
    return (
        <div>
            <span>{task.title}</span>
            <button onClick={() => onStatusChange(task.id, !task.completed)}>
                {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
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
    return (
        <div>
            {items.length}
            <button onClick={() => onAddItem(newItem)}>Add Item</button>
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
