# OAuth Controller Fixes - TODO

## Goal
Fix bugs found in the OAuth flow in `src/app/controllers/auth.ts`.

## Steps
- [x] 1. Fix invalid redirect URL built with `false` (Google & Facebook callbacks)
- [x] 2. Fix `publickey.publickey` null dereference on login intent
- [x] 3. Use `getClientIP(request)` instead of server-side `getDevicePublicIP()`
- [x] 4. Fix double `@` in welcome email handle
- [x] 5. Validate `clientSecret` in Google config check
- [x] 6. Reorder state handling (find first, then validate & consume)
- [x] 7. Remove unused PKCE generation for Facebook (kept `codeVerifier` to satisfy oauth state schema)
- [x] 8. Correct `o_auth` field type in `src/app/db/models/users.ts`
- [ ] 9. Run TypeScript check (`npx tsc --noEmit`)
