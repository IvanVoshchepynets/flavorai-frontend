# FlavorAI Frontend (Next.js + Tailwind CSS)

A modern frontend for **FlavorAI – Personal Recipe Discovery**, built with Next.js, TypeScript, and Tailwind CSS.  
Provides a responsive UI for browsing, creating, and rating recipes, with JWT-based authentication.

## Main Features

- User authentication (sign up, log in, log out)
- Persistent auth using localStorage (JWT + user data)
- Create new recipes with:
  - title, description, ingredients, instructions, cuisine
- Browse all recipes on the home page
- Search recipes by name
- View only recipes created by the logged-in user (**My recipes**)
- View recipe details with rating info
- Rate recipes (1–5 stars)
- Responsive layout (desktop & mobile)

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React, Tailwind CSS
- **State & Auth:** Custom `AuthProvider` (React Context + localStorage)
- **HTTP:** Fetch API
- **Backend API:** NestJS backend (FlavorAI Backend) on `http://localhost:3000`

---

## How to Run the Frontend

1. Clone the repository

git clone https://github.com/IvanVoshchepynets/flavorai-frontend.git

2. Navigate into the frontend folder:

cd flavorai-frontend

3. Install dependencies

npm install

4. Configure environment variables, create .env.local in the root of the frontend project:

NEXT_PUBLIC_API_URL=http://localhost:3000

5. Start the development server

npm run dev

6. The frontend will be available at:

http://localhost:3001

(or the URL printed in the terminal).
