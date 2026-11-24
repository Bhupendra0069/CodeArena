# CodeArena Authentication and Authorization

## Summary

CodeArena has a working JWT authentication flow for registration and login. The token is signed by the backend with `JWT_SECRET`; it is not a hard-coded sample token. It is returned after successful signup or login, stored in the browser's `localStorage`, and sent as a Bearer token on API requests.

Authorization is present at the route and battle-participant levels, but the project does not define user roles such as `admin` or `member`. Most protected operations mean "any authenticated user." See the limitations below before treating this as production-ready authorization.

## Authentication vs. Authorization

- **Authentication** answers: "Who is this user?" CodeArena checks email/password and verifies a JWT.
- **Authorization** answers: "May this authenticated user perform this operation or access this resource?" CodeArena protects selected routes and checks battle participation in some places. It has no role-based permissions.

## Signup and Login Flow

1. The forms in [Login.jsx](client/src/pages/Login.jsx) and [Register.jsx](client/src/pages/Register.jsx) call the shared auth context.
2. [authService.js](client/src/services/authService.js) sends `POST /api/auth/login` or `POST /api/auth/register` to the server.
3. The server validates required fields. Signup checks duplicate email/username; the `User` model validates username/email and requires a password of at least six characters.
4. The `User` model hashes passwords with bcrypt using 12 salt rounds. Login compares the submitted password with the stored hash; it does not compare or store a plaintext password.
5. After success, [authController.js](server/src/controllers/authController.js) signs a JWT containing the user's database ID, using `JWT_SECRET` and a seven-day expiry. The response includes the token and a limited user profile.
6. [AuthContext.jsx](client/src/context/AuthContext.jsx) stores the token in `localStorage` and updates the signed-in user state. On later page loads, it calls `GET /api/auth/me` to confirm that the token still works.

## How Protected Requests Work

- [api.js](client/src/services/api.js) adds `Authorization: Bearer <token>` to API requests when a token is in `localStorage`.
- [authMiddleware.js](server/src/middleware/authMiddleware.js) verifies the token signature and expiry with `JWT_SECRET`, loads the user from MongoDB, and sets `req.user`.
- Missing, invalid, or expired tokens are rejected with HTTP `401`.
- [ProtectedRoute.jsx](client/src/components/ProtectedRoute.jsx) redirects a visitor without a loaded user to `/login`. This is a user-interface gate only; the server middleware is the security boundary for API data and actions.
- [battleSocket.js](server/src/sockets/battleSocket.js) also verifies the JWT when a Socket.IO connection is established.

## Current Access Rules

| Area | Current rule |
|---|---|
| Register and login | Public endpoints, limited by the auth rate limiter |
| Problem list and problem API reads | Public API routes |
| Dashboard, profile, battle pages, and problem detail page | Wrapped in the frontend `ProtectedRoute` |
| Submission run, submit, and history APIs | Require any valid signed-in user |
| Battle creation, joining, and history APIs | Require any valid signed-in user |
| Battle details and battle socket room actions | Require a valid token; battle details and socket room actions also check that the user is a participant |
| Own account endpoints (`/api/auth/me`, `/api/users/me`) | Require a valid token and use the authenticated user's ID |
| Create problem (`POST /api/problems`) | Requires any valid token; there is no admin-role check |

## Authorization Gaps and Notes

- **No roles or admin permissions:** the `User` model has no role field and there is no role-checking middleware. In particular, any signed-in user can call `POST /api/problems`; add an explicit admin policy if only admins should create problems.
- **Problem detail page is more restricted than its comment suggests:** `App.jsx` says problem details are public to read, but `/problems/:id` is wrapped in `ProtectedRoute`. The API read route itself is public. Decide whether the page should be public or the comment should be changed.
- **Logout is client-side:** logout removes the browser's token, but the server does not keep a token revocation list. A copied token can remain usable until it expires (seven days) unless the signing secret is rotated or the account becomes unavailable.
- **Token storage:** `localStorage` is convenient but accessible to JavaScript running on the page. For a production deployment, assess an `HttpOnly`, `Secure`, `SameSite` cookie design and its CSRF implications.
- **Password policy:** the current minimum is six characters. Consider a stronger policy, email verification, password reset, and MFA before production use.

## Configuration and Safety

- Set a long, unique, private `JWT_SECRET` in `server/.env`. If it is missing, token signing/verification cannot work correctly.
- Never commit `.env` files or share JWTs. Use HTTPS in deployments so credentials and tokens are encrypted in transit.
- Do not use frontend route guards as a replacement for backend authorization checks.

## Verification Performed

- Confirmed the signup and login controller signs a JWT with `jsonwebtoken` and sets `expiresIn: '7d'`.
- Confirmed the user schema hashes passwords with bcrypt and compares the hash during login.
- Confirmed the local `GET /api/auth/me` endpoint returned HTTP `401` when called without an Authorization token.
- Confirmed the HTTP middleware and battle socket both verify tokens server-side.
