# DevHelp API - Postman Collection

This repository contains a comprehensive Postman collection for testing the DevHelp Doubt Tracker Application API.

## 📁 Files Included

- `DevHelp_API_Collection.postman_collection.json` - Complete API collection with all endpoints
- `DevHelp_Environment.postman_environment.json` - Environment variables for different setups
- `API_Documentation.md` - This documentation file

## 🚀 Quick Setup

### 1. Import Collection and Environment

1. **Open Postman**
2. **Import Collection:**
   - Click "Import" button
   - Select `DevHelp_API_Collection.postman_collection.json`
   - Click "Import"

3. **Import Environment:**
   - Click "Import" button
   - Select `DevHelp_Environment.postman_environment.json`
   - Click "Import"

4. **Select Environment:**
   - In the top-right corner, select "DevHelp - Doubt Tracker Environment"

### 2. Start Your Server

Make sure your DevHelp API server is running:
```bash
cd server
npm start
```

The server should be running on `http://localhost:3000`

## 📋 API Endpoints Overview

### 🔐 Authentication
- **POST** `/api/auth/register` - Register new user (student/mentor)
- **POST** `/api/auth/login` - Login user

### 📝 Doubts Management
- **POST** `/api/doubts` - Create new doubt (Student only)
- **GET** `/api/doubts/my` - Get user's doubts (Student only)
- **GET** `/api/doubts` - Get all doubts (Mentor only)
- **PATCH** `/api/doubts/:id` - Update doubt (Student only, own doubts)
- **DELETE** `/api/doubts/:id` - Delete doubt (Student only, own doubts)
- **PATCH** `/api/doubts/:id/resolve` - Mark doubt as resolved (Student only)
- **PATCH** `/api/doubts/:id/toggle-status` - Toggle doubt status (Student/Mentor)

### 💬 Comments Management
- **POST** `/api/comments/:doubtId` - Add comment or reply
- **GET** `/api/comments/:doubtId` - Get all comments for a doubt
- **PATCH** `/api/comments/:commentId` - Edit own comment
- **DELETE** `/api/comments/:commentId` - Delete own comment

## 🧪 Testing Workflow

### Step 1: Authentication Setup
1. **Register Student:**
   - Run "Register Student" request
   - Creates a student account with email: `student@example.com`

2. **Register Mentor:**
   - Run "Register Mentor" request
   - Creates a mentor account with email: `mentor@example.com`

3. **Login Student:**
   - Run "Login Student" request
   - Automatically saves student token to `student_token` variable
   - Sets `auth_token` to student token for subsequent requests

4. **Login Mentor:**
   - Run "Login Mentor" request
   - Automatically saves mentor token to `mentor_token` variable

### Step 2: Doubts Testing
1. **Create Doubt (as Student):**
   - Run "Create Doubt (Student)" request
   - Automatically saves doubt ID to `doubt_id` variable

2. **Get My Doubts (as Student):**
   - Run "Get My Doubts (Student)" request
   - Verifies student can see their own doubts

3. **Get All Doubts (as Mentor):**
   - Run "Get All Doubts (Mentor)" request
   - Verifies mentor can see all doubts

4. **Update Doubt (as Student):**
   - Run "Update Doubt (Student)" request
   - Tests doubt modification functionality

### Step 3: Comments Testing
1. **Add Comment (as Student):**
   - Run "Add Comment (Student)" request
   - Automatically saves comment ID to `comment_id` variable

2. **Add Reply (as Mentor):**
   - Run "Add Reply Comment (Mentor)" request
   - Tests nested commenting functionality

3. **Get Comments:**
   - Run "Get Comments for Doubt" request
   - Verifies comment retrieval with nesting

## 🔧 Environment Variables

| Variable | Description | Auto-Set |
|----------|-------------|----------|
| `base_url` | API base URL | Manual |
| `auth_token` | Current authentication token | Auto |
| `student_token` | Student authentication token | Auto |
| `mentor_token` | Mentor authentication token | Auto |
| `doubt_id` | Current doubt ID for testing | Auto |
| `comment_id` | Current comment ID for testing | Auto |

## 📊 Test Data

### Test Users
```json
// Student Account
{
  "name": "John Student",
  "email": "student@example.com",
  "password": "password123",
  "role": "student"
}

// Mentor Account
{
  "name": "Jane Mentor",
  "email": "mentor@example.com",
  "password": "password123",
  "role": "mentor"
}
```

### Sample Doubt
```json
{
  "title": "JavaScript Array Methods",
  "description": "I'm having trouble understanding the difference between map, filter, and reduce methods in JavaScript. Can someone explain with examples?",
  "subject": "JavaScript",
  "priority": "medium"
}
```

### Sample Comment
```json
{
  "text": "Thanks for the help! This is very useful."
}
```

## ✅ Automated Tests

Each request includes automated tests that verify:

### Authentication Tests
- Status codes (200, 201, 401, 403)
- Response structure validation
- Token presence and format
- User role verification

### Doubts Tests
- CRUD operations success
- Authorization (student vs mentor access)
- Data validation
- Status transitions

### Comments Tests
- Comment creation and nesting
- Author permissions
- Content validation
- Hierarchical structure

### Error Scenarios
- Invalid credentials
- Missing authentication
- Role-based access control
- Data validation errors

## 🏃‍♂️ Running All Tests

### Method 1: Collection Runner
1. Click on "DevHelp - Doubt Tracker App API" collection
2. Click "Run collection" 
3. Select all folders
4. Click "Run DevHelp - Doubt Tracker App API"

### Method 2: Individual Testing
1. Start with "Authentication" folder
2. Run each request in sequence
3. Move to "Doubts Management"
4. Then "Comments Management"
5. Finally "Error Scenarios"

## 🔍 Monitoring & Debugging

### Response Validation
- All requests include response time checks (< 2000ms)
- Content-Type validation
- Status code verification
- Data structure validation

### Console Logging
- Pre-request scripts log the request URL
- Test results are displayed in Test Results tab
- Variables are automatically updated and logged

### Error Handling
- Clear error messages for failed requests
- Detailed validation of error responses
- Proper HTTP status code testing

## 📝 Notes

### File Upload Testing
- The "Create Doubt with Screenshot" request includes a file upload field
- You'll need to manually select a file when testing file uploads
- The field is currently disabled by default

### Rate Limiting
- Some endpoints have rate limiting configured
- You may need to wait between requests if hitting limits

### Database State
- Tests are designed to be run in sequence
- Each test builds upon the previous one's data
- Variables are automatically managed between requests

### Environment Configuration
- Default configuration assumes server running on `localhost:3000`
- Modify `base_url` in environment for different setups
- All tokens are automatically managed

## 🛠️ Customization

### Adding New Endpoints
1. Add new request to appropriate folder
2. Include proper authentication headers
3. Add test scripts for validation
4. Update variables as needed

### Modifying Test Data
1. Update request bodies with new test data
2. Modify environment variables for different scenarios
3. Adjust test assertions accordingly

### Different Environments
1. Create new environment file
2. Update `base_url` for staging/production
3. Modify test data as needed

This collection provides comprehensive API testing coverage for the DevHelp Doubt Tracker Application! 🚀
