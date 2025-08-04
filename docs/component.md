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
import React, { useState } from 'react';
import { useCustomHook } from '@/hooks/useCustomHook';

// 2. TYPES
interface Props {
  title: string;
  onAction?: () => void;
}

// 3. COMPONENT DEFINITION
function MyComponent({ title, onAction }: Props) {
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
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      {isEditing ? <EditForm /> : <DisplayInfo />}
      <button onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? 'Cancel' : 'Edit'}
      </button>
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
    <button
      className={`btn btn-${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
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
