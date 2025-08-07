# Skills++

## Event Booking System API Routes

The Skills++ Event Booking System provides RESTful API endpoints for user authentication, event management, and booking operations. Below is a table of all available routes:

| **Method** | **Endpoint**                  | **Description**                                                                 | **Authorization**         | **Request Body**                                                                 | **Response**                                                                 |
|------------|-------------------------------|---------------------------------------------------------------------------------|---------------------------|----------------------------------------------------------------------------------|------------------------------------------------------------------------------|
| POST       | `/api/auth/register`          | Register a new user or admin                                                    | None                      | `{ email: string, password: string, role?: "user" \| "admin" }`                   | `{ token: string, user: { _id: string, email: string, role: string } }`      |
| POST       | `/api/auth/login`             | Log in a user or admin                                                         | None                      | `{ email: string, password: string }`                                            | `{ token: string, user: { _id: string, email: string, role: string } }`      |
| POST       | `/api/auth/logout`            | Log out a user (client-side token invalidation)                                | Bearer Token (User/Admin) | None                                                                             | `{ message: "Logged out successfully" }`                                     |
| GET        | `/api/events`                 | Retrieve all events                                                            | None                      | None                                                                             | `[{ _id: string, name: string, date: string, location: string, capacity: number }]` |
| POST       | `/api/events`                 | Create a new event                                                             | Bearer Token (Admin)      | `{ name: string, date: string, location: string, capacity: number }`             | `{ _id: string, name: string, date: string, location: string, capacity: number }` |
| PUT        | `/api/events/:id`             | Update an existing event                                                       | Bearer Token (Admin)      | `{ name?: string, date?: string, location?: string, capacity?: number }`         | `{ _id: string, name: string, date: string, location: string, capacity: number }` |
| DELETE     | `/api/events/:id`             | Delete an event                                                                | Bearer Token (Admin)      | None                                                                             | `{ message: "Event deleted" }`                                               |
| POST       | `/api/bookings`               | Book an event for a user                                                       | Bearer Token (User/Admin) | `{ eventId: string }`                                                            | `{ _id: string, user: string, event: string }`                               |
| GET        | `/api/bookings/my-bookings`   | Retrieve all bookings for the authenticated user                               | Bearer Token (User/Admin) | None                                                                             | `[{ _id: string, user: string, event: { _id: string, name: string, ... } }]` |
| DELETE     | `/api/bookings/:id`           | Cancel a booking                                                               | Bearer Token (User/Admin) | None                                                                             | `{ message: "Booking cancelled" }`                                           |

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Usage with Postman](#usage-with-postman)
- [Response Formats](#response-formats)
- [Error Handling](#error-handling)
- [Dependencies](#dependencies)
- [License](#license)

## Overview
The **Skills++ Event Booking System** is a Node.js-based REST API built with Express and Mongoose, using MongoDB Atlas for data storage. It allows users to register, log in, browse, and book events, while admins can manage events. The system uses JWT for authentication and supports a specific database setup for testing, preserving existing data while populating and manipulating records as required.

## Features
- User and admin registration/login with JWT authentication.
- Event creation, updating, and deletion (admin-only).
- Event booking and cancellation for authenticated users.
- Database setup with 10 users, 5 admins, 20 events, and specific deletions (5 users, 2 admins, user 1, bookings, reviews) with one new user added.
- Data persistence for manual API testing.
- Runs on port 3000 by default.

## Getting Started

### Prerequisites
- **Node.js**: v14 or higher
- **MongoDB Atlas**: Account with `readWrite` permissions for the `eventBooking` database
- **Postman**: For testing API endpoints
- **Internet connection**: To connect to MongoDB Atlas

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-repo>/skills-.git
   cd skills-/week3
   ```

2. **Install Dependencies**:
   ```bash
   npm install express mongoose dotenv cors bcryptjs jsonwebtoken
   ```

5. **Project Structure**:
   ```
   week3/
   ├── config/
   │   └── db.js
   ├── middleware/
   │   └── auth.js
   ├── models/
   │   ├── User.js
   │   ├── Event.js
   │   └── Booking.js
   ├── routes/
   │   ├── auth.js
   │   ├── events.js
   │   └── bookings.js
   ├── .env
   ├── server.js
   └── package.json
   ```

### Start the Server
```bash
npm start
```
Server will run at `http://localhost:3000`.

## Usage with Postman
Use Postman to test the API endpoints. Below are example requests for key endpoints.

### 1. Register a New User
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "testuser@example.com",
    "password": "testpass123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "<USER_ID>",
      "email": "testuser@example.com",
      "role": "user"
    }
  }
  ```
- **Notes**: Save the `token` for authenticated requests.

### 2. Log in a User
- **Method**: POST
- **URL**: `http://localhost:3000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "user6@example.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "<USER_ID>",
      "email": "user6@example.com",
      "role": "user"
    }
  }
  ```
- **Notes**: Use the `token` for booking or logout requests.

### 3. Create an Event (Admin Only)
- **Method**: POST
- **URL**: `http://localhost:3000/api/events`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <ADMIN_TOKEN>`
- **Body** (raw JSON):
  ```json
  {
    "name": "New Event",
    "date": "2025-10-01T18:00:00Z",
    "location": "New Venue",
    "capacity": 50
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "_id": "<EVENT_ID>",
    "name": "New Event",
    "date": "2025-10-01T18:00:00Z",
    "location": "New Venue",
    "capacity": 50
  }
  ```
- **Notes**: Obtain `<ADMIN_TOKEN>` by logging in as an admin (e.g., `admin3@example.com`).

### 4. Book an Event
- **Method**: POST
- **URL**: `http://localhost:3000/api/bookings`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer <USER_TOKEN>`
- **Body** (raw JSON):
  ```json
  {
    "eventId": "<EVENT_ID>"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "_id": "<BOOKING_ID>",
    "user": "<USER_ID>",
    "event": "<EVENT_ID>"
  }
  ```
- **Notes**: Get `<EVENT_ID>` from `GET /api/events`.

### 5. Get All Events
- **Method**: GET
- **URL**: `http://localhost:3000/api/events`
- **Headers**: None
- **Response** (200 OK):
  ```json
  [
    {
      "_id": "<EVENT_ID>",
      "name": "Event 1",
      "date": "2025-09-01T18:00:00Z",
      "location": "Venue 1",
      "capacity": 100
    },
    // ... more events
  ]
  ```

### 6. Get User Bookings
- **Method**: GET
- **URL**: `http://localhost:3000/api/bookings/my-bookings`
- **Headers**: `Authorization: Bearer <USER_TOKEN>`
- **Response** (200 OK):
  ```json
  [
    {
      "_id": "<BOOKING_ID>",
      "user": "<USER_ID>",
      "event": {
        "_id": "<EVENT_ID>",
        "name": "Event 1",
        "date": "2025-09-01T18:00:00Z",
        "location": "Venue 1",
        "capacity": 100
      }
    },
    // ... more bookings
  ]
  ```

## Response Formats
### Authentication
- **Register/Login Success** (200/201):
  ```json
  {
    "token": "<JWT_TOKEN>",
    "user": {
      "_id": "<USER_ID>",
      "email": "<EMAIL>",
      "role": "user" | "admin"
    }
  }
  ```
- **Logout Success** (200):
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

### Events
- **Get All Events** (200):
  ```json
  [
    {
      "_id": "<EVENT_ID>",
      "name": "<EVENT_NAME>",
      "date": "<ISO_DATE>",
      "location": "<LOCATION>",
      "capacity": <NUMBER>
    }
  ]
  ```
- **Create/Update Event** (201/200):
  ```json
  {
    "_id": "<EVENT_ID>",
    "name": "<EVENT_NAME>",
    "date": "<ISO_DATE>",
    "location": "<LOCATION>",
    "capacity": <NUMBER>
  }
  ```
- **Delete Event** (200):
  ```json
  {
    "message": "Event deleted"
  }
  ```

### Bookings
- **Create Booking** (201):
  ```json
  {
    "_id": "<BOOKING_ID>",
    "user": "<USER_ID>",
    "event": "<EVENT_ID>"
  }
  ```
- **Get User Bookings** (200):
  ```json
  [
    {
      "_id": "<BOOKING_ID>",
      "user": "<USER_ID>",
      "event": {
        "_id": "<EVENT_ID>",
        "name": "<EVENT_NAME>",
        "date": "<ISO_DATE>",
        "location": "<LOCATION>",
        "capacity": <NUMBER>
      }
    }
  ]
  ```
- **Cancel Booking** (200):
  ```json
  {
    "message": "Booking cancelled"
  }
  ```

## Error Handling
| **Status Code** | **Description**                     | **Response Body**                              |
|------------------|-------------------------------------|------------------------------------------------|
| 400             | Bad request (e.g., missing fields)   | `{ "message": "All fields are required" }`     |
| 400             | User already exists                 | `{ "message": "User already exists" }`         |
| 401             | Invalid credentials                 | `{ "message": "Invalid credentials" }`         |
| 403             | Access denied (non-admin)           | `{ "message": "Access denied" }`               |
| 404             | Resource not found                  | `{ "message": "Event not found" }` or similar  |
| 400             | Already booked                      | `{ "message": "You have already booked this event" }` |
| 500             | Internal server error               | `{ "message": "Something went wrong!" }`       |

## Dependencies
- **express**: Web framework for Node.js
- **mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **cors**: Cross-origin resource sharing
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **jest**: Testing framework (for development)
- **supertest**: HTTP testing (for development)

## License
MIT License