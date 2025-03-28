🌦 Weather Dashboard - Next.js Weather Data Visualization
This repository contains a Weather Dashboard application built using Next.js 15 with TypeScript and Recharts. It allows users to fetch, display, and analyze weather data for various cities using the OpenWeather API. The application focuses on user experience, clean architecture, responsive design, and interactive data visualization.

🚀 Getting Started
Prerequisites
Node.js (version 22 or later)

NPM / Yarn / PNPM / Bun

Installation

Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
Run Development Server

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open http://localhost:3000 with your browser to see the result.

🔍 Features :
```bash
🌤 Weather Data Fetching: Fetch real-time weather data from OpenWeather API.
📊 Data Visualization: Display weather data using Recharts for Bar Charts and Pie Charts.
📌 Map Picker Integration: Select locations using MapPickerWithCity component.
🔄 Pagination: Supports paginated weather data table display.
📱 Responsive Design: Mobile-friendly UI with Tailwind CSS.
🔑 Authentication: Secure access using NextAuth.
💾 Database Handling: Prisma ORM for data management with PostgreSQL.
🌈 Dark Mode Support: Tailwind dark mode integration.
```
📚 Dependencies
Core Dependencies
Next.js 15 - React framework for server-side rendering and static site generation.
TypeScript - Type-safe development.
Tailwind CSS - Styling framework for utility-first CSS.
Prisma - ORM for database interaction (PostgreSQL).
NextAuth - Authentication for Next.js applications.

Data Visualization
Recharts - Charting library for visualizing weather data (Bar Charts, Pie Charts).

API & Data Handling
OpenWeather API - Provides real-time weather data.
MapPickerWithCity - Custom component for selecting locations on a map using leaflet.
```bash
📁 Project Structure
/app
  ├── api              # API routes (weather fetching, authentication)
  ├── components        # Reusable UI components (Charts, LogoutButton, etc.)
  ├── lib               # Utility functions (e.g., Weather Category Handling)
  ├── page.tsx          # Main application entry point
  ├── layout.tsx        # Layout configuration
  └── styles            # Global styles (Tailwind configuration)
```

🌈 Environment Variables
Create a .env file in the root directory and add the following variables:
```bash
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/yourdatabase
OPENWEATHER_API_KEY=your_openweather_api_key
```

📦 Deployment
The easiest way to deploy your Next.js app is to use the Vercel Platform.


vercel
Alternatively, you can deploy to any hosting provider supporting Node.js.

📚 Learn More
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Recharts Documentation](https://recharts.org/) - Learn about data visualization with Recharts.
- [NextAuth Documentation](https://next-auth.js.org/) - Learn about authentication handling.
- [Prisma Documentation](https://next-auth.js.org/) - Prisma Documentation - Learn about Prisma ORM.


📜 License
This project is licensed under the MIT License.