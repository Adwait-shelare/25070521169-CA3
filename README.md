# Wanderly – Explore the World 🌍✈️
> **A Full-Stack Luxury Tour & Travel Booking Web Application**  
> *Developed with React.js, Vite, Node.js, Express.js, MongoDB, Mongoose & Tailwind CSS.*

---

## 📌 1. Project Overview

**Wanderly – Explore the World** is a production-grade, full-stack travel booking web application built for college project demonstration and evaluation. Designed with a luxury travel aesthetic (Navy Blue `#0B132B`, Turquoise `#06B6D4`, White, and Warm Gold `#F59E0B`), the application features:

- **Connected MongoDB Database**: Real local database storage using Mongoose schemas (no static mock JSON or localStorage substitute).
- **14+ Curated Tour Expeditions**: Realistic packages across Goa, Kashmir, Manali, Kerala, Ladakh, Bali, Andaman, Varanasi, Meghalaya, Dubai, Ooty, and Darjeeling with Indian Rupee (₹) pricing, day-by-day itineraries, inclusions/exclusions, and departure capacity.
- **Transactional Booking Engine**: Real database-backed booking flow with server-side pricing calculation, departure date validation, seat availability management, and auto-generated booking references (`WND-XXXX-XXXX`).
- **Capacity & Cancellation Management**: Real-time capacity deductions upon booking and automated capacity restoration upon user or admin cancellation.
- **JWT & Role-Based Authentication**: Secure password hashing with `bcryptjs`, JWT token verification, and role-protected administrator endpoints.
- **Administrator Console**: Live dashboard metrics (Total Users, Tours, Bookings, Revenue), tour CRUD operations, and booking status controls.
- **Wishlist & User Dashboard**: Saved trips, upcoming/past trip tracking, printable booking details, and profile management.

---

## 🛠️ 2. Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router 7, Tailwind CSS, Lucide React, Framer Motion |
| **Backend** | Node.js (v24), Express.js (v4.21), REST Architecture |
| **Database** | MongoDB Community Server (Local on Windows) |
| **ODM / Integration** | Mongoose (v8.9) |
| **Database GUI** | MongoDB Compass |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` password hashing |
| **Styling** | Tailwind CSS with customized luxury color palette and glassmorphism |

---

## 🧭 3. Database Architecture (MongoDB Compass)

### Local MongoDB Connection URI:
```text
mongodb://127.0.0.1:27017/wanderly
```

### Collections in `wanderly` Database:

1. **`users`**:
   - `name`: Full name (String)
   - `email`: Unique email (String)
   - `passwordHash`: Bcrypt-hashed password (String, never plain text)
   - `role`: Role `'user'` or `'admin'` (String, enforced on backend)
   - `phone`: Contact number (String)
   - `timestamps`: `createdAt`, `updatedAt`

2. **`tours`**:
   - `title`: Expedition title
   - `destination`: City / region (Indexed)
   - `category`: Category (`Beach`, `Mountain`, `Heritage`, `Adventure`, `Honeymoon`, `Luxury`, `Spiritual`)
   - `duration`: Formatted duration (e.g. `5 Days / 4 Nights`)
   - `price`: Price per person in INR (₹)
   - `capacity`: Maximum allowed travelers per departure date
   - `bookedSeats`: Array of `{ date: String, count: Number }` tracking seat occupancy per departure
   - `availableDates`: Array of ISO date strings
   - `itinerary`: Array of `{ day, title, description, meals, accommodation }`
   - `inclusions` & `exclusions`: Feature lists
   - `images`: Array of high-resolution travel photography URLs
   - `reviews`: Sample verified reviews

3. **`bookings`**:
   - `bookingReference`: Unique booking code (e.g., `WND-HA9X-LQRM`)
   - `userId`: Reference to `users`
   - `tourId`: Reference to `tours`
   - `travelDate`: Departure date chosen by user
   - `travelers`: Count of guests
   - `pricePerPerson`: Captured from Tour database at moment of booking
   - `totalPrice`: Server-side calculated `pricePerPerson * travelers`
   - `status`: `'Confirmed'`, `'Pending'`, or `'Cancelled'`
   - `contactDetails`: Lead traveler's name, email, phone, special requests

4. **`wishlists`**:
   - `userId`: Reference to `users`
   - `tourIds`: Array of Tour ObjectIds

---

## 🚀 4. How to Run on Windows (Step-by-Step)

### Prerequisites:
1. **Node.js** (v18 or higher installed on Windows)
2. **MongoDB Community Server** running locally on port `27017`
3. **MongoDB Compass** (for visual database inspection)

---

### Step 1: Open the Project Directory
Open PowerShell or Command Prompt:
```powershell
cd C:\Users\atuls\OneDrive\Desktop\25070521169
```

---

### Step 2: Configure Environment Variables
The environment file is already pre-configured in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/wanderly
JWT_SECRET=wanderly_college_project_jwt_super_secret_key_2026_secure
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### Step 3: Seed Database with Sample Tours & Accounts (One-Time)
Seed 14 realistic sample tours across India and international destinations, the administrator account, and a demo student account:
```powershell
cd server
npm run seed
cd ..
```
*Expected Output: `[Seed Script] Database seeding completed successfully! ✨`*

---

### Step 4: Start the Backend Server
Open a terminal in the `server` folder (or from root: `cd server`):
```powershell
cd C:\Users\atuls\OneDrive\Desktop\25070521169\server
node server.js
```
*Server runs at:* **`http://localhost:5000`**  
*Health Check:* `http://localhost:5000/api/health`

---

### Step 5: Start the Frontend Client
Open a **second** terminal window:
```powershell
cd C:\Users\atuls\OneDrive\Desktop\25070521169\client
npm run dev
```
*Frontend runs at:* **`http://localhost:5173`**

Open **`http://localhost:5173`** in your web browser.

---

## 🔑 5. Demo Credentials for Evaluation & Grading

Both accounts can be logged in instantly with the **"Quick Credentials for Evaluation"** buttons on the Login page:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@wanderly.com` | `Admin@123` | Full access to Admin Console, stats, tour CRUD, and booking controls |
| **Demo Student** | `aarav@wanderly.com` | `User@123` | Pre-loaded with upcoming and past bookings, wishlist items |

### Safe CLI Method to Create New Administrator Accounts:
As required by the project security guidelines, you can safely create or promote administrator accounts without exposing credentials in code:
```powershell
cd server
npm run create-admin
```
Follow the interactive prompt in the terminal to enter a name, email, and password.

---

## 🔍 6. How to Connect in MongoDB Compass

1. Open **MongoDB Compass** on your Windows PC.
2. In the "New Connection" screen, enter the connection string:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. In the left sidebar, click the **`wanderly`** database.
5. You will see 4 collections:
   - `tours` (14 documents)
   - `users` (Admin and user documents)
   - `bookings` (Active booking records)
   - `wishlists` (User wishlist references)
6. As you create bookings or toggle wishlists in the web app, refresh Compass to see data update live!

---

## 📋 7. Key Features Demonstrated

### 🌟 1. Homepage & Discovery
- High-impact luxury hero section with destination, date, and traveler quick-search.
- Popular destinations grid (Goa, Kashmir, Manali, Kerala, Ladakh, Bali).
- Featured and Trending tours fetched live from `/api/tours/featured`.
- Brand identity with Wanderly compass motif, testimonials, and newsletter validation.

### 🔎 2. Explore Tours with Advanced Filters
- Real-time search across tour title, destination city, and descriptions.
- Category pills (Beach, Mountain, Heritage, Adventure, Honeymoon, Luxury, Spiritual).
- Duration filter (Short 1-4d, Medium 5-7d, Long 8+d).
- Price sorting (Low to High, High to Low) and Rating sorting.
- Clean loading skeletons, empty state handling, and pagination.

### 🗺️ 3. Dynamic Tour Details & Itinerary
- Multi-photo gallery with thumbnail switcher.
- Day-by-day expandable itinerary with included meals and hotel accommodations.
- Two-column Inclusions and Exclusions checklist.
- Traveler reviews with sample data disclaimer.
- Related tour suggestions.

### 📅 4. Transactional Booking Flow
- Dynamic traveler counter and automatic total calculation:  
  $$\text{Total Price} = \text{Price Per Person} \times \text{Travelers}$$
- Server-side capacity checks: Prevents overbooking beyond maximum vehicle/room quota.
- Generates official booking reference (`WND-XXXX-XXXX`).
- Immediate confirmation modal with direct link to user dashboard.
- Educational notice stating no real money is charged.

### 👤 5. User Dashboard
- Upcoming, past, and cancelled trip tabs.
- Booking ticket summary cards.
- **Booking Cancellation**: Safely cancels reservation and **restores capacity** back to the tour database.
- Wishlist tab with quick remove/view actions.
- Profile editing (Name, Phone, Password).

### 🛡️ 6. Administrator Console (`/admin`)
- Accessible only to accounts with `role === 'admin'` (enforced by backend middleware).
- Real-time KPI metrics: Total Users, Total Tours, Total Bookings, Total Revenue in ₹.
- Add New Tour modal with full field validation.
- Edit existing tour pricing, dates, and capacities.
- Delete tour packages (safely blocked if active bookings exist).
- Filter and update booking statuses between `'Pending'`, `'Confirmed'`, and `'Cancelled'`.

---

## 🔒 8. Security & Development Notes
- **No Plaintext Passwords**: All user passwords are encrypted using `bcryptjs` with 10 salt rounds.
- **Client Price Ignored**: Total booking amounts are calculated strictly on the Express backend using the database tour price to prevent price tampering.
- **Role Enforcement**: User roles are verified from database JWT claims, never from client input.
- **Educational Note**: Wanderly is an academic full-stack capstone project. Payment processing is simulated without live credit card gateways.

---

## 📄 9. Project Structure
```text
wanderly/
├── client/                     # Frontend (React + Vite + Tailwind CSS)
│   ├── public/
│   │   └── favicon.svg         # Wanderly compass logo favicon
│   ├── src/
│   │   ├── components/         # Navbar, Footer, TourCard, SearchBar, SkeletonCard
│   │   ├── context/            # AuthContext, WishlistContext, ToastContext
│   │   ├── pages/              # Home, ExploreTours, TourDetails, Login, Signup,
│   │   │                       # Dashboard, AdminDashboard, About, Contact, NotFound
│   │   ├── services/           # Axios API client with auth interceptors
│   │   ├── App.jsx             # React Router route definitions
│   │   ├── index.css           # Tailwind directives & luxury styling
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js      # Custom luxury palette configuration
│   └── vite.config.js
├── server/                     # Backend (Node.js + Express.js + Mongoose)
│   ├── config/                 # MongoDB database connection
│   ├── controllers/            # Auth, Tour, Booking, Wishlist, Admin controllers
│   ├── middleware/             # JWT Protect, Admin Role, Centralized Error Handler
│   ├── models/                 # User, Tour, Booking, Wishlist Mongoose schemas
│   ├── routes/                 # Express REST API routes
│   ├── seed/                   # 14 Sample tours & database seed runner
│   ├── utils/                  # Interactive admin creation CLI tool
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Main Express application entrypoint
├── .gitignore
└── README.md
```

---
*Created for College Full-Stack Web Development Capstone Evaluation.*
