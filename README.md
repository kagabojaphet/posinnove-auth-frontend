Auth Frontend
A robust React-based authentication system frontend that allows users to register, log in, and access a protected dashboard. This project is built using React, React Router, and Tailwind CSS and is designed to integrate seamlessly with a backend API for full-stack authentication.

Features
User Registration: A form for new users to sign up with their name, email, and password, including client-side validation.

User Login: A login form that authenticates users via email and password, receiving a JWT token upon successful login.

Protected Dashboard: A private route that is only accessible to authenticated users.

Logout Functionality: A button to clear all user data and authentication tokens.

Token Refresh: Includes a utility function (authFetch.js) that automatically handles the refresh of access tokens using HTTP-only refresh cookies.

Responsive Design: The UI is styled with Tailwind CSS, ensuring a clean and responsive layout on all devices.

Pages
Page

Description

Register.jsx

User registration form with validation and user feedback.

Login.jsx

User login form with validation and user feedback.

Dashboard.jsx

The protected page, accessible only after a user has logged in.

App.jsx

The main file that defines the application's routes and implements route protection using RequireAuth.

authFetch.js

A utility for making authenticated API requests that includes automatic token refresh logic.

General Instructions
Register Page
Please fill in the information below to create your account.

Create an account using a valid email address.

Use a strong password with at least 8 characters.

Click Register to submit your information.

Login Page
Please fill in the information below to log in to your account.

Log in using your registered email and password.

Your password is kept safe and secure.

Click Log In to access your dashboard.

Installation
To set up and run the project locally, follow these steps:

Clone the repository:

git clone [https://github.com/YOUR_USERNAME/auth-frontend.git](https://github.com/YOUR_USERNAME/auth-frontend.git)
cd auth-frontend

Install dependencies:

npm install

Create a .env file (optional, but recommended):

# Example: If your backend is running locally
VITE_API_URL=http://localhost:5000/api

Run the frontend:

npm run dev

Open your browser and navigate to http://localhost:5173.

Tech Stack
Frontend: React, React Router v6, Tailwind CSS

Authentication: JWT (access token), HTTP-only cookie (refresh token)

Utilities: authFetch.js for API calls

File Structure
auth-frontend/
├─ src/
│  ├─ pages/
│  │  ├─ Login.jsx
│  │  ├─ Register.jsx
│  │  └─ Dashboard.jsx
│  ├─ utils/
│  │  └─ authFetch.js
│  └─ App.jsx
├─ package.json
├─ tailwind.config.js
└─ vite.config.js

Contributing
We welcome contributions! To contribute to this project:

Fork the repository.

Create a new branch for your feature or bug fix.

Commit your changes with clear and descriptive messages.

Submit a pull request for review.

License
This project is licensed under the MIT License.
