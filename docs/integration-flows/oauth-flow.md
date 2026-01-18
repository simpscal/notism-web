# OAuth Flow Sequence Diagrams

## 1. Initiation Phase

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '16px', 'primaryColor': '#fff', 'primaryTextColor': '#000', 'primaryBorderColor': '#7C0000', 'lineColor': '#F8B229', 'secondaryColor': '#006100', 'tertiaryColor': '#fff'}}}%%
sequenceDiagram
    participant User
    participant LoginPage as Login Page<br/>(Frontend)
    participant BackendAPI as Backend API
    participant OAuthProvider as OAuth Provider<br/>(Google/GitHub)

    User->>LoginPage: Clicks OAuth Button (Google/GitHub)
    LoginPage->>LoginPage: handleOAuthLogin(provider)
    LoginPage->>BackendAPI: GET /auth/:provider/redirect
    BackendAPI-->>LoginPage: { redirectUrl: string }
    LoginPage->>OAuthProvider: Redirect to OAuth Provider URL
```

## 2. Authorization Phase

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '16px', 'primaryColor': '#fff', 'primaryTextColor': '#000', 'primaryBorderColor': '#7C0000', 'lineColor': '#F8B229', 'secondaryColor': '#006100', 'tertiaryColor': '#fff'}}}%%
sequenceDiagram
    participant User
    participant OAuthProvider as OAuth Provider<br/>(Google/GitHub)
    participant RouteGuard as OAuthCallbackRouteGuard

    OAuthProvider->>User: Show Login/Authorization Page
    User->>OAuthProvider: Authenticates & Authorizes

    alt User Authorizes Successfully
        OAuthProvider->>RouteGuard: Redirect to /auth/:provider/callback?code=...&state=...
    else User Cancels/Denies
        OAuthProvider->>RouteGuard: Redirect to /auth/:provider/callback?error=...
    end
```

## 3. Validation Phase

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '16px', 'primaryColor': '#fff', 'primaryTextColor': '#000', 'primaryBorderColor': '#7C0000', 'lineColor': '#F8B229', 'secondaryColor': '#006100', 'tertiaryColor': '#fff'}}}%%
sequenceDiagram
    participant RouteGuard as OAuthCallbackRouteGuard
    participant User
    participant LoginPage as Login Page<br/>(Frontend)
    participant CallbackPage as OAuth Callback<br/>(Frontend)

    RouteGuard->>RouteGuard: Validate provider parameter

    alt Provider Missing
        RouteGuard->>User: Show Error Toast
        RouteGuard->>LoginPage: Redirect to /auth/login
    else Provider Valid
        RouteGuard->>RouteGuard: Check for error parameter

        alt Error Parameter Exists
            RouteGuard->>User: Show Error Toast
            RouteGuard->>LoginPage: Redirect to /auth/login
        else No Error
            RouteGuard->>RouteGuard: Validate code parameter

            alt Code Missing
                RouteGuard->>User: Show Error Toast
                RouteGuard->>LoginPage: Redirect to /auth/login
            else Code Valid
                RouteGuard->>CallbackPage: Render OAuthCallback Component
            end
        end
    end
```

## 4. Token Exchange Phase

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '16px', 'primaryColor': '#fff', 'primaryTextColor': '#000', 'primaryBorderColor': '#7C0000', 'lineColor': '#F8B229', 'secondaryColor': '#006100', 'tertiaryColor': '#fff'}}}%%
sequenceDiagram
    participant CallbackPage as OAuth Callback<br/>(Frontend)
    participant BackendAPI as Backend API
    participant OAuthProvider as OAuth Provider<br/>(Google/GitHub)

    CallbackPage->>CallbackPage: Extract code & state from URL
    CallbackPage->>BackendAPI: POST /auth/:provider/callback<br/>{ code, state }

    alt Token Exchange Success
        BackendAPI->>OAuthProvider: Exchange code for tokens
        OAuthProvider-->>BackendAPI: Access Token & User Info
        BackendAPI-->>CallbackPage: { token, user, expiresAt, refreshToken }
    else Token Exchange Fails
        BackendAPI-->>CallbackPage: Error Response
        Note over CallbackPage: Global Error Handler<br/>Shows Error Toast
    end
```

## 5. Authentication Phase

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'fontSize': '16px', 'primaryColor': '#fff', 'primaryTextColor': '#000', 'primaryBorderColor': '#7C0000', 'lineColor': '#F8B229', 'secondaryColor': '#006100', 'tertiaryColor': '#fff'}}}%%
sequenceDiagram
    participant CallbackPage as OAuth Callback<br/>(Frontend)
    participant ReduxStore as Redux Store
    participant User

    CallbackPage->>ReduxStore: dispatch(setAuth(token, user))
    CallbackPage->>User: Show Success Toast
    CallbackPage->>User: Navigate to /profile
```

## Error Handling

| Error Scenario             | Handler              | Action                                   |
| -------------------------- | -------------------- | ---------------------------------------- |
| Missing Provider           | Route Guard          | Show error toast → Redirect to login     |
| OAuth Error Parameter      | Route Guard          | Show error toast → Redirect to login     |
| Missing Authorization Code | Route Guard          | Show error toast → Redirect to login     |
| Token Exchange Failure     | Global Error Handler | Show error toast → Stay on callback page |

## Flow Description

### 1. **Initiation Phase**

- User clicks OAuth button (Google/GitHub) on login page
- Frontend calls `oauthApi.getOAuthRedirect(provider)`
- Backend generates OAuth redirect URL with state parameter
- Frontend redirects user to OAuth provider

### 2. **Authorization Phase**

- User authenticates with OAuth provider (Google/GitHub)
- User authorizes the application
- OAuth provider redirects back to `/auth/:provider/callback` with authorization code

### 3. **Validation Phase**

- `OAuthCallbackRouteGuard` validates:
    - Provider parameter exists
    - No error parameter in URL
    - Authorization code exists
- If validation fails, shows error and redirects to login

### 4. **Token Exchange Phase**

- `OAuthCallback` component calls `oauthApi.handleOAuthCallback(provider, {code, state})`
- Backend exchanges authorization code for access tokens
- Backend returns user data and tokens

### 5. **Authentication Phase**

- `dispatch(setAuth(token, user))` stores tokens and user in Redux
- Success toast is shown
- User is redirected to profile page

## Components Involved

- **Login Page** (`pages/login/login.tsx`): Initiates OAuth flow
- **OAuth Callback Guard** (`pages/oauth-callback/guards/oauth-callback-route.guard.tsx`): Validates callback parameters
- **OAuth Callback Page** (`pages/oauth-callback/oauth-callback.tsx`): Handles callback and token exchange
- **OAuth API** (`apis/oauth.api.ts`): API methods for OAuth operations
- **Auth Slice** (`store/auth/auth.slice.ts`): Redux slice for authentication state

## API Endpoints

- `GET /auth/:provider/redirect` - Get OAuth redirect URL
- `POST /auth/:provider/callback` - Exchange authorization code for tokens

## Error Handling

- **Missing Provider**: Guard redirects to login with error toast
- **OAuth Error**: Guard checks error parameter and redirects to login
- **Missing Code**: Guard redirects to login with error toast
- **API Errors**: Handled by global error interceptor
