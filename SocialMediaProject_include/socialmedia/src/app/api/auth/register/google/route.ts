import { NextRequest , NextResponse } from "next/server";
import { o_authGoogleController } from "@/app/controllers/auth";

// https://localhost:3000/api/auth/register/google
// User clicks "Continue with Google" get route trigger...

export async function GET(request:NextRequest) : Promise<NextResponse> {
    return o_authGoogleController(request)
}


// ================================
// Google → Backend (OAuth Callback)
// ================================

// ================================
// Backend → Google (Token Exchange)
// ================================

// Backend exchanges authorization code for tokens

// ================================
// Google → Backend (Token Response)
// ================================

// Backend validates ID token

// ================================
// Backend (User Identity Resolution)
// ================================

// Backend extracts from ID token:
// - sub (Google user ID)
// - email
// - email_verified
// - name
// - picture

// Backend checks:
// - existing user with google_sub
// - existing user with same email
// - account status (banned / deleted)

// Backend decision:
// - login existing Google-linked user
// - link Google provider to existing email account
// - create new user account


// ================================
// Backend (User Creation / Update)
// ================================

// If new user:
// - create user record
// - mark email as verified
// - generate unique username
// - initialize profile defaults
// - set onboarding flags

// If existing user:
// - update last_login_at
// - update profile image (if allowed)


// ================================
// Backend (Session & Auth)
// ================================

// Backend creates:
// - access token (short-lived)
// - refresh token (long-lived)

// Backend stores:
// - hashed refresh token
// - device / IP / user-agent metadata
// - token rotation metadata

// Backend sets:
// - HttpOnly, Secure cookies (web)
// - OR returns tokens (SPA/mobile)


// ================================
// Backend (Post-Auth Side Effects)
// ================================

// Emit events:
// - USER_LOGIN
// - USER_SIGNUP (if new)

// Trigger:
// - analytics tracking
// - fraud / abuse detection
// - login counters
// - last_active timestamp


// ================================
// Backend → Frontend (Final Redirect)
// ================================

// Backend redirects user to:
// - intended route (stored during OAuth start)
// - OR onboarding
// - OR home feed

// Frontend hydrates authenticated user state
