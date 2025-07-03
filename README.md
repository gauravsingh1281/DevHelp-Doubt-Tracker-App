# 🚀 DevHelp - Doubt Tracker App

A comprehensive platform connecting students with expert mentors to solve coding doubts through an interactive Q&A system.

![DevHelp Banner](./client/src/assets/images/hero1.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

DevHelp is a modern doubt-tracking application designed to bridge the gap between students struggling with coding problems and experienced mentors ready to help. The platform provides a seamless experience for posting doubts, receiving expert guidance, and building a community of learners.

### Key Highlights

- **Role-based Access**: Separate dashboards for students and mentors
- **Real-time Interaction**: Live commenting system with nested replies
- **File Upload Support**: Share code screenshots and files using ImageKit
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Secure Authentication**: JWT-based authentication with role management
- **Modern UI/UX**: Built with Tailwind CSS and React Icons

## ✨ Features

### 🎓 For Students

- **Create Doubts**: Post coding questions with detailed descriptions
- **File Attachments**: Upload screenshots of code
- **Real-time Tracking**: Monitor doubt status and responses
- **Interactive Comments**: Engage with mentors through threaded discussions
- **Profile Management**: Update personal information and preferences

### 👨‍🏫 For Mentors

- **Browse Doubts**: View and filter student queries
- **Provide Solutions**: Respond with detailed explanations and code examples
- **Comment System**: Engage in discussions with multiple students
- **Progress Tracking**: Monitor resolved vs pending doubts

### 🔐 Authentication & Security

- **Secure Registration**: Email validation and password hashing
- **JWT Authentication**: Token-based session management
- **Role-based Authorization**: Protected routes for students and mentors
- **Auto-logout**: Session timeout and security measures
- **Safe Toast System**: Prevents notifications after logout

### 🎨 User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Loading States**: Branded suspense loaders and mini-loaders
- **Error Boundaries**: Graceful error handling with fallback UI
- **Toast Notifications**: Real-time feedback for user actions
- **Modern Navigation**: Intuitive menu system with mobile overlay

## 🛠 Tech Stack

### Frontend

- **React 19.1.0** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **React Router Dom 7.6.3** - Client-side routing
- **Axios 1.10.0** - HTTP client for API calls
- **React Icons 5.5.0** - Comprehensive icon library
- **React Toastify 11.0.5** - Toast notification system

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Web application framework
- **MongoDB with Mongoose 8.16.1** - NoSQL database and ODM
- **JWT (jsonwebtoken 9.0.2)** - Authentication tokens
- **bcryptjs 3.0.2** - Password hashing
- **ImageKit 6.0.0** - Image upload and management
- **Express Rate Limit 7.5.1** - Rate limiting middleware
- **Express Validator 7.2.1** - Input validation
- **Multer 2.0.1** - File upload handling
- **CORS 2.8.5** - Cross-origin resource sharing
- **dotenv 17.0.0** - Environment variable management

### Development Tools

- **ESLint** - Code linting and formatting
- **Postman** - API testing and documentation

## 🚀 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)
- ImageKit account (for file uploads)

### Clone Repository

```bash
git clone https://github.com/gauravsingh1281/DevHelp-Doubt-Tracker-App.git
```

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

## ⚙️ Environment Setup

### Backend Environment (.env)

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/devhelp
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devhelp

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

### Frontend Environment (.env)

Create a `.env` file in the `client` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api

```

## 🎯 Usage

### Development Mode

1. **Start Backend Server**:

```bash
cd server
npm start
```

Server will run on `http://localhost:3000`

2. **Start Frontend Development Server**:

```bash
cd client
npm run dev
```

Client will run on `http://localhost:5173`

### Production Build

```bash
cd client
npm run build
npm run preview
```

### API Testing

Import the provided Postman collection:

- `DevHelp_API_Collection.postman_collection.json`
- `DevHelp_Environment.postman_environment.json`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | User login        |
| GET    | `/api/auth/me`       | Get current user  |

### Doubt Management

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | `/api/doubts`             | Create new doubt              |
| GET    | `/api/doubts`             | Get all doubts (with filters) |
| GET    | `/api/doubts/:id`         | Get doubt by ID               |
| PATCH  | `/api/doubts/:id`         | Update doubt                  |
| DELETE | `/api/doubts/:id`         | Delete doubt                  |
| POST   | `/api/doubts/:id/resolve` | Mark doubt as resolved        |

### Comment System

| Method | Endpoint                 | Description                |
| ------ | ------------------------ | -------------------------- |
| POST   | `/api/comments/:doubtId` | Add comment to doubt       |
| GET    | `/api/comments/:doubtId` | Get all comments for doubt |
| PATCH  | `/api/comments/:id`      | Edit comment               |
| DELETE | `/api/comments/:id`      | Delete comment             |

### File Upload

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| POST   | `/api/upload` | Upload file to ImageKit |

## 📁 Project Structure

```
devhelp-doubt-tracker/
│
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/            # Images, icons, fonts
│   │   ├── components/        # Reusable React components
│   │   │   ├── DashboardHeader.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── MentorComments.jsx
│   │   │   ├── SuspenseLoader.jsx
│   │   │   ├── MiniLoader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── context/           # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useInfiniteScroll.js
│   │   │   └── usePagination.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── MentorDashboard.jsx
│   │   │   └── CreateDoubt.jsx
│   │   ├── routes/            # Routing configuration
│   │   │   ├── AppRoutes.jsx
│   │   │   └── RoleProtectedRoute.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── lazyUtils.js
│   │   │   └── safeToast.js
│   │   ├── api/               # API configuration
│   │   │   └── apiInstance.js
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Node.js application
│   ├── config/                # Configuration files
│   │   └── db.js              # Database connection
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── doubtController.js
│   │   └── commentController.js
│   ├── middlewares/           # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── rateLimiters.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Doubt.js
│   │   └── Comment.js
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── doubtRoutes.js
│   │   └── commentRoutes.js
│   ├── utils/                 # Utility functions
│   ├── server.js              # Main server file
│   └── package.json
│
├── DevHelp_API_Collection.postman_collection.json
├── DevHelp_Environment.postman_environment.json
└── README.md
```

## 🎨 Design Features

### Color Scheme

- **Primary**: `#F7418D` (Pink)
- **Secondary**: Various shades of gray and blue
- **Success**: Green tones
- **Error**: Red tones
- **Warning**: Yellow/Orange tones

### Typography

- **Headings**: Cormorant Garamond (serif)
- **Body**: Open Sans (sans-serif)

### Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🧪 Testing

### Manual Testing

- Use the provided Postman collection for API testing
- Test responsive design across different devices
- Verify authentication flows and role-based access

### Automated Testing

```bash
# Run ESLint
cd client
npm run lint

cd server
npm run lint
```

## 🔧 Development Features

### Performance Optimizations

- **Lazy Loading**: Code splitting for major components
- **Infinite Scroll**: Efficient data loading
- **Image Optimization**: ImageKit integration
- **Caching**: API response caching

### Developer Experience

- **Hot Reload**: Fast development with Vite
- **Error Boundaries**: Graceful error handling
- **ESLint**: Code quality assurance
- **Modular Architecture**: Easy to maintain and extend

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Railway/Render/Heroku)

```bash
cd server
# Set environment variables on your platform
# Deploy with your chosen platform
```

### Environment Variables for Production

- Update API URLs to production endpoints
- Use secure JWT secrets
- Configure production database
- Set up production ImageKit environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Author

**Gaurav Pratap Singh**

- GitHub: [@gauravsingh1281](https://github.com/gauravsingh1281)
- Email: gaurav@rentalog.in

**Made with ❤️ by the DevHelp Team**
