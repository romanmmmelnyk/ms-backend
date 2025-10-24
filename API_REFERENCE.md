# MS Backend API - Quick Reference

**Base URL**: `http://localhost:7300`  
**Swagger Docs**: `http://localhost:7300/api/docs`

## 📋 Sites (`/api/sites`)
- `GET /` - List sites (filters: status, domain, instance)
- `POST /` - Create site
- `GET /:id` - Get site
- `PUT /:id` - Update site
- `DELETE /:id` - Delete site
- `GET /:id/expand` - Get site + instance + domains + ports + hosting
- `POST /:id/actions/fetch-siteinfo` - Fetch site info

## 🖥️ Instances (`/api/instances`)
- `GET /` - List instances
- `POST /` - Create instance
- `GET /:id` - Get instance
- `PUT /:id` - Update instance (hosting, IP)
- `DELETE /:id` - Delete instance
- `POST /:id/ports` - Bind port to instance
- `DELETE /:id/ports/:portId` - Unbind port

## 🌐 Domains (`/api/domains`)
- `GET /` - List domains (filters: expiringInDays, provider)
- `POST /` - Create domain
- `GET /:id` - Get domain
- `PUT /:id` - Update domain (provider, paidUntil, priceYear, instanceId)
- `DELETE /:id` - Delete domain
- `POST /:id/actions/renew` - Renew domain 1 year

## 🔌 Ports (`/api/ports`)
- `GET /` - List ports
- `POST /` - Create port
- `GET /:id` - Get port
- `PUT /:id` - Update port
- `DELETE /:id` - Delete port

## 📂 Port Categories (`/api/port-categories`)
- `GET /` - List categories
- `POST /` - Create category
- `GET /:id` - Get category
- `PUT /:id` - Update category
- `DELETE /:id` - Delete category

## 🏢 Hostings (`/api/hostings`)
- `GET /` - List hosting providers
- `POST /` - Create hosting provider
- `GET /:id` - Get hosting provider
- `PUT /:id` - Update hosting (priceYear, paidAt, providerAccount)
- `DELETE /:id` - Delete hosting provider

## 📊 Enquiries (`/enquiries`) - Legacy
- `GET /` - List enquiries
- `POST /` - Create enquiry
- `GET /:id` - Get enquiry
- `DELETE /:id` - Delete enquiry

## 🔐 Authentication Scopes
- `sites:read|write`
- `instances:manage`
- `domains:billing|write`
- `ports:read|write`
- `port-categories:read|write`
- `hostings:read|write`

## 📝 Key Data Types
- **Domain names**: DNS regex validation
- **Port numbers**: 1-65535
- **Dates**: ISO8601 format
- **Prices**: Decimal >= 0
- **Analytics**: Encrypted config

## 🚀 Quick Start
1. Start: `npm run start:dev`
2. Docs: `http://localhost:7300/api/docs`
3. Create: Hosting → Instance → Site → Domain
