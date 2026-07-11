# 🍳 Smart CookingHub

A full-stack recipe sharing platform where users can create, discover, and interact with recipes. Built with Node.js, Express, MongoDB, and EJS.

## Live Demo

[https://webe2-finalproject.onrender.com](https://webe2-finalproject.onrender.com)

## Features

- User registration and authentication (Passport.js + bcrypt)
- Create, edit, and delete recipes with image upload
- Comment on and like recipes
- User profiles with profile picture
- Image cropping before upload (Cropper.js)
- Cloud image storage (Cloudinary)
- Responsive design
- Social sharing buttons

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templates, custom CSS
- **Authentication**: Passport.js, bcryptjs
- **Image Upload**: Multer, Cloudinary
- **Deployment**: Render (app), MongoDB Atlas (database)

## Project Structure

```
├── controllers/        # Request handling and application logic
│   ├── authController.js
│   ├── recipeController.js
│   ├── commentController.js
│   └── profileController.js
├── models/             # Database schemas
│   ├── User.js
│   ├── Recipe.js
│   └── Comment.js
├── routes/             # URL routing
│   ├── authRoutes.js
│   ├── recipeRoutes.js
│   └── profileRoutes.js
├── views/              # EJS templates
│   ├── partials/
│   ├── auth/
│   ├── recipes/
│   └── profile/
├── public/             # Static assets (CSS, images)
├── config/             # Passport and Multer configuration
├── middleware/         # Authentication middleware
└── app.js              # Main application entry point
```

## Installation & Running Locally

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed and running locally
- A Cloudinary account (free)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/aylinnyma/WebE2_FinalProject.git
cd WebE2_FinalProject
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root with the following variables:

PORT=3000
MONGO_URI=mongodb://localhost:27017/recipeapp
SESSION_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

4. Start MongoDB locally:
```bash
brew services start mongodb-community
```

5. Run the app:
```bash
node app.js
```

6. Visit `http://localhost:3000`

## Database Setup

The app uses MongoDB. No manual schema setup is needed, Mongoose creates collections automatically on first run.

For local development, MongoDB runs on `mongodb://localhost:27017/recipeapp`.

For production, the app connects to MongoDB Atlas via the `MONGO_URI` environment variable.

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the server runs on (default 3000) |
| `MONGO_URI` | MongoDB connection string |
| `SESSION_SECRET` | Secret key for session encryption |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

## Team

- Aylin Miranda Antunez
- Klaudia Angula
- Zenith(Man Cheung Liu) 
