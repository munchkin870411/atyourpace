# At Your Pace

A personal task management app built with React Native and Expo. Designed to help you plan your day at your own pace — schedule tasks, track progress, and stay in control of your time.

## What It Does

- **Daily scheduling** — Add tasks with durations. The app auto-calculates a sequential time schedule starting from when you begin your day.
- **Three task sections** — "Today", "This Week", and "Other Tasks" to organize work by urgency.
- **Drag-to-reveal bottom sheet** — Swipe up from the bottom to access "This Week" and "Other Tasks" sections.
- **Progress tracking** — Completed tasks move to a progress section that tallies total time accomplished.
- **Smart time recalculation** — Completing, reordering, or unchecking tasks automatically adjusts the schedule.
- **Task templates** — Save tasks for quick reuse across days.
- **Move tasks between sections** — Long press the `⋯` menu on any task to reassign it.
- **Reorder tasks** — Use ▲/▼ arrows to rearrange task order within a section.
- **Profile customization** — Choose an avatar emoji, color theme, and time display format (schedule/minutes/no time).
- **Dark mode** — Select the gray theme for a dark interface.
- **Persistent storage** — All tasks, settings, and preferences saved locally via AsyncStorage.
- **Daily reset** — Today's tasks clear automatically at the start of each new day.

## Tech Stack

- **React Native** 0.81 with **Expo** SDK 54
- **TypeScript** for type safety
- **AsyncStorage** for local persistence
- **expo-linear-gradient** for themed gradient backgrounds
- **react-native-safe-area-context** for safe area handling
- No navigation library — single-screen app with modals and a bottom sheet

## Project Structure

```
├── App.tsx                  # Root component — state, persistence, layout
├── types.ts                 # Task interface definition
├── index.js                 # Expo entry point
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
│
├── components/
│   ├── Header.tsx           # App bar with logo and avatar
│   ├── TodaySection.tsx     # Today's active task list with "done at" time
│   ├── ProgressSection.tsx  # Completed tasks with total time counter
│   ├── BottomSheet.tsx      # Swipeable sheet for "This Week" & "Other"
│   ├── TaskItem.tsx         # Individual task row (checkbox, color, actions)
│   ├── AddTaskModal.tsx     # Modal for creating/editing tasks
│   └── ProfileModal.tsx     # Modal for avatar, color theme & time format
│
├── styles/
│   ├── appStyles.ts         # Main layout styles
│   ├── headerStyles.ts      # Header bar styles
│   ├── modalStyles.ts       # Add/edit task modal styles
│   ├── profileModalStyles.ts # Profile modal styles
│   └── taskItemStyles.ts    # Task row styles
│
├── utils/
│   ├── taskHelpers.ts       # Pure functions: add, delete, edit, toggle,
│   │                        #   move, reorder tasks + time recalculation
│   └── colorUtils.ts        # Color theme generation from a base color
│
└── assets/                  # Logo, icons, splash screen images
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the Expo development server
npx expo start
```

Then open on a device/emulator via the Expo Go app, or press `a` (Android) / `i` (iOS) / `w` (web) in the terminal.

## Key Data Model

```ts
interface Task {
  id: number;
  text: string;
  time: string;          // "HH.MM" format
  duration: number;      // minutes
  color: string;         // hex color code
  completed: boolean;
  completedAt?: string;  // timestamp when completed
  section: 'today' | 'thisWeek' | 'other';
  isSavedTemplate?: boolean;
}
```

## Color Theme System

The app generates a full `ColorTheme` (8 shades from lightest to darkest + text color) from a single base color chosen in the profile. Selecting the gray preset (`#909090`) activates dark mode with inverted shades.

## AsyncStorage Keys

| Key | Purpose |
|---|---|
| `tasks` | JSON array of all tasks |
| `lastClearedDate` | Date string for daily reset logic |
| `dayStartTime` | First task's start time for schedule calculation |
| `timeFormat` | `'schedule'` / `'minutes'` / `'notime'` |
| `selectedAvatar` | Emoji string |
| `selectedColor` | Hex color for theme generation |
