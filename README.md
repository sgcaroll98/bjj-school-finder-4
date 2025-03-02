# BJJ School Finder - Dashboard Demo

This repository contains the dashboard functionality for the BJJ School Finder application, allowing school owners to manage their listings.

## Features

- **Dashboard Home**: Overview of schools and key metrics
- **Schools Management**: Add, edit, and delete school listings
- **Settings**: Manage account preferences and notification settings

## Dashboard Pages

- `/dashboard`: Main dashboard with statistics and quick actions
- `/dashboard/schools`: List of all schools owned by the user
- `/dashboard/schools/new`: Add a new school
- `/dashboard/schools/[id]`: Edit an existing school
- `/dashboard/settings`: User settings and preferences

## Implementation Details

The dashboard is built using Next.js and integrates with Supabase for authentication and data storage. The UI is implemented using Tailwind CSS for responsive design.

## Deployment Instructions

### GitHub Setup
1. Create a new GitHub repository
2. Upload all files from this directory to the repository

### Vercel Deployment
1. Go to [Vercel](https://vercel.com/) and sign in (you can use your GitHub account)
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Configure your project settings:
   - Set the framework preset to Next.js
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
5. Click "Deploy"

### Local Development
1. Clone the repository
2. Create a `.env.local` file with the required environment variables
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server

## Note

This is a demo repository containing only the dashboard functionality. The full application includes additional features like search, user profiles, and more.
