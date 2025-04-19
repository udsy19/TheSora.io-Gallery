# TheSora.io Gallery

A modern, minimalist photography gallery web application built with React, Express, MongoDB, and Backblaze B2.

## Features

- **Admin Dashboard**: Manage users, collections, and images
- **User Gallery**: Beautiful, responsive gallery with lightbox functionality
- **Authentication**: Secure JWT-based authentication
- **Analytics**: Track user activity and image views/downloads
- **Storage**: Cloud storage using Backblaze B2 (S3-compatible)
- **Responsive Design**: Works on all devices with light/dark theme

## Project Structure

- `/client`: React frontend (Vite)
  - `/src/components`: Reusable UI components
  - `/src/context`: React context providers
  - `/src/pages`: Page components
  - `/src/utils`: Utility functions
  - `/src/styles`: Global styles and themes

- `/server`: Node.js/Express backend
  - `/src/models`: MongoDB schemas
  - `/src/controllers`: Request handlers
  - `/src/routes`: API routes
  - `/src/middleware`: Express middleware
  - `/src/utils`: Utility functions
  - `/src/config`: Configuration

## Tech Stack

- **Frontend**: React, Vite, Styled Components, Framer Motion, Recharts
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Storage**: Backblaze B2 (S3-compatible)
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Vercel (frontend), Vercel Serverless Functions (backend)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://your_mongo_uri
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   B2_APPLICATION_KEY_ID=your_b2_key_id
   B2_APPLICATION_KEY=your_b2_key
   B2_BUCKET_NAME=your_b2_bucket
   B2_ENDPOINT=your_b2_endpoint
   ```

4. Seed the database with an admin user:
   ```
   node server/src/utils/seedAdmin.js
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login`: User login
- `GET /api/auth/me`: Get current user
- `POST /api/auth/register`: Register new user (admin only)

### Users
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/:id`: Get user by ID
- `POST /api/users`: Create new user (admin only)
- `PUT /api/users/:id`: Update user
- `DELETE /api/users/:id`: Delete user

### Collections
- `GET /api/gallery/collections`: Get all collections
- `GET /api/gallery/collections/:id`: Get collection by ID
- `POST /api/gallery/collections`: Create new collection
- `PUT /api/gallery/collections/:id`: Update collection
- `DELETE /api/gallery/collections/:id`: Delete collection
- `PUT /api/gallery/collections/:id/access`: Update collection access

### Images
- `GET /api/gallery/collections/:id/images`: Get images in collection
- `GET /api/gallery/images/:id`: Get image by ID
- `POST /api/gallery/images`: Upload new image
- `DELETE /api/gallery/images/:id`: Delete image
- `GET /api/gallery/images/:id/download`: Get image download URL

### Analytics
- `GET /api/analytics/dashboard`: Get dashboard analytics
- `GET /api/analytics/logins`: Get login analytics
- `GET /api/analytics/downloads`: Get download analytics
- `GET /api/analytics/users/:id`: Get user analytics

## ToDo

- [ ] Complete image upload functionality with Backblaze B2
- [ ] Build bulk image management features
- [ ] Add email notifications for shared collections
- [ ] Implement watermarking options
- [ ] Create expiring links for collections
- [ ] Add client facing analytics
- [ ] Improve mobile responsiveness
- [ ] Implement batch operations for user management
- [ ] Add advanced sorting and filtering in galleries

## License

ISC © TheSora.io