# MS Backend - Enquiry Form API

A NestJS backend application for handling enquiry form submissions with PostgreSQL database using Prisma ORM.

## Features

- ✅ Full CRUD operations for enquiries
- ✅ Request validation using class-validator
- ✅ PostgreSQL database with Prisma ORM
- ✅ CORS enabled for frontend integration
- ✅ TypeScript support
- ✅ RESTful API design

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and configure your database connection:
```
DATABASE_URL="postgresql://username:password@localhost:5432/ms_backend?schema=public"
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Run database migrations:
```bash
npm run prisma:migrate
```

## Running the Application

### Development mode
```bash
npm run start:dev
```

### Production mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Create Enquiry
**POST** `/enquiries`

Create a new enquiry form submission.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "company": "Acme Inc.", // optional
  "projectType": "web-development", // required: web-development, mobile-app, ui-ux-design, consulting, other
  "budget": "25k-50k", // optional: under-10k, 10k-25k, 25k-50k, 50k-100k, over-100k
  "timeline": "3-6-months", // optional: asap, 1-3-months, 3-6-months, 6-12-months, flexible
  "message": "I need help building a web application...", // required, min 20 characters
  "newsletter": true // optional, defaults to false
}
```

**Response:**
```json
{
  "message": "Enquiry submitted successfully",
  "data": {
    "id": "clxxx123456",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "company": "Acme Inc.",
    "projectType": "web-development",
    "budget": "25k-50k",
    "timeline": "3-6-months",
    "message": "I need help building a web application...",
    "newsletter": true,
    "createdAt": "2025-10-19T12:00:00.000Z",
    "updatedAt": "2025-10-19T12:00:00.000Z"
  }
}
```

### Get All Enquiries
**GET** `/enquiries`

Retrieve all enquiries (ordered by creation date, newest first).

**Response:**
```json
{
  "data": [
    {
      "id": "clxxx123456",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      // ... other fields
    }
  ]
}
```

### Get Single Enquiry
**GET** `/enquiries/:id`

Retrieve a specific enquiry by ID.

**Response:**
```json
{
  "data": {
    "id": "clxxx123456",
    "firstName": "John",
    "lastName": "Doe",
    // ... other fields
  }
}
```

### Delete Enquiry
**DELETE** `/enquiries/:id`

Delete a specific enquiry by ID. Returns 204 No Content on success.

## Validation Rules

- **firstName**: Required, string
- **lastName**: Required, string
- **email**: Required, valid email format
- **company**: Optional, string
- **projectType**: Required, must be one of: `web-development`, `mobile-app`, `ui-ux-design`, `consulting`, `other`
- **budget**: Optional, must be one of: `under-10k`, `10k-25k`, `25k-50k`, `50k-100k`, `over-100k`
- **timeline**: Optional, must be one of: `asap`, `1-3-months`, `3-6-months`, `6-12-months`, `flexible`
- **message**: Required, minimum 20 characters
- **newsletter**: Optional, boolean (defaults to false)

## Frontend Integration

Update your frontend form submission to call the API:

```typescript
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await fetch('http://localhost:3000/enquiries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error('Failed to submit enquiry');
    }

    const data = await response.json();
    console.log('Enquiry submitted successfully:', data);
    
    // Show success message
    // Close modal and reset form
    emit('close');
    resetForm();
  } catch (error) {
    console.error('Error submitting form:', error);
    // Show error message to user
  } finally {
    isSubmitting.value = false;
  }
};
```

## Database Management

### View database in Prisma Studio
```bash
npm run prisma:studio
```

### Create a new migration
```bash
npm run prisma:migrate
```

### Reset database (caution: deletes all data)
```bash
npx prisma migrate reset
```

## Project Structure

```
src/
├── enquiries/
│   ├── dto/
│   │   ├── create-enquiry.dto.ts     # Validation DTO
│   │   └── enquiry-response.dto.ts   # Response DTO
│   ├── enquiries.controller.ts       # REST endpoints
│   ├── enquiries.service.ts          # Business logic
│   └── enquiries.module.ts           # Module definition
├── prisma/
│   ├── prisma.module.ts              # Prisma module
│   └── prisma.service.ts             # Prisma service
├── app.module.ts                     # Root module
└── main.ts                           # Application entry point
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200 OK**: Successful GET requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

Validation errors return detailed messages:
```json
{
  "statusCode": 400,
  "message": [
    "First name is required",
    "Please enter a valid email address",
    "Project description must be at least 20 characters"
  ],
  "error": "Bad Request"
}
```

## Technologies Used

- **NestJS**: Progressive Node.js framework
- **Prisma**: Next-generation ORM
- **PostgreSQL**: Relational database
- **TypeScript**: Type-safe JavaScript
- **class-validator**: Validation decorators
- **class-transformer**: Object transformation

## License

MIT

