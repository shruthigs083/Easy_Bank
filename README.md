# Easy_Bank

EasyBank is an accessibility-focused simulated banking web application designed for rural users and people with low digital literacy.

## Important
This is an **educational banking application**. It does not connect to a real bank and does not transfer real money. Do not enter real banking passwords, card numbers, OTPs, or other sensitive financial credentials.

## Features
- Simple registration and login
- Large, accessible interface
- Full English, Kannada, and Hindi language switching across login, registration, navigation, dashboard, send/receive money, transactions, bills, help, and profile pages
- Dashboard with balance
- Send money to another registered account by its 10-digit EasyBank phone number
- Receive-money page with account details and phone-number copy
- Transaction history
- Enhanced mobile recharge and bill payment with operator/type selection, account-number validation, quick amounts, balance checks, and transaction records
- Saved contacts for frequently used EasyBank phone numbers
- Help page with simple instructions
- Profile page
- MongoDB persistence
- JWT authentication
- Password hashing with bcrypt
- Responsive mobile-first UI

## Tech stack
Frontend: React + Vite + React Router + Axios + CSS
Backend: Node.js + Express + MongoDB + Mongoose + JWT + bcryptjs

## Requirements
- Node.js 20.19+ or 22.12+ (required by Vite 7)
- npm
- MongoDB Community Server OR a MongoDB Atlas connection
- VS Code

## 1. Open the project on Windows
Extract the project to a writable folder such as `C:\Projects\EasyBank`, then open that folder in VS Code:

```powershell
code C:\Projects\EasyBank
```

## 2. Install backend dependencies
Open a terminal:

```bash
cd C:\Projects\EasyBank\server
npm install
```

Create `server\.env` from the example only if it does not already exist. Keep any existing database configuration. The example uses a local MongoDB URI; replace it only with a MongoDB URI you have configured. Generate a private JWT secret (at least 32 characters) and do not commit or share it.

In PowerShell, the following commands preserve an existing `.env` and replace only the example JWT placeholder:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
$content = Get-Content .env -Raw
if ($content -match '(?m)^JWT_SECRET=change_this_to_a_long_random_secret$') {
  $bytes = New-Object byte[] 48
  $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
  $rng.GetBytes($bytes)
  $secret = [Convert]::ToBase64String($bytes)
  $content = $content.Replace('change_this_to_a_long_random_secret', $secret)
  [System.IO.File]::WriteAllText('.env', $content, (New-Object System.Text.UTF8Encoding($false)))
  $rng.Dispose()
  [Array]::Clear($bytes, 0, $bytes.Length)
}
```

Example:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/easybank
JWT_SECRET=replace_this_with_a_private_random_secret_at_least_32_characters_long
CLIENT_URL=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

If `nodemon` is unavailable, use:
```bash
npm start
```

## 3. Configure and install frontend dependencies

The default API URL is already `http://localhost:5000/api`. Copy `client\.env.example` to `client\.env` only if you need to override it.


Open another terminal:

```bash
cd C:\Projects\EasyBank\client
npm install
npm run dev
```

Open the URL Vite displays, normally:
`http://localhost:5173`

## 4. MongoDB
### Local MongoDB
Install/start MongoDB, then use:
`mongodb://127.0.0.1:27017/easybank`

### MongoDB Atlas
Create a database and put its connection string in `server/.env`.

## 5. Test accounts
You can register your own account.

For testing transfers, register two fictional users with distinct 10-digit phone numbers and synthetic starting balances.

During registration, the user chooses the Starting Balance. It can be ₹0 to ₹10,00,000; the application does not silently assign an initial balance.

To transfer simulated money, the recipient must already have an EasyBank account. Use the recipient's 10-digit phone number.

## 6. Project structure

```text
EasyBank/
├── client/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── styles.css
│ ├── index.html
│ ├── vite.config.js
│ ├── package-lock.json
│ └── package.json
├── server/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── .env.example
│ ├── package-lock.json
│ ├── package.json
│ └── server.js
└── README.md
```

## 7. How transfers work
1. Register a user and enter the Starting Balance.
2. Login.
3. Home shows the Balance.
4. Open Send Money.
5. Enter another registered user's 10-digit phone number and amount.
6. Confirm the transfer.
7. The backend creates two transaction records:
 - debit for sender
 - credit for recipient
8. Both balances are updated.
9. Transactions page displays the history.

## Accessibility decisions
- Large buttons
- Strong focus outlines
- Labels for form fields
- `aria-label`/semantic navigation where useful
- Text alongside icons
- No icon-only critical actions
- Responsive layout
- Simple confirmation screens
- High readability
- Language selector
- Reduced-motion support

## Common problems

### "npm is not recognized"
Install Node.js and restart VS Code.

### PowerShell blocks npm
Use Command Prompt in VS Code, or change PowerShell execution policy only if you understand the security implications.

### MongoDB connection error
Make sure MongoDB is running and the `MONGO_URI` is correct.

### CORS error
Make sure the frontend is running at the URL in `CLIENT_URL`.

### Blank React page
Check the browser console and terminal. Make sure both client and server dependencies were installed.


## 8. Implementation notes

### Multilingual support
The language provider is now global, so the selected language applies to:
- Login
- Registration
- Home
- Send Money
- Receive Money
- Transactions
- Recharge & Bills
- Help
- Profile
- Navigation
- Logout controls
- Error/status messages shown by the frontend

English, Kannada, and Hindi are included.

### Application behavior
- Fixed language context placement so it is not recreated separately for public/protected routes.
- Added a language selector to Login and Registration.
- Replaced hard-coded user-facing text on application pages with translation keys.
- Added language-aware transaction date formatting.
- Added safer clipboard handling on Receive Money.
- Added frontend API URL configuration through `VITE_API_URL`.
- Made auth local-storage restoration tolerant of corrupted saved JSON.
- The transfer flow uses balance checks and compensating updates rather than MongoDB multi-document transactions, so it can run on a standalone local MongoDB server. This is an educational implementation and does not provide production-grade financial transaction guarantees.
- Added an atomic sender balance check/update for transfers and best-effort rollback if a later operation fails.
- Removed the hard-coded ₹10,000 registration balance. Registration now requires a user-selected Starting Balance.
- Enhanced recharge/bills with mobile operator selection, mobile-number validation, bill-type selection, consumer/account number validation, quick amount buttons, payment limits, and balance display.
- Added account/mobile reference details to bill/recharge transaction descriptions.
- Added the same balance-safe update pattern to bill/recharge payments.
- Kept critical confirmation steps before money transfer.
- Kept the application as a simulated banking system rather than a real payment system.

### Recommended manual test sequence
1. Start MongoDB.
2. Start the backend in `server` with `npm run dev`.
3. Start the frontend in `client` with `npm run dev`.
4. Register two fictional users with unique phone numbers.
5. Change language on Login and Registration.
6. Login and change language from the dashboard.
7. Open every page and confirm all visible application text changes.
8. Send money from user A to user B using user B's phone number.
9. Login as user B and verify the credit transaction.
10. Make a mobile recharge or bill payment, choose the operator/type, enter the mobile/consumer number, and verify the debit transaction.
11. Register another account and confirm that its starting balance matches the amount entered during registration.
12. Refresh the browser and confirm the session and selected language remain.
13. Test the application at a narrow mobile width.

## Academic/project note
For a real banking product, authentication, payment processing, KYC, authorization, audit logging, encryption/key management, rate limiting, fraud controls, regulatory compliance, secure session management, and integration with regulated banking/payment infrastructure would require professional security review. This project intentionally remains a safe simulated banking environment.

## Contacts and phone-number transfers
- Send Money now uses the recipient's 10-digit EasyBank phone number instead of email.
- Users can save EasyBank contacts from the Contacts menu using name + phone number.
- Saved contacts are suggested while sending money by name or phone number.
- Contacts can be removed at any time.
