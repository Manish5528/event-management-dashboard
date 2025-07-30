📅 Event Management Dashboard (Next.js + TypeScript)
A simple Event Management Dashboard built with Next.js(App Router), TypeScript, and React Hook Form + Yup.
It supports user authentication, event creation, editing, deletion, filtering, and search functionality.

🚀 Features
✅ User Authentication (LocalStorage-based) – Login, Logout, and Protected Routes
✅ Event CRUD – Create, Update, Delete, and View Events
✅ Event Filtering & Search – Filter events by type, category, date range, and sort order
✅ Validation – Prevents time conflicts and invalid date ranges using Yup schema
✅ Persistent Data – Events are stored in a JSON file (src/data/events.json)
✅ Optimized Context – Uses React Context API to manage events globally

📂 Project Structure
bash
Copy
Edit
src/
 ├── app/                 # App Router pages (dashboard, login, etc.)
 ├── components/          # UI Components (CreateEventModal, etc.)
 ├── context/             # AuthContext & EventContext
 ├── data/events.json     # JSON file for storing events
 ├── styles/              # CSS Modules
 └── utils/               # Helper functions (routes, constants, etc.)
🛠 Tech Stack
Next.js (App Router)

React + TypeScript

React Hook Form + Yup (Form validation)

React Context API (Auth & Event state management)

React Hot Toast (Notifications)

LocalStorage (For persisting user data)

File-based JSON storage (fs module)

🔑 Authentication Flow
User login is stored in LocalStorage.

AuthContext provides user, login, and logout.

Protected routes check user and redirect to /login if not logged in.

📅 Event Features
✅ Create/Edit Event – Uses a single modal for both operations.
✅ Validation Rules

Required title, description, and category

location required for In-Person events

eventLink required for Online events

End Date must be after Start Date

No overlapping event times allowed

✅ Filter & Search – By event type, category, date range, and sort order.
✅ JSON File Storage – Events are saved in src/data/events.json.


🖥️ Running Locally
1️⃣ Install dependencies
npm install
2️⃣ Start the dev server
npm run dev
3️⃣ Open in browser
➡️ http://localhost:3000