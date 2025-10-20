# Welcome to Your SaaS Dashboard

This is a web application that includes a visual dashboard where you can view and track important information.

## What Does This Do?

This application has two main parts that work together:

1. **Dashboard** - A friendly website interface where you can see charts, metrics, and activity
2. **API Service** - The behind-the-scenes system that provides the data to display on the dashboard

Think of it like a car: the dashboard is what you see and interact with, and the API is the engine that makes everything work.

## How to Get Started

### What You'll Need

Before you begin, make sure you have these programs installed on your computer:
- **Node.js** (version 22 or newer)
- **pnpm** (version 10 or newer) - This is a tool that helps manage the application

If you're not sure whether you have these, ask your technical team for help setting them up.

### Starting the Application

Once everything is installed, follow these simple steps:

**Step 1:** Open your terminal or command prompt

**Step 2:** Navigate to this folder (if you're not already there)

**Step 3:** Install everything the application needs by typing:
```
pnpm install
```
Wait for this to finish - it might take a minute or two.

**Step 4:** Start the application by typing:
```
pnpm dev
```

**Step 5:** Open your web browser and go to:
```
http://localhost:3024
```

That's it! You should now see your dashboard.

## What You'll See

When you open the dashboard, you'll be able to:
- View important metrics and statistics
- See recent activity
- Check weekly charts and trends
- Navigate through different sections

Everything updates automatically, so you'll always see the latest information.

## Stopping the Application

When you're done, you can stop the application by:
1. Going back to your terminal/command prompt
2. Press `Ctrl + C` on your keyboard (or `Command + C` on Mac)

## Need Help?

If something isn't working or you're not sure what to do:
- Check that you followed all the steps in order
- Make sure Node.js and pnpm are properly installed
- Contact your technical team for assistance

## Technical Details

For developers and technical users, here are some additional details:

### Project Structure
- `apps/dashboard` - Next.js application (frontend)
- `apps/api` - Express.js service (backend)

### Additional Commands
- Run only the dashboard: `pnpm dev:dashboard`
- Run only the API: `pnpm dev:api`
- Build for production: `pnpm build`
- Type checking: `pnpm typecheck`

### Architecture
This project uses Vercel's microfrontends approach to route requests:
- Dashboard handles all UI routes
- API service handles `/api/*` paths
- All services run under the same domain

### Requirements
- Node.js 22.x
- pnpm 10.x
