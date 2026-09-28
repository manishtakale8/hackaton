# OpportunityHub

> **A student opportunity discovery platform built for hackathons and real-world use.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Project Overview

**OpportunityHub** is a full-stack web application that helps students discover, track, and apply for relevant opportunities including internships, hackathons, competitions, scholarships, courses, certifications, and workshops — all in one place.

---

## 🚩 Problem Statement

Students miss valuable opportunities because:
- Information is scattered across dozens of websites and platforms
- No personalization — everyone sees the same generic list
- Deadlines are hard to track across multiple sources
- No way to filter by skills or interests

---

## ✅ Solution

OpportunityHub provides:
- **Centralized opportunity discovery** across 7 categories
- **Personalized match scores** (rule-based, transparent, not ML)
- **Smart search and filters** (category, mode, location, skills)
- **Deadline tracking** from bookmarked opportunities
- **Student profiles** with skills, interests, and preferred categories

---

## ✨ Features

| Feature | Description |
|---|---|
| Authentication | JWT-based register/login with bcrypt password hashing |
| Student Profile | Education, skills, interests, preferred categories |
| Explore | Search + filter by category, mode, location, skills |
| Match Score | Transparent rule-based 0–100 score per opportunity |
| Bookmarks | Save and manage favorite opportunities |
| Deadlines | Track upcoming deadlines from bookmarked opportunities |
| Dashboard | Stats, recommendations, and deadlines in one view |
| Admin Panel | Full CRUD for opportunities, real stats |
| Responsive | Works on mobile and desktop |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS** (v3)
- **React Router DOM** v6
- **Axios**
- **React Icons**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** (jsonwebtoken)
- **bcryptjs**
- **Helmet**, **CORS**, **express-rate-limit**, **Morgan**

### Database
- **MongoDB Atlas** (cloud)

### Deployment
- **Google Cloud Run** (backend)
- **Firebase Hosting / Vercel** (frontend)

---

## 🏗️ Architecture

```
Client (React/Vite)
    ↕ HTTP/REST API
Server (Express.js)
    ↕ Mongoose ODM
MongoDB Atlas
```

---

## 📁 Folder Structure

```
OpportunityHub/
├── client/               # React frontend
│   ├── src/
│   │   ├── api/          # Axios API calls
│   │   ├── components/   # Reusable components
│   │   ├── context/      # AuthContext
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Route pages
│   │   ├── routes/       # Route guards
│   │   └── utils/        # Helpers & constants
│   └── public/
├── server/               # Node.js backend
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Route handlers
│   ├── middleware/        # Auth, error, rate limit
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routers
│   ├── scripts/          # Seed scripts
│   ├── services/         # Recommendation logic
│   └── utils/            # Token & match utilities
├── docker/               # Dockerfiles
└── README.md
```

---

## 🗄️ Database Models

### User
```
name, email, password (hashed), role (student|admin)
```

### StudentProfile
```
user (ref), fullName, college, degree, branch, currentYear,
graduationYear, location, skills[], interests[], preferredCategories[]
```

### Opportunity
```
title, organization, description, category, skills[], interests[],
eligibility, location, mode, deadline, applicationUrl,
isActive, isSampleData, createdBy
```

### Bookmark
```
user (ref), opportunity (ref)
Unique index: { user, opportunity }
```

---

## 🎯 Recommendation Algorithm

**Transparent rule-based system (no ML)**

| Component | Weight |
|---|---|
| Skills Match | 40% |
| Interests Match | 30% |
| Category Match | 20% |
| Eligibility | 10% |

Score range: 0–100. Each match reason is shown to the user.

Example output:
```
87% Match
✓ 3 matching skills
✓ Interest matched
✓ Preferred category matched
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/opportunityhub.git
cd opportunityhub
```

### 2. Backend setup
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run seed:admin   # Create admin user
npm run seed         # Clean sample data (or: npm run seed -- --demo for dev fixtures)
npm run dev          # Start development server
```

### 3. Frontend setup
```bash
cd client
cp .env.example .env
# Edit .env with your API URL
npm install
npm run dev          # Start Vite dev server
```

### 4. Access the app
- Frontend: http://localhost:5173
- Backend:  http://localhost:5000
- Health:   http://localhost:5000/health

---

## 🔐 Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/opportunityhub
JWT_SECRET=your_super_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Private | Current user |
| GET | `/api/profile` | Private | Get profile |
| PUT | `/api/profile` | Private | Update profile |
| GET | `/api/opportunities` | Optional | List opportunities |
| GET | `/api/opportunities/:id` | Optional | Get opportunity |
| POST | `/api/opportunities` | Admin | Create opportunity |
| PUT | `/api/opportunities/:id` | Admin | Update opportunity |
| DELETE | `/api/opportunities/:id` | Admin | Delete opportunity |
| GET | `/api/recommendations` | Private | Personalized recs |
| GET | `/api/bookmarks` | Private | Get bookmarks |
| POST | `/api/bookmarks/:id` | Private | Add bookmark |
| DELETE | `/api/bookmarks/:id` | Private | Remove bookmark |
| GET | `/api/admin/stats` | Admin | Platform stats |

---

## 🚀 Deployment: Google Cloud Run

### Backend
```bash
# Build and push Docker image
cd server
gcloud builds submit --tag gcr.io/PROJECT_ID/opportunityhub-server

# Deploy to Cloud Run
gcloud run deploy opportunityhub-server \
  --image gcr.io/PROJECT_ID/opportunityhub-server \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=...,JWT_SECRET=...,CLIENT_URL=...
```

The server listens on `0.0.0.0:PORT` (Cloud Run injects PORT automatically).

---

## 📊 Data Policy

> **OpportunityHub operates with real, verified opportunity data.**
>
> We strictly do NOT use:
> - Fake opportunities, fabricated organizations, or unverified deadlines
> - Fake testimonials, fake reviews, or artificial user success stories
> - AI-generated photos or mock user profiles
> - Fabricated platform statistics
>
> All opportunities can be added, updated, or removed genuinely through the Admin panel. If explicitly enabled during local development, test entries are clearly labeled with the `DEMO DATA` badge.

---

## 🔮 Future Scope

- Email notifications for upcoming deadlines
- OAuth (Google/GitHub login)
- Opportunity scraping from verified sources
- Collaboration features (team formation for hackathons)
- Mobile app (React Native)
- Advanced ML-based recommendations

---

## 👤 Admin Access

Default admin created by seed script:
```
Email:    admin@opportunityhub.dev
Password: Admin@123456
⚠️ Change this in production!
```

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

*Built with ❤️ for students, by students.*
