# RoomLelo - Student Room Rental Platform

A platform for students to find and rent rooms, and for owners to list their properties.

## Features

- User registration and authentication
- Room listing and searching
- Room details and booking
- User profiles (students and owners)
- Image upload for rooms
- Location-based search

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MongoDB
- Authentication: JWT

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/roomlelo
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. Start MongoDB server

5. Run the application:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:3000`

## API Endpoints

### Rooms
- GET `/api/rooms` - Get all rooms
- GET `/api/rooms/:id` - Get room by ID
- POST `/api/rooms` - Create new room

### Users
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - User login

## Project Structure

```
room-lelo/
├── public/
│   ├── main.html
│   ├── rooms.html
│   └── ...
├── server.js
├── package.json
├── .env
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 