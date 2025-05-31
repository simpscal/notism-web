# Two-Way Binding

## 🔄 What is Two-Way Binding?

Two-way binding creates a synchronized connection between state and UI where:

- **State → UI**: Changes in state automatically update the interface
- **UI → State**: User interactions automatically update the state

```javascript
// Basic two-way binding
const [value, setValue] = useState('');

<input
  value={value} // State flows to UI
  onChange={e => setValue(e.target.value)} // UI updates state
/>;
```

## 🪝 Custom Hooks for Two-Way Binding

### Basic useInput Hook

```javascript
import { useState } from 'react';

function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const bind = {
    value,
    onChange: e => setValue(e.target.value),
  };

  return [value, bind, setValue];
}
```

### Enhanced useInput with Additional Features

```javascript
import { useState, useCallback } from 'react';

function useInput(initialValue, options = {}) {
  const [value, setValue] = useState(initialValue);
  const {
    transform, // Function to transform input value
    validate, // Function to validate input
    debounce = 0, // Debounce delay in ms
  } = options;

  const handleChange = useCallback(
    e => {
      let newValue = e.target.value;

      // Apply transformation if provided
      if (transform) {
        newValue = transform(newValue);
      }

      // Apply validation if provided
      if (validate && !validate(newValue)) {
        return; // Don't update if validation fails
      }

      setValue(newValue);
    },
    [transform, validate]
  );

  const bind = {
    value,
    onChange: handleChange,
  };

  return [value, bind, setValue];
}
```

## 📝 Normal Two-Way Binding Patterns

### Simple Form Usage

```javascript
function ContactForm() {
  const [name, bindName, setName] = useInput('');
  const [email, bindEmail, setEmail] = useInput('');
  const [message, bindMessage, setMessage] = useInput('');

  const handleSubmit = e => {
    e.preventDefault();
    console.log({ name, email, message });
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input {...bindName} placeholder='Enter your name' />
      </div>

      <div>
        <label>Email:</label>
        <input {...bindEmail} type='email' placeholder='Enter your email' />
      </div>

      <div>
        <label>Message:</label>
        <textarea {...bindMessage} placeholder='Enter your message' />
      </div>

      <button type='submit'>Submit</button>
      <button type='button' onClick={handleReset}>
        Reset
      </button>
    </form>
  );
}
```

### Different Input Types

```javascript
function FormWithDifferentInputs() {
  // Text inputs
  const [username, bindUsername] = useInput('');

  // Number inputs with transformation
  const [age, bindAge] = useInput('', {
    transform: value => value.replace(/\D/g, ''), // Only digits
  });

  // Uppercase transformation
  const [code, bindCode] = useInput('', {
    transform: value => value.toUpperCase(),
  });

  return (
    <form>
      <input {...bindUsername} placeholder='Username' />
      <input {...bindAge} placeholder='Age (numbers only)' />
      <input {...bindCode} placeholder='Code (auto uppercase)' />
    </form>
  );
}
```

---

## 🔧 Custom Two-Way Binding for Components

### Parent-Child Two-Way Binding

```javascript
function ParentComponent() {
  const [user, bindUser, setUser] = useInput({ name: '', email: '' });

  const handleUserUpdate = updatedUser => {
    setUser(updatedUser);
  };

  return (
    <div>
      <h2>Current User: {JSON.stringify(user)}</h2>
      <UserEditor value={user} onChange={handleUserUpdate} />
    </div>
  );
}

function UserEditor({ value, onChange }) {
  const [editingValue, setEditingValue] = useState({ ...value });

  // Sync with parent when value changes
  useEffect(() => {
    setEditingValue({ ...value });
  }, [value]);

  const handleFieldChange = field => newValue => {
    const updatedUser = { ...editingValue, [field]: newValue };
    setEditingValue(updatedUser);

    // Notify parent of changes (two-way binding)
    onChange?.(updatedUser);
  };

  return (
    <div>
      <input
        value={editingValue.name}
        onChange={e => handleFieldChange('name')(e.target.value)}
        placeholder='Name'
      />
      <input
        value={editingValue.email}
        onChange={e => handleFieldChange('email')(e.target.value)}
        placeholder='Email'
      />
    </div>
  );
}
```
