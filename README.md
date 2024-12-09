# Project Management Application

This project is a web-based project management dashboard that allows users to manage tasks, projects, and workspaces. It is built using modern web technologies and provides a user-friendly interface for managing various aspects of project management.

## Features

- **Task Management**: Create, edit, and delete tasks. Assign tasks to members and set due dates.
- **Project Management**: Create, edit, and delete projects. View project analytics and manage project settings.
  - **Table View**: View tasks in a table format with sorting and filtering options.
  - **Calendar View**: View tasks in a calendar format.
  - **Kanban View**: View tasks in a kanban board format with drag-and-drop functionality.
- **Workspace Management**: Create and manage workspaces. Invite members to workspaces and manage workspace settings.
- **User Authentication**: Secure user authentication and authorization.
- **Responsive Design**: Fully responsive design that works on both desktop and mobile devices.

## Project Structure

The project has the following structure:

- **src/app/**: Contains the main application components and pages.
- **src/components/**: Contains reusable UI components.
- **src/features/**: Contains feature-specific components, hooks, and APIs.
- **src/hooks/**: Contains custom hooks.
- **src/lib/**: Contains utility functions and libraries.
- **src/types/**: Contains TypeScript type definitions.

## Environment Variables

- NEXT_PUBLIC_APP_URL
- NEXT_PUBLIC_APPWRITE_ENDPOINT
- NEXT_PUBLIC_APPWRITE_PROJECT
- NEXT_PUBLIC_APPWRITE_DATABASE_ID
- NEXT_PUBLIC_APPWRITE_WORKSPACES_ID
- NEXT_PUBLIC_APPWRITE_MEMBERS_ID
- NEXT_PUBLIC_APPWRITE_PROJECTS_ID
- NEXT_PUBLIC_APPWRITE_TASKS_ID
- NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID
- NEXT_APPWRITE_KEY