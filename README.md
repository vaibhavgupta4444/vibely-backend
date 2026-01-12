# Vibely - Backend

## About

Vibely is a WhatsApp-like messaging application that enables real-time communication between users. This is the backend service that handles user authentication, message routing, and database management.

## Project Description

Vibely provides a complete messaging platform with features including:
- User authentication and authorization
- Real-time messaging capabilities
- User profile management
- Password management and recovery
- Email notifications
- JWT-based token authentication

## Folder Structure

```
backend/
├── src/
│   ├── app.ts                 # Main application setup
│   ├── config/
│   │   └── database-connection.ts    # MongoDB connection configuration
│   ├── controllers/           # Request handlers
│   │   └── user/
│   │       ├── generate-token.ts
│   │       ├── auth.ts
│   │       ├── password.ts
│   │       └── token.ts
│   ├── interfaces/            # TypeScript interfaces
│   │   ├── auth-request.ts
│   │   ├── base-interface.ts
│   │   └── user-interface.ts
│   ├── middlewares/           # Express middleware
│   │   └── auth.ts
│   ├── models/                # Database models
│   │   └── User.ts
│   ├── routes/                # API routes
│   │   └── user-route.ts
│   ├── utils/                 # Utility functions
│   │   ├── async-wrapper.ts
│   │   ├── https-error.ts
│   │   ├── send-mail.ts
│   │   └── templates/         # Email templates
│   │       ├── forgot-password.ejs
│   │       └── send-otp.ejs
│   └── validators/            # Input validation schemas
│       ├── password-schema.ts
│       ├── signin-schema.ts
│       └── signup-schema.ts
├── nodemon.json               # Nodemon configuration
├── package.json               # Project dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URL=mongodb://localhost:27017/vibely

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# JWT Configuration
JWT_SECRET=your-secret-key-here
```

### Environment Variable Details

- **PORT**: The port on which the server will run (default: 8000)
- **MONGODB_URL**: MongoDB connection string (local or remote)
- **EMAIL_USER**: Gmail address for sending emails
- **EMAIL_PASS**: Gmail app-specific password (not your regular password)
- **EMAIL_HOST**: SMTP server host for email service
- **EMAIL_PORT**: SMTP server port (587 for TLS)
- **JWT_SECRET**: Secret key for signing JWT tokens (use a strong, random string)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vibely/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory and add your environment variables (see above)

4. Ensure MongoDB is running on your machine or update the `MONGODB_URL` to your MongoDB server

## How to Start

### Development Mode (with auto-reload)

```bash
npm run dev
```

This command uses Nodemon to automatically restart the server when files change.

### Production Mode

```bash
npm start
```

### Build

```bash
npm run build
```

## API Endpoints

The backend provides the following main endpoints:

- **Authentication**: User login and registration
- **User Management**: Profile updates and management
- **Password Reset**: Password recovery via email
- **Messaging**: Real-time messaging features

For detailed API documentation, refer to the route files in `src/routes/`

## Requirements

- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn

## Support

For issues or questions, please create an issue in the repository.