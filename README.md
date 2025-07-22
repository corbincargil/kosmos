# Kosmos - Life Organization Platform

A modern, full-stack productivity application that combines task management, note-taking, and blogging into a unified platform. Used as my personal replacement for Notion.

![Kosmos Task Board](https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGVscWp4Mmt5MmlmZmZxeG1ldDVxc2RtcTY3ZmF5a3lwcjM2bjhlZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tP4TwcuWBV0IUxJf2c/giphy.gif)

## ✨ Feature Highlights

### 🎯 **Smart Task Management**

- **Kanban Board** with quick-update functionality and swipe gestures
- **Advanced Filtering** by status, priority, tags, due dates, and workspaces
- **Optimistic Updates** for instant UI feedback
- **Mobile-First Design** with touch gestures

### 📝 **Rich Content Creation**

- **Auto-Save** with debounced saving to prevent data loss
- **Blog Publishing** used as the CMS for my personal blog with SEO-friendly slug generation and reading time calculation
- **Dual Editor Support** - Rich text (TipTap) and Markdown with live preview

### 🔧 **Scalable Infrastructure**

- **Database Branching** for preview environments
- **CI/CD Pipeline** with GitHub Actions
- **Vercel Deployment** with automatic preview deployments

## 🛠️ Tech Stack

### Frontend

- **Next.js 14** with App Router and Server Components
- **TypeScript** for type safety across the entire stack
- **Tailwind CSS** with custom design system
- **tRPC** for end-to-end type-safe APIs
- **React Query** for server state management

### Backend & Database

- **PostgreSQL** with Prisma ORM
- **Neon Database** with automatic branching for preview environments
- **Clerk Authentication** with username/password support

## Additional Features

### 🏢 **Multi-Workspace Organization**

- **Life Area Separation** - Development, Faith, Work, Finance, Health, etc.
- **Customizable Workspaces** with colors, icons, and themes
- **Context Switching** with workspace-specific content and filters

### 📱 **Mobile Experience**

- **Installable** - Add to home screen
- **Touch Gestures** - Swipe to complete tasks, expand cards
- **Offline Support** - Service worker caching

### 📊 **Performance & UX**

- **Optimistic UI** - Instant feedback for user actions
- **Debounced Saving** - Prevents data loss while maintaining performance
- **Skeleton Loading** - Smooth loading states throughout the app
- **Error Boundaries** - Graceful error handling and recovery

### 🎨 **Design System**

- **Custom Color System** - Workspace-specific theming
- **Responsive Design** - Seamless experience across all devices
- **Dark/Light Themes** - Automatic theme switching
