# SOC Academy API Documentation

## Base URL
```
https://api.soc-academy.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Generate Token
```bash
curl -X POST https://api.soc-academy.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

---

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "username",
    "password": "password123",
    "fullName": "Full Name"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "token": "jwt_token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "fullName": "Full Name",
      "role": "student"
    }
  }
  ```

### Login User
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "token": "jwt_token",
    "user": { ... }
  }
  ```

### Get Current User
- **GET** `/auth/me`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "user": { ... }
  }
  ```

### Logout
- **POST** `/auth/logout`
- **Authentication**: Required
- **Response**: `200 OK`

### Refresh Token
- **POST** `/auth/refresh`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "token": "new_jwt_token"
  }
  ```

---

## Courses Endpoints

### Get All Courses
- **GET** `/courses`
- **Query Parameters**:
  - `difficulty`: `beginner|intermediate|advanced|expert`
  - `category`: `siem|threat-hunting|dfir|etc`
  - `limit`: Default 20
  - `offset`: Default 0
- **Response**: `200 OK`
  ```json
  {
    "courses": [
      {
        "id": "uuid",
        "title": "SIEM Fundamentals",
        "slug": "siem-fundamentals",
        "description": "Learn SIEM basics",
        "difficulty": "beginner",
        "category": "siem",
        "durationHours": 12,
        "rating": 4.8,
        "studentsCount": 150,
        "price": 29.99
      }
    ],
    "count": 42
  }
  ```

### Get Course by Slug
- **GET** `/courses/:slug`
- **Response**: `200 OK`
  ```json
  {
    "course": { ... }
  }
  ```

### Create Course (Admin/Instructor)
- **POST** `/courses`
- **Authentication**: Required (Admin/Instructor)
- **Body**:
  ```json
  {
    "title": "Course Title",
    "slug": "course-slug",
    "description": "Course description",
    "difficulty": "beginner",
    "category": "siem",
    "durationHours": 10,
    "price": 29.99
  }
  ```
- **Response**: `201 Created`

### Update Course (Admin/Instructor)
- **PUT** `/courses/:id`
- **Authentication**: Required
- **Body**: Course fields to update
- **Response**: `200 OK`

### Publish Course (Admin/Instructor)
- **POST** `/courses/:id/publish`
- **Authentication**: Required
- **Response**: `200 OK`

---

## Labs Endpoints

### Get All Labs
- **GET** `/labs`
- **Query Parameters**:
  - `difficulty`: `beginner|intermediate|advanced|expert`
  - `category`: String
  - `limit`: Default 20
  - `offset`: Default 0
- **Response**: `200 OK`
  ```json
  {
    "labs": [
      {
        "id": "uuid",
        "title": "SSH Brute Force Investigation",
        "slug": "ssh-brute-force",
        "difficulty": "beginner",
        "estimatedTimeMinutes": 45,
        "category": "log-analysis",
        "tags": ["ssh", "linux", "security"]
      }
    ],
    "count": 25
  }
  ```

### Get Lab by Slug
- **GET** `/labs/:slug`
- **Response**: `200 OK`

### Submit Lab Solution
- **POST** `/labs/:labId/submit`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "findings": "Description of findings",
    "report": "Detailed investigation report"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "Lab submission received",
    "submission": { ... }
  }
  ```

### Get Lab Submissions
- **GET** `/labs/:labId/submissions`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "submissions": [ ... ]
  }
  ```

---

## User Endpoints (Authenticated)

### Get User Profile
- **GET** `/users/profile`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "username",
      "fullName": "Full Name",
      "bio": "Bio text",
      "avatarUrl": "https://...",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
  ```

### Update User Profile
- **PUT** `/users/profile`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "fullName": "New Name",
    "bio": "New bio",
    "avatarUrl": "https://..."
  }
  ```
- **Response**: `200 OK`

---

## Progress Endpoints (Authenticated)

### Get All Progress
- **GET** `/progress`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "progress": [ ... ]
  }
  ```

### Get Course Progress
- **GET** `/progress/course/:courseId`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "progress": { ... }
  }
  ```

### Update Progress
- **POST** `/progress/update`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "courseId": "uuid",
    "lessonId": "uuid",
    "progressPercentage": 50,
    "status": "in_progress|completed|not_started"
  }
  ```
- **Response**: `200 OK`

---

## Certificates Endpoints (Authenticated)

### Get User Certificates
- **GET** `/certificates`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "certificates": [
      {
        "id": "uuid",
        "courseTitle": "Course Name",
        "issueDate": "2024-01-01",
        "certificateCode": "SOC-2024-001",
        "isValid": true
      }
    ]
  }
  ```

### Verify Certificate
- **GET** `/certificates/verify/:certificateCode`
- **Response**: `200 OK`
  ```json
  {
    "certificate": {
      "userName": "Full Name",
      "courseTitle": "Course Name",
      "issueDate": "2024-01-01",
      "isValid": true
    }
  }
  ```

---

## Dashboard Endpoints (Authenticated)

### Get Dashboard Data
- **GET** `/dashboard`
- **Authentication**: Required
- **Response**: `200 OK`
  ```json
  {
    "dashboard": {
      "stats": {
        "coursesEnrolled": 5,
        "avgProgress": 65,
        "completedCourses": 2
      },
      "courses": [ ... ],
      "recentActivity": [ ... ]
    }
  }
  ```

---

## Admin Endpoints

### Get All Users (Admin)
- **GET** `/admin/users`
- **Authentication**: Required (Admin only)
- **Query Parameters**:
  - `limit`: Default 50
  - `offset`: Default 0
- **Response**: `200 OK`
  ```json
  {
    "users": [ ... ]
  }
  ```

### Get Analytics (Admin)
- **GET** `/admin/analytics`
- **Authentication**: Required (Admin only)
- **Response**: `200 OK`
  ```json
  {
    "analytics": {
      "totalUsers": 1000,
      "totalCourses": 50,
      "totalEnrollments": 5000,
      "activeUsers": 250
    }
  }
  ```

### Suspend User (Admin)
- **POST** `/admin/users/:userId/suspend`
- **Authentication**: Required (Admin only)
- **Response**: `200 OK`

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

---

## Rate Limiting

- API calls are rate limited to 100 requests per 15 minutes
- Rate limit headers:
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Webhooks

### Lab Submission Webhook
Fired when a lab solution is submitted:
```json
{
  "event": "lab.submitted",
  "data": {
    "userId": "uuid",
    "labId": "uuid",
    "submissionId": "uuid",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Course Completed Webhook
Fired when a course is completed:
```json
{
  "event": "course.completed",
  "data": {
    "userId": "uuid",
    "courseId": "uuid",
    "completedAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## SDK & Libraries

- **JavaScript/TypeScript**: `npm install soc-academy-sdk`
- **Python**: `pip install soc-academy-sdk`
- **Go**: `go get github.com/soc-academy/sdk`

---

## Support

- **Documentation**: https://docs.soc-academy.com
- **Issues**: https://github.com/soc-academy/api/issues
- **Email**: api-support@soc-academy.com
