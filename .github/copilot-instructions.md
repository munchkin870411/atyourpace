# Copilot Instructions — At Your Pace

## Project Overview

This is a React Native + Expo (SDK 54) task management app written in TypeScript. It runs on iOS, Android, and web. There is no navigation library — the entire UI lives on a single screen with modals and a custom bottom sheet.

## Architecture

### State & Data Flow

- All app state lives in `App.tsx` via `useState` hooks. There is no global state library.
- `AsyncStorage` is the sole persistence layer — tasks and user preferences are stored as JSON strings.
- Task mutations go through pure helper functions in `utils/taskHelpers.ts`, which return new arrays (immutable pattern). `App.tsx` then calls `setTasks()` and `saveTasks()`.
- The color theme is derived from a single base hex color via `utils/colorUtils.ts` → `generateColorTheme()`, memoized with `useMemo`. Every component receives the resulting `ColorTheme` object as a prop.

### Component Responsibilities

| Component         | Role                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `App.tsx`         | Root: owns all state, AsyncStorage I/O, passes props down                                                  |
| `Header`          | Top bar with logo image and avatar (tapping opens ProfileModal)                                            |
| `TodaySection`    | Renders active today tasks + "done at" time prediction                                                     |
| `ProgressSection` | Renders completed tasks + total time tally                                                                 |
| `BottomSheet`     | Swipe-up panel for "This Week" and "Other Tasks" sections; uses `PanResponder` + `Animated`                |
| `TaskItem`        | Single task row: checkbox, color indicator, reorder arrows, section move menu, delete                      |
| `AddTaskModal`    | Create or edit a task; includes saved-template dropdown, color picker, duration input, optional start time |
| `ProfileModal`    | Avatar picker, color theme picker (8 presets), time format toggle (schedule/minutes/no time)               |

### Task Time Scheduling

When the time format is `'schedule'`:

- The first "today" task gets a start time (either user-specified or current clock time).
- Each subsequent task's start time = previous task's start time + previous task's duration.
- Completing, uncompleting, reordering, or deleting a task triggers a full recalculation of downstream times.
- Time strings use `"HH.MM"` format (dot separator, not colon).

### Color Theme

`generateColorTheme(baseColor)` outputs a `ColorTheme` with: `primary`, `light`, `lighter`, `lightest`, `dark`, `darker`, `darkest`, `textColor`. The gray preset (`#909090`) triggers a hardcoded dark mode palette. All other colors generate light-mode shades algorithmically.

## Coding Conventions

- **Language**: TypeScript, strict mode.
- **Components**: Functional components with hooks. No class components.
- **Props**: Typed via explicit interfaces above each component (not inline).
- **Styles**: Separated into `styles/` directory using `StyleSheet.create()`. Some inline styles exist for dynamic theme-dependent values — that is intentional.
- **No external UI library** — all UI is built with React Native primitives + `expo-linear-gradient`.
- **Code comments**: Some comments are in Swedish (e.g., "Ladda tasks", "Räkna om"). Preserve existing comment language when editing nearby code; use English for new code.
- **Time format**: Always `"HH.MM"` (24h, dot-separated). Never colons.
- **IDs**: Sequential integers. New ID = `max(existing IDs) + 1`.
- **Immutability**: Task arrays are never mutated in place. Always spread/filter/map into new arrays.

## Common Pitfalls

- The time `'09.00'` is treated as an invalid/legacy default in several migration checks — don't use it as a default start time.
- `dayStartTime` in `App.tsx` is persisted separately from tasks and is used as the anchor for time recalculation. When the first today-task is added, `dayStartTime` gets set.
- Daily reset: on each app launch, if the date has changed, all "today" tasks are deleted and `dayStartTime` is cleared. "This Week" and "Other" tasks persist.
- The bottom sheet uses raw `PanResponder` + `Animated.Value` — not a library. Be careful with gesture thresholds when modifying swipe behavior.
- `isSavedTemplate` on a `Task` marks it as reusable in the add-task dropdown. Saved templates are still regular tasks — they just have this flag set.

## When Making Changes

1. **Adding a new task property**: Update the `Task` interface in `types.ts`, then handle it in `taskHelpers.ts` (add/edit/toggle), `AddTaskModal.tsx` (form), and `App.tsx` (persistence).
2. **Adding a new component**: Create it in `components/`, add a typed props interface, create corresponding styles in `styles/`, and wire it up in `App.tsx`.
3. **Modifying time logic**: All time math lives in `utils/taskHelpers.ts`. The functions `addTask`, `toggleTask`, `moveTaskUp`, `moveTaskDown`, and `moveTaskToSection` all contain time recalculation — test changes against all of them.
4. **Adding a new setting**: Add AsyncStorage read in `loadTasks()`, write in the appropriate handler, and expose it in `ProfileModal`.
5. **Theming**: Pass `colorTheme` as a prop. Use `colorTheme.lightest` for surfaces, `colorTheme.dark` for borders, `colorTheme.darkest` for primary buttons, `colorTheme.textColor` for text.

## File Quick Reference

| File                             | Lines | Key exports / purpose                                                                                |
| -------------------------------- | ----- | ---------------------------------------------------------------------------------------------------- |
| `App.tsx`                        | ~346  | Default export `App`, all state + persistence                                                        |
| `types.ts`                       | ~13   | `Task` interface                                                                                     |
| `utils/taskHelpers.ts`           | ~357  | `addTask`, `deleteTask`, `editTask`, `toggleTask`, `moveTaskToSection`, `moveTaskUp`, `moveTaskDown` |
| `utils/colorUtils.ts`            | ~100  | `ColorTheme` interface, `generateColorTheme()`, `addAlpha()`                                         |
| `components/AddTaskModal.tsx`    | ~313  | Task creation/editing modal                                                                          |
| `components/ProfileModal.tsx`    | ~219  | Settings modal                                                                                       |
| `components/BottomSheet.tsx`     | ~200  | Swipeable panel                                                                                      |
| `components/TaskItem.tsx`        | ~200  | Single task row                                                                                      |
| `components/TodaySection.tsx`    | ~100  | Today tasks list                                                                                     |
| `components/ProgressSection.tsx` | ~60   | Completed tasks list                                                                                 |
| `components/Header.tsx`          | ~40   | Top bar                                                                                              |
