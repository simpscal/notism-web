# Model Definition

## Base Model

⚠️ **Optional - if there is only one view model.**

**Conventions**:

- Suffix the name with `BaseModel`
- Include common fields a model should have

**Example**:

```javascript
class UserBaseModel {
	id: string;
	name: string;
	...
}
```

## View Model

**Conventions**:

- Suffix the name with `ViewModel`
- Derive from `BaseModel`
- Include fields will be displayed on UI
- Include a method to map `ViewModel` to `RequestModel`

**Example**:

```javascript
export class UserViewModel extends UserBaseModel{
  fullName: string;
  isHighlight: boolean;

	// Should be used in components before passing data to services.
	toRequestModel(){
		...
	}
}
```

## Request Model

⚠️ **Optional - if `RequestModel` is similar to `ViewModel`.**

**Conventions**:

- Suffix the name with `RequestModel`
- Derive from `BaseModel`
- Include fields will be sent to the server

**Example**:

```javascript
export class UserRequest extends UserBaseModel{
	organization: string;
}
```

## Response Model

⚠️ **Optional - if `ResponseModel` is similar to `ViewModel`.**

**Conventions:**

- Suffix the name with `ResponseModel`
- Derive from `Base Model`
- Include fields returned from the server
- Include a method to map `Response Model` to `View Model`

**Example**:

```javascript
export class UserResponseModel extends UserBaseModel{
  organizationId: string;

	// Should be used in services before returning to components.
	toViewModel() {
		...
	}
}
```

## UI Model

**Conventions**:

- Suffix the name with `Model`
- Neither sent to the server or returned from the server

**Example**:

```javascript
export class ActionButtonModel {
    type: string;
    position: string;
}
```

## Broadcast Model

**Conventions**:

- Suffix the name with `BroadcastModel`

**Example**:

```javascript
export class UpdateUserBroadcastModel {
  id: string;
}
```
