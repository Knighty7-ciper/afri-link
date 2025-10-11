# AfriLink Backend API Reference

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication
All authenticated endpoints require a valid session from Supabase Auth. Include credentials in requests.

## Admin Endpoints

### Admin Management

#### List All Admins
```
GET /api/admin
Authorization: Required (Admin)
```

#### Create Admin
```
POST /api/admin
Authorization: Required (Admin)
Body: {
  email: string
  password: string
  full_name: string
}
```

#### Get Admin by ID
```
GET /api/admin/[id]
Authorization: Required (Admin)
```

#### Update Admin
```
PUT /api/admin/[id]
Authorization: Required (Admin)
Body: {
  full_name?: string
  permissions?: string[]
  is_active?: boolean
}
```

#### Delete Admin
```
DELETE /api/admin/[id]
Authorization: Required (Admin)
```

#### Get Platform Statistics
```
GET /api/admin/stats
Authorization: Required (Admin)
Response: {
  stats: {
    totalUsers: number
    totalWallets: number
    totalTransactions: number
    pendingKyc: number
  }
}
```

#### Suspend User
```
POST /api/admin/users/[id]/suspend
Authorization: Required (Admin)
Body: {
  reason: string
}
```

#### Activate User
```
POST /api/admin/users/[id]/activate
Authorization: Required (Admin)
```

## Role Management

#### List All Roles
```
GET /api/roles
Authorization: Required
```

#### Create Role
```
POST /api/roles
Authorization: Required (Admin)
Body: {
  name: string
  description?: string
  permissions: string[]
}
```

#### Get Role by ID
```
GET /api/roles/[id]
Authorization: Required
```

#### Update Role
```
PUT /api/roles/[id]
Authorization: Required (Admin)
```

#### Delete Role
```
DELETE /api/roles/[id]
Authorization: Required (Admin)
```

## Exchange Rates

#### Get All Exchange Rates
```
GET /api/exchange-rates
Query Parameters:
  - from?: string (currency code)
  - to?: string (currency code)
```

#### Update Exchange Rate
```
POST /api/exchange-rates
Authorization: Required (Admin)
Body: {
  from_currency: string
  to_currency: string
  rate: number
}
```

#### Refresh All Rates
```
PUT /api/exchange-rates
Authorization: Required (Admin)
Description: Fetches latest rates from external API
```

#### Convert Currency
```
GET /api/exchange-rates/convert
Query Parameters:
  - from: string (required)
  - to: string (required)
  - amount: number (required)
Response: {
  from: string
  to: string
  amount: number
  convertedAmount: number
  rate: number
}
```

## KYC Management

#### Get User Documents
```
GET /api/kyc
Authorization: Required
Query Parameters:
  - status?: "pending" | "approved" | "rejected"
```

#### Submit KYC Document
```
POST /api/kyc
Authorization: Required
Body: {
  document_type: "passport" | "national_id" | "drivers_license" | "proof_of_address"
  document_url: string
}
```

#### Get Document by ID
```
GET /api/kyc/[id]
Authorization: Required
```

#### Approve/Reject Document
```
PUT /api/kyc/[id]
Authorization: Required (Admin)
Body: {
  status: "approved" | "rejected"
  rejection_reason?: string (required if rejected)
}
```

## Reserves Management

#### Get All Reserves
```
GET /api/reserves
Authorization: Required (Admin)
Response: {
  reserves: Reserve[]
  totalValue: {
    gold: number
    usd: number
    eur: number
  }
}
```

#### Add Reserve
```
POST /api/reserves
Authorization: Required (Admin)
Body: {
  asset_type: "gold" | "usd" | "eur"
  amount: number
  custody_provider?: string
  location?: string
  reason?: string
}
```

#### Get Basket Composition
```
GET /api/reserves/basket
Query Parameters:
  - history?: boolean (get historical compositions)
```

#### Update Basket Composition
```
POST /api/reserves/basket
Authorization: Required (Admin)
Body: {
  gold_weight: number (0-100)
  usd_weight: number (0-100)
  eur_weight: number (0-100)
  reason?: string
}
Note: Weights must sum to 100
```

#### Get Reserve Transactions
```
GET /api/reserves/transactions
Authorization: Required (Admin)
```

## News Categories

#### List News Categories
```
GET /api/news-categories
```

#### Create News Category
```
POST /api/news-categories
Authorization: Required (Admin)
Body: {
  name: string
  description?: string
}
```

#### Get Category by ID
```
GET /api/news-categories/[id]
```

#### Update Category
```
PUT /api/news-categories/[id]
Authorization: Required (Admin)
```

#### Delete Category
```
DELETE /api/news-categories/[id]
Authorization: Required (Admin)
```

## Users

#### List Users
```
GET /api/users
Authorization: Required (Admin)
```

#### Get User by ID
```
GET /api/users/[id]
Authorization: Required
```

#### Update User
```
PUT /api/users/[id]
Authorization: Required
```

## Transactions

#### List Transactions
```
GET /api/transactions
Authorization: Required
Query Parameters:
  - status?: "pending" | "completed" | "failed"
  - limit?: number
  - offset?: number
```

#### Get Transaction by ID
```
GET /api/transactions/[id]
Authorization: Required
```

## Wallets

#### List Wallets
```
GET /api/wallets
Authorization: Required
```

#### Create Wallet
```
POST /api/wallet/create
Authorization: Required
```

#### Get Wallet by ID
```
GET /api/wallets/[id]
Authorization: Required
```

## Countries

#### List Countries
```
GET /api/countries
```

## Currencies

#### List Currencies
```
GET /api/currencies
```

## News

#### List News
```
GET /api/news
Query Parameters:
  - category_id?: string
  - limit?: number
```

## Economic Indicators

#### List Economic Indicators
```
GET /api/economic-indicators
Query Parameters:
  - country_id?: string
```

## Cron Jobs

#### Update Exchange Rates
```
POST /api/cron/update-rates
Authorization: Cron Secret
Headers:
  Authorization: Bearer [CRON_SECRET]
```

#### Update Gold Price
```
POST /api/cron/update-gold-price
Authorization: Cron Secret
Headers:
  Authorization: Bearer [CRON_SECRET]
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limits
- Default: 100 requests per minute per IP
- Admin endpoints: 200 requests per minute
- Cron endpoints: No limit (with valid secret)

## Pagination

Endpoints supporting pagination accept:
```
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 20, max: 100)
```

Response includes:
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasMore": true
  }
}
```
