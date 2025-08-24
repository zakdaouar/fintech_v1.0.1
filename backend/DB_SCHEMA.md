# Database Schema

## Tables
- **User**: id (PK), email (unique), password, name, createdAt, updatedAt
- **Customer**: id (PK), bridgeId (unique), userId (FK→User), fullName, email, status, timestamps
- **VirtualAccount**: id (PK), bridgeId (unique), customerId (FK→Customer), currency, bankAccountNumber, bankRoutingNumber, bankName, status, timestamps
- **Transfer**: id (PK), bridgeId (unique), customerId (FK→Customer), amount, currency, status, timestamps

## Relations
- User 1—∞ Customer
- Customer 1—∞ VirtualAccount
- Customer 1—∞ Transfer

Notes:
- All Bridge objects are mapped by their `bridgeId` (unique).
- Webhooks update `Transfer`/`VirtualAccount`/`Customer` using `bridgeId`.
