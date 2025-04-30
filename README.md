# RealWeb - Full Stack Real Estate Web Application

A modern full stack real estate web application built with Next.js 14, React 18, and Supabase, featuring a responsive design with Tailwind CSS.

## *🔗 [Live Website](https://realtorweb.vercel.app)*
## 🌟 Features

- **Modern Tech Stack**: Built with Next.js 14 and React 18
- **Authentication**: Secure user authentication system using Supabase
- **Responsive Design**: Mobile-first approach using Tailwind CSS
- **Dynamic Pages**:
  - Home Page with Property Listings
  - About Me Section
  - Contact Form
  - My Services
  - Admin Dashboard
  - User Authentication (Sign In/Sign Up)

## 🚀 Technologies Used

- **Frontend**:
  - Next.js 14.1.0
  - React 18.2.0
  - TypeScript
  - Tailwind CSS
  - React Icons
  - React Slick (for carousels)

- **Backend & Database**:
  - Supabase (Backend as a Service)
  - Supabase SSR for server-side rendering

- **Development Tools**:
  - ESLint
  - TypeScript
  - PostCSS
  - Autoprefixer

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/realtorweb.git
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Available Scripts

- `npm run dev` - Runs the development server
- `npm run build` - Builds the application for production
- `npm start` - Runs the production server
- `npm run lint` - Runs ESLint for code quality

## 📱 Project Structure

```
realtorweb/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication related pages
│   ├── admindashboard/    # Admin dashboard
│   ├── contact/          # Contact page
│   ├── myservices/       # Services page
│   └── aboutme/          # About page
├── components/            # Reusable React components
├── public/               # Static assets
├── utils/                # Utility functions
└── supabase/            # Supabase configuration
```

## 🔒 Authentication

This application uses Supabase for authentication, providing:
- Email/Password authentication
- Secure session management
- Protected routes

## 🎨 Styling

- Tailwind CSS for utility-first styling
- Responsive design for all screen sizes
- Custom components and layouts

## 👥 Contact

For any questions or feedback, please reach out to Joey Souza
