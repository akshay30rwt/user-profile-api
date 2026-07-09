# User Profile API

A production-ready REST API for user authentication and profile
management built with Node.js, Express.js and MongoDB.

## Features
- User registration with email verification
- Secure login with JWT authentication
- Profile avatar upload stored on Cloudinary
- Forgot password with secure reset link via email
- Password reset with expiring tokens (1 hour)
- Sensitive fields excluded from all responses
- Global error handling with custom AppError class
- Request validation with Joi
- Production-level folder structure (src/)

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer
- Cloudinary
- Nodemailer
- Joi
- dotenv
- crypto (built-in)

## Folder Structure
```
user-profile-api/
├── src/
│   ├── config/
│   │   ├── db.js               - MongoDB connection
│   │   └── cloudinary.js       - Cloudinary configuration
│   ├── controllers/
│   │   └── authController.js   - All auth business logic
│   ├── middleware/
│   │   ├── authMiddleware.js   - JWT verification
│   │   ├── errorHandler.js     - Global error handler
│   │   ├── validate.js         - Joi validation middleware
│   │   └── upload.js           - Multer file upload config
│   ├── models/
│   │   └── User.js             - User schema and model
│   ├── routes/
│   │   └── authRoutes.js       - All auth routes
│   ├── utils/
│   │   ├── AppError.js         - Custom error class
│   │   ├── sendEmail.js        - Nodemailer email utility
│   │   └── generateToken.js    - Crypto token generator
│   ├── validators/
│   │   └── authValidator.js    - Joi validation schemas
│   └── app.js                  - Express app setup
├── .env                        - Environment variables
├── .gitignore
├── package.json
└── server.js                   - Entry point
```

## Environment Variables
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/userprofiledb
JWT_SECRET=jwt_secret
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_char_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

## Getting Started
1. Clone the repository
2. Run npm install
3. Create a .env file using the Environment Variables section above
4. Set up Gmail App Password for email sending
5. Create a free Cloudinary account for file uploads
6. Make sure MongoDB is running locally
7. Run npm run dev

## How to Run
npm install
npm run dev

## API Endpoints

### Auth Routes
POST   /auth/register
       Body: { name, email, password }
       Register a new user and send verification email

GET    /auth/verify-email/:token
       Verify email address via token from email link

POST   /auth/login
       Body: { email, password }
       Login and receive JWT token

POST   /auth/forgot-password
       Body: { email }
       Send password reset link to email

POST   /auth/reset-password/:token
       Body: { password }
       Reset password using token from email link

POST   /auth/upload-avatar     (protected)
       Body: form-data { avatar: <image file> }
       Upload profile avatar to Cloudinary
       Max size: 2MB, Images only

GET    /auth/profile           (protected)
       Get current user profile
       Excludes: password, tokens

## Authentication
Protected routes require JWT token in header:
Authorization: Bearer <token>

## Validation Rules
Register:
- name: string, min 2, max 50 characters
- email: valid email format
- password: minimum 6 characters

Login:
- email: valid email format
- password: required

Reset Password:
- password: minimum 6 characters

## Security Features
- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens expire after 1 day
- Password reset tokens expire after 1 hour
- Cryptographically secure tokens via crypto.randomBytes()
- Sensitive fields never returned in responses
- File type and size validation on uploads
- Email must be verified before login is allowed

## Notes
- Gmail App Password required for email sending
- Cloudinary free tier: 25GB storage, 25GB bandwidth/month
- Avatar upload requires Postman or similar tool
  (Thunder Client free version doesn't support file uploads)