# Simple Calendar App

A full-stack calendar application that allows users to schedule, view, edit, and delete events — complete with browser notifications and snooze functionality. Built with **Next.js** for the frontend and **NestJS** for the backend.

---

## Features

- Create, view, update, and delete calendar events
- Browser notifications with snooze support
- Image and video attachments (with preview)
- Responsive, modern UI with TailwindCSS

---

## Tech Stack

- **Frontend:** React + Next.js + TailwindCSS
- **Backend:** NestJS (in-memory storage)
- **Notifications:** Web Notifications API + `setTimeout`
- **Styling:** TailwindCSS, React Toastify, React Modal

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/calendar-app.git
cd calendar-app
```

---

## Folder Structure

```
calendar-app/
├── client/     # Next.js frontend
└── server/     # NestJS backend
```

---

## Backend Setup (NestJS)

### Navigate to the `server/` folder:

```bash
cd server
```

### Install dependencies:

```bash
yarn install
# or
npm install
```

### Start the backend server:

```bash
yarn start:dev
# or
npm run start:dev
```

By default, the server will run at: `http://localhost:3000`

---

## Frontend Setup (Next.js)

### Navigate to the `client/` folder:

```bash
cd client
```

### Install dependencies:

```bash
npm install
```

### Start the frontend dev server:

```bash
npm run dev
```

By default, the frontend will run at: `http://localhost:3000`

If your backend is also running on port 3000, you can change the frontend port:

```bash
PORT=3001 npm run dev
```

---

## Environment Variables

If needed, create a `.env.local` file in `/client` to define the backend API URL:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

---

## Testing Notifications

Make sure to **allow notifications** in your browser.

1. Click the “Enable Notifications” button.
2. Schedule an event a few minutes into the future.
3. Wait for the notification popup. Click "Snooze" to re-notify after 5 minutes.

---

## TODOs / Improvements

- [ ] Add validation for image and video URL
- [ ] Add user authentication
- [ ] Monthly view / advanced calendar UI

---
