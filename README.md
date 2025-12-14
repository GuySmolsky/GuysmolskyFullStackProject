# JobBoard - Full Stack Job Portal Application

A modern job board platform built with React, Node.js, Express, and MongoDB that connects job seekers with employers.

## Features

- 🔐 **Role-based Authentication** (Job Seeker, Employer, Admin)
- 💼 **Job Management** - Post, edit, delete, and apply for jobs
- 🏢 **Company Profiles** - Showcase companies and their open positions
- 🌓 **Dark/Light Mode** - Toggle between themes
- ⏰ **Auto-logout** - Secure 4-hour session timeout
- 📱 **Responsive Design** - Works on all devices

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd guysmolskyfullstackproject
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
MONGODB_URI=mongodb://localhost:27017/Fullstack_Final_Project
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
PORT=5000
ADMIN_EMAIL=admin@jobboard.com
ADMIN_PASSWORD=Admin@1234
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Seed the Database (Optional)

Create initial data by running these scripts from the backend folder:

```bash
# Create admin account
node scripts/createAdmin.js

# Create mock users (job seeker & employer)
node scripts/seedMockUsers.js

# Create sample job listings
node scripts/seedMockJobs.js
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## Default Login Credentials

After running the seed scripts, you can login with:

**Admin:**

- Email: admin@jobboard.com
- Password: Admin@1234

**Employer:**

- Email: sarah.smith@innovatetech.com
- Password: Employer@12345

**Job Seeker:**

- Email: johndoe@example.com
- Password: JobSeeker@1234

## Project Structure

```
jobboard/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # Auth & Theme contexts
│   │   ├── services/       # API services
│   │   └── hooks/          # Custom hooks
│   └── package.json
│
└── backend/
    ├── controllers/        # Route controllers
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Auth & error middleware
    ├── scripts/           # Database seed scripts
    ├── server.js          # Express server
    └── package.json
```

## About JobBoard

JobBoard is a comprehensive job portal that bridges the gap between talented professionals and companies looking for their next team members.

**For Job Seekers:** Browse thousands of opportunities, save interesting positions, and apply with customized cover letters.

**For Employers:** Post job listings, manage applications, and build your company profile to attract top talent.

**For Admins:** Complete dashboard to manage users, jobs, and platform statistics.

Built with modern technologies and best practices, JobBoard offers a seamless experience with features like real-time updates, secure authentication, and an intuitive user interface that adapts to your preferences.

## Technologies Used

- **Frontend:** React, Material-UI, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT tokens
- **Styling:** Material-UI with custom theming

## License

MIT

---

Happy job hunting! 🚀
