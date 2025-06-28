# Firebase Auth Setup Guide

This project now includes comprehensive Firebase Authentication with Google Sign-In functionality. Here's how to set it up and use it:

## Setup Instructions

### 1. Firebase Project Configuration

Before using Firebase Auth, ensure your Firebase project is properly configured:

1. **Enable Google Authentication:**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Google" as a sign-in provider
   - Configure OAuth consent screen if needed

2. **Configure Authorized Domains:**
   - Add your development domain (usually `localhost`)
   - Add your production domain
   - For local development: `localhost` and `127.0.0.1`

3. **Environment Variables:**
   Make sure all Firebase environment variables are set in your `.env` file:
   ```env
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   FIREBASE_APP_ID=your_app_id
   FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### 2. Components and Features

The implementation includes several reusable components:

#### `GoogleSignInButton.vue`

A ready-to-use Google Sign-In button component.

```vue
<template>
  <GoogleSignInButton
    redirect-to="/dashboard"
    :show-success-message="true"
    @success="handleSuccess"
    @error="handleError"
  />
</template>
```

#### `AuthUserCard.vue`

Displays user information and provides sign-out functionality.

```vue
<template>
  <AuthUserCard
    :show-sign-in-button="true"
    redirect-after-sign-out="/"
    @sign-in-success="handleSignIn"
    @sign-out-success="handleSignOut"
  />
</template>
```

### 3. Authentication Composable

Use the `useAuth()` composable to manage authentication state:

```typescript
<script setup>
const {
  user,              // Current authenticated user
  isAuthenticated,   // Boolean: is user signed in
  isLoading,         // Boolean: auth state loading
  error,             // Error message if any
  signInWithGoogle,  // Function to sign in with Google
  signOutUser,       // Function to sign out
  clearError         // Function to clear error state
} = useAuth();
</script>
```

### 4. Route Protection

Protect routes using the auth middleware:

```vue
<script setup>
// This page requires authentication
definePageMeta({
  middleware: "auth",
});
</script>
```

Users will be redirected to `/auth?redirect=<original-url>` if not authenticated.

### 5. Demo Pages

- **`/auth`** - Authentication demo and sign-in page
- **`/protected`** - Example of a protected page requiring authentication
- **`/`** - Updated homepage with auth status display

### 6. Internationalization

Auth messages are available in multiple languages:

```typescript
// English
$t("auth.signInWithGoogle"); // "Sign in with Google"
$t("auth.signOut"); // "Sign Out"
$t("auth.welcomeBack"); // "Welcome back"

// Traditional Chinese
$t("auth.signInWithGoogle"); // "使用 Google 登入"
$t("auth.signOut"); // "登出"

// Simplified Chinese
$t("auth.signInWithGoogle"); // "使用 Google 登录"
$t("auth.signOut"); // "登出"
```

## Usage Examples

### Basic Sign-In Flow

```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      <h1>Welcome, {{ user?.displayName }}!</h1>
      <button @click="signOut">Sign Out</button>
    </div>

    <div v-else>
      <GoogleSignInButton @success="handleSignIn" />
    </div>
  </div>
</template>

<script setup>
const { user, isAuthenticated, signOutUser } = useAuth();

const handleSignIn = user => {
  console.log("User signed in:", user);
};

const signOut = async () => {
  await signOutUser();
};
</script>
```

### Protecting Routes

```vue
<!-- pages/dashboard.vue -->
<script setup>
definePageMeta({
  middleware: "auth",
});

// This page is automatically protected
// Users must be authenticated to access it
</script>
```

### Conditional Rendering Based on Auth State

```vue
<template>
  <div>
    <!-- Show for authenticated users only -->
    <div v-if="isAuthenticated">
      <UserProfile :user="user" />
    </div>

    <!-- Show for unauthenticated users only -->
    <div v-else>
      <GoogleSignInButton />
    </div>

    <!-- Show loading state -->
    <div v-if="isLoading">Loading...</div>
  </div>
</template>
```

## Error Handling

The auth system includes comprehensive error handling for common scenarios:

- Popup blocked by browser
- User cancels sign-in
- Network errors
- Too many requests
- Account disabled

Errors are automatically mapped to user-friendly messages and available in multiple languages.

## Security Considerations

1. **Client-Side Only**: Authentication happens entirely on the client side
2. **Firebase Rules**: Configure Firestore security rules to protect data
3. **Route Protection**: Use middleware to protect sensitive routes
4. **Token Validation**: Consider server-side token validation for API endpoints

## Troubleshooting

### Common Issues

1. **"Operation not allowed" error**
   - Ensure Google sign-in is enabled in Firebase Console
   - Check that your domain is in the authorized domains list

2. **Popup blocked**
   - Users need to allow popups for your domain
   - Consider using redirect flow instead of popup

3. **Development environment issues**
   - Make sure `localhost` is in authorized domains
   - Check that all environment variables are correctly set

### Debugging

Enable debug mode by checking browser console for detailed Firebase Auth logs.

## Next Steps

- Implement additional sign-in providers (Facebook, GitHub, etc.)
- Add email/password authentication
- Implement user profile management
- Add role-based access control
- Integrate with server-side authentication for API protection
