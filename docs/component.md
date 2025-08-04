# Component Conventions

## Component Order

### Quick Reference Checklist

1. **Imports**
2. **Types/Interfaces**
3. **Component function**
4. **Hooks**
5. **Actions** (server → client)
6. **Event handlers**
7. **Utilities**
8. **Early returns**
9. **Render helpers**
10. **Main render** (always last)

### Examples

```javascript
// 1. IMPORTS
import React, { useState, useEffect } from 'react';
import { externalLibrary } from 'external-lib';
import { useCustomHook } from '@/hooks/useCustomHook';
import LocalComponent from './LocalComponent';
import type { Props } from './types';

// 2. TYPES
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. COMPONENT DEFINITION
function MyComponent({ title, onAction }: ComponentProps) {

  // 4. HOOKS (STRICT ORDER - ALWAYS TOP LEVEL)

  // State hooks
  const [state, setState] = useState(initial);
  const [loading, setLoading] = useState(false);

  // React 19 hooks
  const [optimistic, setOptimistic] = useOptimistic(state);
  const [actionState, formAction] = useActionState(action, null);
  const formStatus = useFormStatus();

  // Context hooks (use() API)
  const theme = use(ThemeContext);

  // Effect hooks
  useEffect(() => {
    // side effects
  }, [dependencies]);

  //  Custom hooks
  const { data, error } = useCustomHook();

  // 5. ACTIONS & SERVER FUNCTIONS
  async function serverAction(formData) {
    'use server';
    // server logic
  }

  async function clientAction() {
    // client logic
  }

  // 6. EVENT HANDLERS
  const onSubmit = (event) => {
    ...
  };

  // 7. UTILITY FUNCTIONS
  const calculateValue = () => {
    ...
  };

  // 8. EARLY RETURNS
  if (error) return <ErrorComponent />;
  if (loading) return <LoadingSpinner />;

  // 9. RENDER HELPERS
  const renderItem = (item) => (
    <div key={item.id}>{item.name}</div>
  );

  // 10. MAIN RENDER (ALWAYS LAST)
  return (
    <div>
      <title>{title}</title>
      {data?.map(renderItem)}
      <button onClick={handleClick}>Click</button>
    </div>
  );
}
```

## Component Responsibilities

### Overview

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
  // ✅ Component manages its own UI state
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div>
      {isEditing ? <EditForm /> : <DisplayInfo />}
      {showDetails && <UserDetails />}
    </div>
  );
}
```

##### Use Global State (Read-Only)

```javascript
function Header() {
  // ✅ Reading from global state is acceptable
  const { user, theme } = useGlobalState();

  return <header className={`header ${theme}`}>Welcome, {user.name}</header>;
}
```

##### Request State Changes via Callbacks

```javascript
function TaskItem({ task, onStatusChange, onDelete }) {
  const handleToggle = () => {
    // ✅ Delegate state changes to parent
    onStatusChange(task.id, !task.completed);
  };

  return (
    <div>
      <span>{task.title}</span>
      <button onClick={handleToggle}>
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
function BadComponent({ items }) {
  // ❌ Never mutate props directly
  items.push(newItem); // This will cause bugs!

  return <div>{items.length}</div>;
}

function GoodComponent({ items, onAddItem }) {
  // ✅ Request changes through callbacks
  const handleAdd = () => {
    onAddItem(newItem);
  };

  return (
    <div>
      {items.length}
      <button onClick={handleAdd}>Add Item</button>
    </div>
  );
}
```

##### Don't Directly Modify Other Components' State

```javascript
// ❌ Bad: Reaching into other components
function BadSidebar({ mainContentRef }) {
  const handleToggle = () => {
    mainContentRef.current.setState({ collapsed: true }); // Don't do this!
  };
}

// ✅ Good: Use callbacks for communication
function GoodSidebar({ onToggle }) {
  return (
    <div>
      <button onClick={onToggle}>Toggle Main Content</button>
    </div>
  );
}
```

##### Don't Promote Local State Unnecessarily

```javascript
// ❌ Bad: Unnecessary global state
const globalState = {
  isModalOpen: false, // This should be local to the modal component
  selectedTab: 0, // This should be local to the tab component
};

// ✅ Good: Keep state local when possible
function Modal() {
  const [isOpen, setIsOpen] = useState(false); // Local state
  // ...
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
      {/* ✅ Direct communication with immediate children */}
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

    // ✅ Notify parent of changes
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
function BadGrandparent() {
  const grandchildRef = useRef();

  const handleAction = () => {
    // ❌ Reaching deep into component tree when a props approach can be used instead
    grandchildRef.current.someMethod();
  };

  return (
    <Parent>
      <Child>
        <Grandchild ref={grandchildRef} />
      </Child>
    </Parent>
  );
}

// ✅ Good: Use props communication
function GoodGrandparent() {
  const [keyword, setKeyword] = useState('');

  return (
    <Parent>
      <Child>
        <Grandchild keyword={keyword} />
      </Child>
    </Parent>
  );
}

// ✅ Good: Use callbacks for communication
function GoodGrandparent() {
  const validationCallback = () => {
    // Handle parent-related logics
  };

  return (
    <Parent>
      <Child>
        <Grandchild validationCallback={validationCallback} />
      </Child>
    </Parent>
  );
}
```

### UI Component Responsibilities

#### ✅ Pure UI Components

##### Focus on Presentation

```javascript
// ✅ Pure UI component - no business logic
function Button({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  children,
  onClick,
}) {
  const className = `btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''}`;

  return (
    <button className={className} disabled={disabled} onClick={onClick}>
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
  const [inCart, setInCart] = useState(false);

  const handleAddToCart = async () => {
    // ❌ Business logic doesn't belong here
    const user = await getCurrentUser();
    if (!user.isPremium && product.isPremium) {
      showUpgradeModal();
      return;
    }

    await addToCart(product.id);
    await updateInventory(product.id, -1);
    await trackPurchaseEvent(product);
    setInCart(true);
  };

  return (
    <div className='product-card'>
      <img src={product.image} alt={product.name} />
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

function CardFooter({ children }) {
  return <div className='card-footer'>{children}</div>;
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
      </CardBody>
      <CardFooter>
        <button>Edit Profile</button>
      </CardFooter>
    </Card>
  );
}
```

### Quick Reference Checklist

#### ✅ Good Component Responsibilities

- [ ] Has a single, clear purpose
- [ ] Manages only its own internal state
- [ ] Communicates with parent via callbacks
- [ ] Controls only immediate children
- [ ] Makes API calls relevant to its purpose
- [ ] Avoids side effects that affect other components
- [ ] UI components focus only on presentation

#### ❌ Avoid These Anti-Patterns

- [ ] Mutating props or external state
- [ ] Reaching deep into component tree when a props approach can be used instead
- [ ] Making API calls with global side effects
- [ ] Mixing business logic with UI components
- [ ] Promoting local state unnecessarily
- [ ] Tight coupling between unrelated components
