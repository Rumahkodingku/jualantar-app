# PRD — Customer Registration & Authentication Integration

## 1. Informasi Dokumen

- **Product:** JualAntar Customer App
- **Frontend:** `Rumahkodingku/jualantar-app`
- **Backend:** `Rumahkodingku/jualantar-api`
- **Scope:** onboarding, customer registration, email-verification state, login, session, current-user hydration, logout, protected routes, API error handling, and tests.
- **Frontend stack:** React 19, TypeScript, React Router 7.15.1, Tailwind CSS 4, shadcn/ui, Plus Jakarta Sans.
- **Backend auth:** Laravel Sanctum personal access token.
- **Architecture:** feature/module-based frontend architecture.
- **Status:** Implementation Ready

---

## 2. Executive Summary

Implement flow Customer dari first visit sampai authenticated session tanpa membuat authentication yang khusus untuk Customer.

Target boundary:

```text
Frontend
├── onboarding
├── auth
│   ├── login
│   ├── email verification UX
│   ├── session
│   └── logout
└── customer
    └── registration + customer-specific features

Backend
├── Customer
│   └── RegisterCustomer
└── IdentityAccess
    ├── Login
    ├── Logout
    ├── Email Verification
    ├── Current User
    ├── Sanctum
    └── Roles / Permissions
```

Prinsip utama: **Customer registration adalah domain Customer, sedangkan authentication adalah concern IdentityAccess.** Arsitektur frontend harus mengikuti pemisahan yang sama agar Driver, Merchant, dan Super Admin dapat memakai authentication foundation yang sama di masa depan.

---

## 3. Current-State Audit

### 3.1 Backend

Repository backend saat ini memiliki module `Customer` dan `IdentityAccess`.

Customer `RegisterCustomer` sudah menggunakan contract `UserProvisioning` dan `EmailVerification`, membuat identity user, memberikan role `customer`, membuat record customer, lalu mengirim verification email. fileciteturn52file0

Authentication sudah berada di `IdentityAccess`. `Login` memvalidasi email/password, menolak user yang belum verified, lalu membuat Sanctum token. fileciteturn55file0

`AuthenticationController` menangani login, logout, current user, email verification, dan resend verification. fileciteturn56file0

Route auth yang tersedia:

```text
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
POST /api/v1/auth/email/verification-notification
GET  /api/v1/auth/email/verify/{id}/{hash}
```

Route verification menggunakan signed middleware. fileciteturn57file0

### 3.2 Registration Contract

Endpoint:

```text
POST /api/v1/customers/register
```

Payload:

```json
{
    "email": "customer@example.com",
    "phone": "08123456789",
    "username": "customer123",
    "full_name": "Customer Name",
    "password": "password123",
    "password_confirmation": "password123"
}
```

Validation backend saat ini mewajibkan email, phone, username, full_name, password, dan password confirmation. fileciteturn61file0

Success response: `201 Created`, dengan data minimal:

```json
{
    "user_id": "...",
    "email": "customer@example.com",
    "email_verified": false
}
```

Resource registration saat ini mengekspos user id, email, dan verification state. fileciteturn63file0

### 3.3 Login Contract

Endpoint:

```text
POST /api/v1/auth/login
```

Payload:

```json
{
    "email": "customer@example.com",
    "password": "password123"
}
```

Validation login saat ini hanya membutuhkan email dan password. fileciteturn62file0

Success result menyediakan:

```json
{
    "token": "...",
    "token_type": "Bearer",
    "user": {
        "id": "...",
        "name": "...",
        "email": "...",
        "roles": ["customer"],
        "permissions": [],
        "created_at": "...",
        "updated_at": "..."
    }
}
```

`UserResource` saat ini memang menyediakan roles dan permissions. fileciteturn85file0

### 3.4 Frontend

Repository frontend masih sangat awal. `app/routes.ts` hanya mendaftarkan route index ke `routes/home.tsx`, dan home masih placeholder. fileciteturn70file0 fileciteturn71file0

Frontend menggunakan React Router 7.15.1, React 19, TypeScript, Tailwind 4, shadcn/ui, dan Plus Jakarta Sans. fileciteturn68file0

`react-router.config.ts` saat ini menggunakan SSR (`ssr: true`). fileciteturn84file0

`docs/ARCHITECTURE.md` menetapkan:

- feature/module-based architecture;
- Axios instance tunggal di `app/lib/api.ts`;
- TanStack Query sebagai default server-state;
- Zod untuk runtime validation;
- route registry terpusat tetapi route detail milik module;
- API request melalui `services`;
- named export sebagai convention untuk selain route file;
- co-located unit/component tests.

Repository saat ini belum memiliki Axios, TanStack Query, Zod, atau Zustand pada `package.json`. fileciteturn68file0

---

## 4. Problem Statement

Tanpa fondasi auth yang benar, implementasi Customer dapat menyebabkan:

- API request berada langsung di component;
- token disimpan di banyak tempat;
- auth logic bercampur dengan Customer business logic;
- route protection diulang di setiap page;
- error API tidak konsisten;
- auth dibuat khusus Customer dan sulit dipakai role lain;
- SSR/browser-storage conflict;
- penambahan Driver/Merchant/Admin memerlukan refactor besar.

PRD ini mencegah masalah tersebut dengan menetapkan boundary dan urutan implementasi sejak awal.

---

## 5. Goals

### Primary

1. Customer dapat register melalui real API.
2. Customer menerima state bahwa email verification diperlukan.
3. Customer dapat resend verification email.
4. Customer verified dapat login.
5. Access token dikelola secara terpusat.
6. Current user diambil dari `/auth/me`.
7. Protected route memiliki single auth boundary.
8. Customer dapat logout.
9. Error API dinormalisasi.
10. Foundation dapat digunakan role lain.

### UX

1. Onboarding 2–3 screen.
2. Mobile-first responsive UI.
3. Loading, success, empty, dan error states.
4. Accessibility dasar.

---

## 6. Non-Goals

Tidak termasuk dalam scope:

- Google/Apple OAuth;
- OTP login;
- phone-number login;
- forgot/reset password UI;
- customer profile editing;
- address management;
- order/checkout;
- Driver/Merchant/Admin UI.

Struktur tetap harus siap untuk fitur-fitur tersebut.

---

## 7. Target User Flow

### First Visit

```text
Open App
   ↓
Onboarding belum selesai?
   ├── Ya → Onboarding
   └── Tidak → Public Auth State
                    ↓
                 Login/Register
```

### Registration

```text
Register
  ↓
Client validation
  ↓
POST /customers/register
  ↓
201
  ↓
Verification Required Screen
  ↓
Open verification email
  ↓
GET /auth/email/verify/{id}/{hash}?expires=...&signature=...
  ↓
204
  ↓
Return to app
  ↓
Login
```

### Login

```text
Login
  ↓
POST /auth/login
  ↓
Token + User
  ↓
Persist session
  ↓
GET /auth/me
  ↓
Authenticated
  ↓
Customer Home
```

### Existing Session

```text
App boot
  ↓
Client reads session token
  ↓
Token exists?
  ├── No → unauthenticated
  └── Yes → GET /auth/me
               ├── 200 → authenticated
               └── error/401 → clear session
```

### Logout

```text
Logout
  ↓
POST /auth/logout
  ↓
Clear client session
  ↓
Clear current-user cache
  ↓
Login
```

---

## 8. Target Frontend Structure

```text
app/
├── components/
│   └── ui/
├── hooks/
├── lib/
│   ├── api.ts
│   ├── config.ts
│   ├── constants.ts
│   └── utils.ts
├── modules/
│   ├── onboarding/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── index.ts
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.keys.ts
│   │   │   ├── auth.mutations.ts
│   │   │   └── auth.queries.ts
│   │   ├── types/
│   │   └── index.ts
│   └── customer/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── schemas/
│       ├── services/
│       └── index.ts
└── routes.ts
```

Folder hanya dibuat ketika memiliki separation of concern yang nyata. Jangan membuat file/folder kosong hanya untuk mengikuti template.

---

## 9. Module Responsibilities

### Auth Module

Owner:

- login;
- logout;
- current user;
- token/session abstraction;
- email verification UX;
- resend verification;
- auth route guard.

Tidak boleh berisi Customer business rules.

### Customer Module

Owner:

- Customer registration;
- Customer profile;
- customer-specific business features.

`RegisterCustomer` frontend tetap berada di Customer module karena endpoint dan business operation bersifat customer-specific.

### Onboarding Module

Owner:

- onboarding slide state;
- completion/skip state;
- onboarding UI.

Tidak melakukan API authentication.

---

## 10. Dependency Installation

Tambahkan dependency sesuai architecture document:

```bash
bun add axios @tanstack/react-query zod
```

Tidak menggunakan Redux atau HTTP client/server-state library kedua.

React Hook Form tidak wajib; gunakan hanya bila benar-benar diperlukan untuk mengelola form kompleks. Native React state tetap diperbolehkan untuk form sederhana.

---

## 11. API Infrastructure

Buat single Axios instance:

```text
app/lib/api.ts
```

Tanggung jawab:

- base URL;
- common headers;
- bearer-token injection;
- error normalization.

Environment:

```text
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Production harus memakai environment production dan HTTPS.

Tidak boleh membuat `axios.create()` di dalam module.

---

## 12. API Error Normalization

Normalisasi error pada HTTP layer menjadi bentuk konsisten:

```ts
type ApiError = {
  status: number
  code?: string
  message: string
  errors?: Record<string, string[]>
}
```

Flow:

```text
Axios error
   ↓
normalizeApiError()
   ↓
ApiError
   ↓
TanStack Query mutation/query
   ↓
UI
```

Component tidak boleh mengakses raw Axios response untuk menentukan jenis error.

---

## 13. Session Management

Backend saat ini mengembalikan Sanctum personal access token. Request authenticated harus mengirim:

```http
Authorization: Bearer <token>
```

Buat abstraction:

```text
modules/auth/services/session.ts
```

API abstraction minimal:

```text
getToken()
setToken(token)
clearToken()
hasToken()
```

Jangan membaca `localStorage` secara langsung dari component/page.

### Storage

Untuk MVP PWA, gunakan `localStorage` agar session tidak hilang setelah browser restart.

Aturan:

- jangan simpan password;
- jangan log token;
- jangan taruh token di URL;
- jangan kirim token ke analytics;
- semua production traffic HTTPS.

Karena frontend SSR, browser storage hanya boleh dibaca pada client runtime. Jangan membaca `window`/`localStorage` pada module scope.

---

## 14. Auth State

Gunakan status:

```ts
type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
```

State harus menyediakan:

```text
status
user
isAuthenticated
```

User source of truth adalah `/auth/me`.

Keberadaan token saja tidak boleh dianggap sebagai bukti session valid.

---

## 15. TanStack Query

Gunakan TanStack Query untuk server state.

Mutation yang dibutuhkan:

```text
useLoginMutation()
useLogoutMutation()
useRegisterCustomerMutation()
useResendVerificationMutation()
```

Query:

```text
useCurrentUserQuery()
```

Query key dimiliki auth module dan diekspos melalui public API module.

---

## 16. Zod Validation

Buat schema di module terkait.

Customer registration schema:

```text
email
phone
username
full_name
password
password_confirmation
```

Login schema:

```text
email
password
```

Client validation hanya untuk UX. Backend tetap menjadi authority untuk validation dan business constraints.

---

## 17. Customer Registration UI

Route:

```text
/register
```

Page:

```text
modules/customer/pages/register-customer-page.tsx
```

Form field:

```text
Full Name
Username
Email
Phone
Password
Confirm Password
```

Submit:

```text
POST /api/v1/customers/register
```

Success:

- response `201`;
- jangan otomatis login;
- jangan membuat token;
- arahkan/tampilkan verification-required state;
- simpan email minimum yang diperlukan untuk resend.

Error `422` harus dipetakan ke field jika backend menyediakan validation errors.

---

## 18. Email Verification UX

Route:

```text
/verify-email
```

UI harus menjelaskan:

- email verification diperlukan sebelum login;
- email tujuan;
- cek inbox/spam;
- resend verification;
- kembali ke login;
- check verification.

### Important

Backend verification link adalah signed URL:

```text
GET /api/v1/auth/email/verify/{id}/{hash}?expires=...&signature=...
```

Frontend **tidak**:

- membuat signature;
- menghitung hash untuk verification URL;
- mengubah expires;
- memodifikasi URL backend.

Ketika link dibuka, backend melakukan verification.

Karena endpoint verification saat ini merespons `204`, frontend tidak bergantung pada response body endpoint tersebut.

### Check Verification

Tombol `Saya sudah melakukan verifikasi` tidak boleh dianggap berhasil berdasarkan klik saja.

UI dapat memeriksa auth state/availability setelah verification sesuai contract backend. Karena login mensyaratkan verified email, flow paling sederhana adalah meminta user kembali ke login setelah verification selesai.

---

## 19. Resend Verification

Endpoint:

```text
POST /api/v1/auth/email/verification-notification
```

Payload:

```json
{
    "email": "customer@example.com"
}
```

Rules:

- disable tombol ketika request berjalan;
- feedback sukses;
- handle `429`;
- jangan melakukan polling agresif;
- jangan menyimpan password pada state verification.

---

## 20. Login UI

Route:

```text
/login
```

Page:

```text
modules/auth/pages/login-page.tsx
```

Form:

```text
Email
Password
```

Submit:

```text
POST /api/v1/auth/login
```

Success:

```text
set token
    ↓
fetch/invalidate current user
    ↓
authenticated
    ↓
navigate to customer home
```

Login tidak boleh dibuat sebagai `CustomerLogin`.

Authentication endpoint tetap global karena backend IdentityAccess akan dipakai Customer, Driver, Merchant, dan Super Admin.

---

## 21. Unverified Login

Backend akan menolak user yang belum verified. Frontend harus:

```text
Login
 ↓
Email not verified
 ↓
Verification screen
```

Email dapat dipertahankan sebagai UI state untuk resend. Password tidak boleh dipertahankan.

---

## 22. Current User

Endpoint:

```text
GET /api/v1/auth/me
```

Dipakai untuk:

- initial auth hydration;
- protected route;
- refresh user state;
- mengecek apakah session masih valid.

User resource menyediakan:

```text
id
name
email
roles
permissions
created_at
updated_at
```

Roles/permissions dipertahankan sebagai metadata authorization. Jangan menjadikan `customer` hard-coded sebagai bagian dari login mechanism.

---

## 23. Logout

Endpoint:

```text
POST /api/v1/auth/logout
```

Auth header wajib.

Success:

```text
204 No Content
```

Flow:

```text
logout mutation
 ↓
clearToken()
 ↓
clear/invalidate current-user query
 ↓
authenticated = false
 ↓
navigate /login
```

Jika backend merespons bahwa token sudah invalid, client tetap harus membersihkan local session.

---

## 24. Protected Routing

Authentication diterapkan pada route boundary, bukan di setiap page.

Target:

```text
ProtectedRoute
├── Customer Home
├── Orders
├── Profile
└── future authenticated features
```

Public:

```text
/
/onboarding
/login
/register
/verify-email
```

Authenticated:

```text
/app/...
```

Exact customer routes boleh berkembang, tetapi protected boundary harus tetap terpusat.

---

## 25. Role and Authorization Boundary

Authentication menjawab:

```text
Apakah user memiliki session valid?
```

Authorization menjawab:

```text
Apakah user memiliki role/permission yang dibutuhkan?
```

Target masa depan:

```text
Authenticated User
├── Customer
├── Driver
├── Merchant
└── Super Admin
```

Jangan membuat auth implementation terpisah untuk setiap role.

---

## 26. Onboarding

MVP terdiri dari 3 screen:

### Screen 1

**Semua kebutuhan lebih dekat dengan JualAntar**

Menjelaskan value utama JualAntar.

### Screen 2

**Lebih dari sekadar makanan**

Memperkenalkan layanan seperti:

```text
JAFood
JAMart
JASend
JATitip
JARide
```

### Screen 3

**Dukung yang lokal, untuk kita semua**

Menekankan merchant lokal dan ekosistem JualAntar.

Controls:

- Lanjut;
- Kembali;
- Lewati;
- Mulai Sekarang.

Simpan onboarding completion sebagai client-side UI preference. Tidak memanggil API auth.

---

## 27. UI / Design System

Gunakan existing design system:

```text
Tailwind CSS 4
shadcn/ui
Plus Jakarta Sans
Lucide React
```

Warna primary JualAntar harus menggunakan CSS variable existing:

```css
--primary
--primary-foreground
```

Current frontend sudah mendefinisikan primary red pada `app/app.css`. fileciteturn75file0

UI harus:

- mobile-first;
- responsive;
- touch-friendly;
- no horizontal overflow;
- keyboard accessible;
- mempunyai focus state;
- loading/disabled state;
- error/success feedback.

Gunakan component shadcn/ui yang sudah tersedia sebelum membuat primitive baru.

---

## 28. SSR Considerations

Frontend saat ini `ssr: true`. fileciteturn84file0

Karena token berada pada browser storage:

- jangan membaca storage pada server;
- jangan membaca `window`/`document` pada module scope;
- gunakan hydration/loading state;
- hindari hydration mismatch.

Target:

```text
SSR
 ↓
auth = loading
 ↓
client hydration
 ↓
read token
 ↓
GET /auth/me
 ↓
authenticated / unauthenticated
```

---

## 29. Route Composition

`app/routes.ts` hanya menjadi route registry/composition layer.

Detail route berada di module:

```text
modules/auth/routes/
modules/customer/routes/
modules/onboarding/routes/
```

Route file tipis dan mendelegasikan UI ke page.

Contoh:

```tsx
export default function LoginRoute() {
  return <LoginPage />
}
```

Tidak menaruh business logic authentication di `app/routes.ts`.

---

## 30. Component Naming

Contoh:

```text
login-form.tsx
verification-required.tsx
register-customer-form.tsx
onboarding-slide.tsx
```

Named export sebagai default convention untuk components, hooks, services, pages, dan utilities. Default export dipakai pada route files sesuai architecture document.

---

## 31. Loading / Success / Error States

### Registration

```text
idle
submitting
success
error
```

### Login

```text
idle
submitting
success
error
```

### Current user

```text
loading
authenticated
unauthenticated
```

### Resend

```text
idle
sending
sent
error
```

Tombol submit harus disabled ketika mutation sedang berlangsung.

---

## 32. UX Error Mapping

### 422

Field-level errors jika tersedia.

### 401

Login:

```text
Email atau password salah.
```

Authenticated API:

```text
Session sudah tidak valid. Silakan login kembali.
```

### 403

```text
Anda tidak memiliki akses.
```

### 429

```text
Terlalu banyak percobaan. Silakan coba lagi nanti.
```

### 500

```text
Terjadi masalah pada server. Silakan coba lagi.
```

Jangan menampilkan raw server error, SQL error, stack trace, atau token.

---

## 33. Security Requirements

1. Jangan menyimpan password.
2. Jangan log access token.
3. Jangan memasukkan token ke URL.
4. Jangan mengirim token ke analytics.
5. Jangan expose backend secrets.
6. Gunakan HTTPS pada production.
7. Signed email verification tetap diproses backend.
8. Backend menjadi authority untuk validation dan authorization.
9. Hindari `dangerouslySetInnerHTML` pada data user.
10. Jangan menambahkan third-party script yang tidak diperlukan.

Dengan bearer token di browser storage, XSS menjadi risiko penting. Pertahankan dependency minimal dan sanitasi user-generated content saat fitur tersebut ditambahkan.

---

## 34. Testing Strategy

Architecture frontend menetapkan co-located unit/component test. Untuk auth flow tambahkan integration/e2e test bila diperlukan.

### API service tests

Pastikan:

- path benar;
- method benar;
- payload benar;
- auth header benar;
- response mapping benar.

### Registration tests

```text
empty form
invalid email
invalid phone
invalid username
password mismatch
successful 201
422 validation
500 server error
```

### Login tests

```text
empty form
invalid credential
email not verified
successful login
loading state
401/500 handling
```

### Session tests

```text
no token → unauthenticated
valid token + /me → authenticated
invalid token → clear session
reload → restored session
```

### Verification tests

```text
verification-required state
resend success
resend rate-limit
return to login
```

### Protected route tests

```text
unauthenticated → redirect login
authenticated → accessible
expired session → login
```

### Logout tests

```text
call API
clear token
clear current user
redirect login
```

---

## 35. Manual End-to-End Acceptance Test

### Scenario A — New Customer

```text
Open app
→ onboarding
→ Register
→ fill all fields
→ submit
→ 201
→ verification screen
```

### Scenario B — Verification

```text
Open Mailpit/email
→ open verification URL
→ backend returns 204
→ return to app
```

### Scenario C — Login

```text
Login with verified account
→ 200
→ token persisted
→ /auth/me
→ Customer Home
```

### Scenario D — Unverified

```text
Login before verification
→ backend rejects
→ verification screen
→ resend
```

### Scenario E — Reload

```text
Authenticated
→ reload
→ token exists
→ /auth/me succeeds
→ user remains authenticated
```

### Scenario F — Logout

```text
Authenticated
→ logout
→ token cleared
→ protected route blocked
→ login page
```

---

## 36. Implementation Plan

### Phase 0 — Foundation Audit

1. Pastikan working tree bersih.
2. Audit current frontend structure.
3. Review `docs/ARCHITECTURE.md`.
4. Install required dependencies.
5. Add environment config.
6. Build `app/lib/api.ts`.
7. Build error normalization.
8. Build SSR-safe session abstraction.
9. Configure QueryClient/provider.

**Exit:** infrastructure auth-ready tanpa UI.

### Phase 1 — Auth Data Layer

1. Create auth types.
2. Create auth schemas.
3. Create `auth.api.ts`.
4. Create `auth.keys.ts`.
5. Create queries/mutations.
6. Test API functions.

**Exit:** API layer bisa diuji tanpa page.

### Phase 2 — Auth State

1. Current user query.
2. Initial session hydration.
3. Invalid token handling.
4. Authenticated/unauthenticated status.
5. Public API melalui `auth/index.ts`.

**Exit:** session lifecycle stabil.

### Phase 3 — Customer Registration

1. Customer registration schema.
2. Register API service.
3. Register mutation.
4. Registration page.
5. Registration form.
6. Field errors.
7. Success state.

**Exit:** Customer dapat membuat akun melalui real API.

### Phase 4 — Email Verification UX

1. Verification-required page.
2. Resend mutation.
3. Resend feedback.
4. Verification-to-login flow.

**Exit:** customer memahami dan dapat menyelesaikan verification flow.

### Phase 5 — Login

1. Login schema.
2. Login API service.
3. Login mutation.
4. Token persistence.
5. Current user hydration.
6. Unverified handling.
7. Redirect authenticated.

**Exit:** verified Customer dapat login.

### Phase 6 — Protected Route + Logout

1. Protected route.
2. Logout mutation.
3. Session cleanup.
4. Query cleanup.
5. Expired token behavior.

**Exit:** authenticated boundary bekerja.

### Phase 7 — Onboarding

1. Three onboarding slides.
2. Skip/next/back.
3. Completion state.
4. First-visit routing.

**Exit:** onboarding tidak muncul kembali setelah selesai kecuali reset dilakukan.

### Phase 8 — Hardening

Run:

```bash
bun typecheck
bun build
```

Kemudian lakukan:

- unit tests;
- component tests;
- auth integration tests;
- manual E2E flow;
- responsive audit;
- keyboard/accessibility audit.

---

## 37. Acceptance Criteria

### Registration

- [ ] `POST /api/v1/customers/register` berhasil digunakan.
- [ ] Payload sesuai contract.
- [ ] Client validation bekerja.
- [ ] 422 dipetakan dengan benar.
- [ ] Success menampilkan verification state.
- [ ] Tidak automatic login.

### Verification

- [ ] Verification instruction jelas.
- [ ] Resend tersedia.
- [ ] Loading/rate-limit ditangani.
- [ ] Signed URL tetap menjadi responsibility backend.
- [ ] Frontend tidak menghasilkan signature/hash/expires.

### Login

- [ ] Verified Customer dapat login.
- [ ] Token dikelola melalui session abstraction.
- [ ] `/auth/me` digunakan untuk current user.
- [ ] Unverified user diarahkan ke verification flow.
- [ ] Invalid credentials ditangani dengan aman.

### Session

- [ ] Reload mempertahankan authenticated session.
- [ ] Token invalid/expired dibersihkan.
- [ ] Token existence tidak otomatis berarti authenticated.

### Logout

- [ ] API logout dipanggil.
- [ ] Token dihapus.
- [ ] User state/cache dibersihkan.
- [ ] Protected route tidak dapat diakses lagi.

### Architecture

- [ ] Auth bukan bagian dari Customer business logic.
- [ ] Registration tetap milik Customer module.
- [ ] Satu Axios instance.
- [ ] TanStack Query untuk server state.
- [ ] Zod untuk runtime validation.
- [ ] Route registry tetap tipis.
- [ ] Module dependency lewat public API.
- [ ] Tidak ada circular dependency.
- [ ] Tidak ada `CustomerAuth`, `DriverAuth`, atau `MerchantAuth` terpisah.

### Quality

- [ ] `bun typecheck` pass.
- [ ] `bun build` pass.
- [ ] Responsive.
- [ ] Loading/error/success states tersedia.
- [ ] Keyboard/focus support tersedia.
- [ ] Tidak ada sensitive data di console.

---

## 38. Future Compatibility

Arsitektur harus langsung mendukung:

```text
IdentityAccess
      │
      ├── Customer
      ├── Driver
      ├── Merchant
      └── Super Admin
```

Frontend:

```text
modules/
├── auth/
├── customer/
├── driver/
├── merchant/
└── admin/
```

Semua role menggunakan auth/session layer yang sama, sedangkan masing-masing module memiliki business logic sendiri.

Contoh:

```text
Driver
  → auth/login
  → driver home

Merchant
  → auth/login
  → merchant dashboard

Super Admin
  → auth/login
  → admin dashboard
```

Tidak ada kebutuhan untuk membuat authentication foundation baru ketika role baru ditambahkan.

---

## 39. Implementation Rules

1. Audit repository sebelum mengubah struktur.
2. Ikuti `docs/ARCHITECTURE.md`.
3. Jangan membuat API request langsung di UI component/page.
4. Jangan membuat Axios instance kedua.
5. Jangan menggunakan Zustand untuk server state.
6. Jangan membaca localStorage pada SSR/module scope.
7. Jangan menyimpan password.
8. Jangan log token.
9. Jangan membuat auth khusus Customer.
10. Jangan menambahkan OAuth pada scope ini.
11. Jangan mengubah backend contract tanpa kebutuhan yang disepakati.
12. Jangan memasukkan domain business logic ke `app/lib`.
13. Module lain hanya boleh mengakses public API module auth/customer/onboarding.
14. Gunakan existing shadcn/ui/design tokens.
15. Hentikan implementasi bila ditemukan contract API yang berbeda dari PRD dan audit backend terlebih dahulu.
16. Jangan mengarang behavior API yang tidak didukung backend.

---

## 40. Definition of Done

Customer dapat menjalankan flow berikut tanpa intervensi developer:

```text
Open JualAntar
    ↓
Onboarding
    ↓
Register
    ↓
Email Verification
    ↓
Login
    ↓
Authenticated Customer Home
    ↓
Reload
    ↓
Still Authenticated
    ↓
Logout
    ↓
Login Screen
```

Semua acceptance criteria, test, security, responsive, dan architecture rules telah terpenuhi.

---

## 41. Sources Audited

### Backend — `Rumahkodingku/jualantar-api`

- `app/Modules/Customer/Application/Actions/RegisterCustomer.php`
- `app/Modules/Customer/Http/Controllers/CustomerController.php`
- `app/Modules/Customer/Http/Requests/RegisterCustomerRequest.php`
- `app/Modules/Customer/Http/Resources/RegisteredCustomerResource.php`
- `app/Modules/IdentityAccess/Application/Actions/Login.php`
- `app/Modules/IdentityAccess/Http/Controllers/AuthenticationController.php`
- `app/Modules/IdentityAccess/Routes/api.php`
- `app/Modules/IdentityAccess/Http/Requests/LoginRequest.php`
- `app/Modules/IdentityAccess/Http/Resources/UserResource.php`

### Frontend — `Rumahkodingku/jualantar-app`

- `package.json`
- `app/routes.ts`
- `app/routes/home.tsx`
- `app/root.tsx`
- `app/app.css`
- `react-router.config.ts`
- `docs/ARCHITECTURE.md`

Source-derived facts in this document are based on the repositories as audited on 2026-09-11.
