# AtYourPace

A simple and intuitive task management app built with React Native and Expo Go that helps you organize your day at your own pace.

## Features

- **Daily Task Scheduling**: Plan your day using schedule/minutes/no time
- **Multiple Sections**: Organize tasks into Today, This Week, and Other Tasks
- **Smart Scheduling**: Automatic schedule recalibration when tasks are completed
- **Task Templates**: Save frequently used tasks as templates for quick reuse
- **Progress Tracking**: Track completed tasks and visualize your progress
- **Customizable Appearance**: 
  - Choose from multiple color themes
  - Personalize with avatar selection
- **Intuitive UI**: 
  - Expandable bottom sheet for task overview
  - Smooth animations and gestures
  - Clean, modern design with gradient backgrounds
- **Task Management**:
  - Add, edit, and delete tasks
  - Set duration for each task
  - Mark tasks as complete
  - Reorder tasks with up/down controls
  - Move tasks between sections

## Tech Stack

- **React Native** (0.81.5) - Mobile app framework
- **Expo** (~54.0.31) - Development platform
- **TypeScript** (^5.9.3) - Type-safe development
- **AsyncStorage** - Local data persistence
- **Expo Linear Gradient** - Beautiful gradient UI elements
- **React Native Safe Area Context** - Safe area handling

## Project Structure

```
atyourpace/
├── components/          # Reusable UI components
│   ├── AddTaskModal.tsx
│   ├── BottomSheet.tsx
│   ├── Header.tsx
│   ├── ProfileModal.tsx
│   ├── ProgressSection.tsx
│   ├── TaskItem.tsx
│   └── TodaySection.tsx
├── hooks/              # Custom React hooks
│   ├── usePanResponder.ts
│   ├── useTaskHandlers.ts
│   └── useTaskStorage.ts
├── styles/             # Component-specific styles
│   ├── appStyles.ts
│   ├── bottomSheetStyles.ts
│   ├── headerStyles.ts
│   ├── modalStyles.ts
│   ├── profileModalStyles.ts
│   ├── progressSectionStyles.ts
│   ├── taskItemStyles.ts
│   └── todaySectionStyles.ts
├── utils/              # Helper functions
│   ├── colorUtils.ts
│   └── taskHelpers.ts
├── assets/             # Images and icons
├── App.tsx             # Main application component
├── types.ts            # TypeScript type definitions
└── package.json        # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo Go app installed on your iOS or Android device

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/munchkin870411/atyourpace.git
   cd atyourpace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Running the App

1. After running `npm start`, a QR code will appear in the terminal
2. Open the Expo Go app on your phone
3. Scan the QR code:
   - **iOS**: Use the Camera app to scan the QR code
   - **Android**: Use the QR scanner in the Expo Go app
4. The app will load and run on your device

**Alternative Options:**
- Run on iOS Simulator (Mac only): Press `i` in the terminal
- Run on Android Emulator: Press `a` in the terminal
- Run in web browser: Press `w` in the terminal

## Usage

1. **Add a Task**: Tap the "Add Task" button in any section to create a new task
2. **Set Details**: Enter task name, time, duration, and optional color
3. **Manage Tasks**: 
   - Tap the checkbox to mark as complete
   - Tap the task to modify task details
   - Use arrow-buttons to reorder tasks
   - Tap the dots to move tasks between sections
4. **Customize**: Tap your profile avatar to access settings
5. **Track Progress**: View completed tasks in the section under Today

## Customization

The app supports customization through the profile modal:
- Choose from multiple color themes that apply throughout the app
- Select different avatars
- Set your preferred time format

## Data Persistence

All tasks, settings, and preferences are automatically saved to device storage using AsyncStorage, ensuring your data persists between app sessions.

## Architecture

The app follows a modular architecture with:
- **Custom Hooks**: Business logic separated into reusable hooks
- **Component-based UI**: Modular, reusable components
- **TypeScript**: Type safety throughout the codebase
- **Separation of Concerns**: Styles, logic, and UI separated into distinct files

## Author

Munchkin870411
