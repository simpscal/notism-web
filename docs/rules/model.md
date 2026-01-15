# Model Definition

This document defines the naming conventions and structure for data models used throughout the application. All models follow **PascalCase** naming and use descriptive suffixes to indicate their purpose.

## When to Use Model vs Interface/Type

**Use Model suffix** (ViewModel, RequestModel, ResponseModel) when:

- Data is returned from backend via API calls
- Data is a requested payload sent to the server
- Data is transformed from backend response

**Use Interface or Type** for:

- Component props
- UI-only data structures
- Event handlers and callbacks
- Internal application state
- Configuration objects
- Any data that doesn't come from or go to the backend

## Quick Reference

| Model Type     | Suffix          | Usage                                  |
| -------------- | --------------- | -------------------------------------- |
| View Model     | `ViewModel`     | Data transformed from backend response |
| Request Model  | `RequestModel`  | Data sent to the server as payload     |
| Response Model | `ResponseModel` | Data returned from the server via API  |

## View Model

**Conventions**:

- **PascalCase** naming
- Suffix the name with `ViewModel`
- Used for data transformed from backend response for use in UI
- Can be a class or interface depending on needs
- Include fields that will be displayed on UI
- Include a method to map `ViewModel` to `RequestModel` (if needed)

**Example**:

```typescript
export class UserViewModel {
    id: string;
    name: string;
    email: string;
    fullName: string;
    isHighlight: boolean;

    constructor(data: Partial<UserViewModel> = {}) {
        Object.assign(this, data);
    }

    toRequestModel() {
        return new UserRequestModel({
            id: this.id,
            name: this.name,
            // ... map other fields
        });
    }
}
```

## Request Model

**Conventions**:

- **PascalCase** naming
- Suffix the name with `RequestModel`
- Used for data sent to the server as payload
- Include fields that will be sent to the server
- Can be a class or interface depending on needs

**Example**:

```typescript
export class UserRequestModel {
    id: string;
    name: string;
    email: string;
    organization: string;

    constructor(data: Partial<UserRequestModel> = {}) {
        Object.assign(this, data);
    }
}
```

## Response Model

**Conventions:**

- **PascalCase** naming
- Suffix the name with `ResponseModel`
- Used for data returned from the server via API calls
- Include fields returned from the server
- Can be a class or interface depending on needs
- Include a method to map `ResponseModel` to `ViewModel` (if needed)

**Example**:

```typescript
export class UserResponseModel {
    id: string;
    name: string;
    email: string;
    organizationId: string;

    constructor(data: Partial<UserResponseModel> = {}) {
        Object.assign(this, data);
    }

    // Should be used in services before returning to components.
    toViewModel() {
        return new UserViewModel({
            id: this.id,
            name: this.name,
            // ... map other fields
        });
    }
}
```
