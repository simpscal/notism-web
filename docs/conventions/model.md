# Model Definition

This document defines the naming conventions and structure for data models used throughout the application. All models follow **PascalCase** naming and use descriptive suffixes to indicate their purpose.

## Quick Reference

| Model Type      | Suffix           | Usage                                        |
| --------------- | ---------------- | -------------------------------------------- |
| Base Model      | `BaseModel`      | Common fields shared by multiple models      |
| View Model      | `ViewModel`      | Data used in UI/view layer                   |
| Request Model   | `RequestModel`   | Data sent to the server                      |
| Response Model  | `ResponseModel`  | Data returned from the server                |
| UI Model        | `Model`          | UI-only data (not sent/received from server) |
| Broadcast Model | `BroadcastModel` | Event broadcasting between components        |

## Base Model

⚠️ **Optional - if there is only one view model.**

**Conventions**:

- **PascalCase** naming
- Suffix the name with `BaseModel`
- Include common fields a model should have
- Use classes (not interfaces) when inheritance is needed

**Example**:

```typescript
class UserBaseModel {
    id = '';
    name = '';
    email = '';

    constructor(data: Partial<UserBaseModel> = {}) {
        Object.assign(this, data);
    }
}
```

## View Model

**Conventions**:

- **PascalCase** naming
- Suffix the name with `ViewModel`
- Derive from `BaseModel` when applicable
- Include fields that will be displayed on UI
- Can be a class or interface depending on needs
- Include a method to map `ViewModel` to `RequestModel` (if needed)

**Example**:

```typescript
export class UserViewModel extends UserBaseModel {
    fullName: string;
    isHighlight: boolean;

    constructor(data: Partial<UserViewModel> = {}) {
        super(data);
        Object.assign(this, data);
    }

    // Should be used in components before passing data to services.
    toRequestModel(): UserRequestModel {
        return {
            id: this.id,
            name: this.name,
            // ... map other fields
        };
    }
}

// As interface
export interface UserProfileViewModel {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
}
```

## Request Model

⚠️ **Optional - if `RequestModel` is similar to `ViewModel`.**

**Conventions**:

- **PascalCase** naming
- Suffix the name with `RequestModel`
- Derive from `BaseModel` when applicable
- Include fields that will be sent to the server
- Can be a class or interface depending on needs

**Example**:

```typescript
export class UserRequestModel extends UserBaseModel {
    organization: string;

    constructor(data: Partial<UserRequestModel> = {}) {
        super(data);
        Object.assign(this, data);
    }
}

// As interface
export interface UpdateProfileRequestModel {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
}
```

## Response Model

⚠️ **Optional - if `ResponseModel` is similar to `ViewModel`.**

**Conventions:**

- **PascalCase** naming
- Suffix the name with `ResponseModel`
- Derive from `BaseModel` when applicable
- Include fields returned from the server
- Can be a class or interface depending on needs
- Include a method to map `ResponseModel` to `ViewModel` (if needed)

**Example**:

```typescript
export class UserResponseModel extends UserBaseModel {
    organizationId: string;

    constructor(data: Partial<UserResponseModel> = {}) {
        super(data);
        Object.assign(this, data);
    }

    // Should be used in services before returning to components.
    toViewModel(): UserViewModel {
        return new UserViewModel({
            id: this.id,
            name: this.name,
            // ... map other fields
        });
    }
}
```

## UI Model

**Conventions**:

- **PascalCase** naming
- Suffix the name with `Model`
- Used only in the UI layer
- Neither sent to the server nor returned from the server
- Can be a class or interface depending on needs

**Example**:

```typescript
export class ActionButtonModel {
    type: string;
    position: string;

    constructor(data: Partial<ActionButtonModel> = {}) {
        Object.assign(this, data);
    }
}

// Or as interface
export interface ActionButtonModel {
    type: string;
    position: string;
}
```

## Broadcast Model

**Conventions**:

- **PascalCase** naming
- Suffix the name with `BroadcastModel`
- Used for event broadcasting/communication between components
- Can be a class or interface depending on needs

**Example**:

```typescript
export class UpdateUserBroadcastModel {
    id: string;
    timestamp: number;

    constructor(data: Partial<UpdateUserBroadcastModel> = {}) {
        Object.assign(this, data);
    }
}

// Or as interface
export interface UpdateUserBroadcastModel {
    id: string;
    timestamp: number;
}
```
