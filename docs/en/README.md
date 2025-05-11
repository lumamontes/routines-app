# Tarefitas Documentation

## Table of Contents
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Components](#components)
- [State Management](#state-management)
- [Styling](#styling)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/tarefitas.git
cd tarefitas
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Architecture

### Project Structure
```
tarefitas/
├── app/                 # Expo Router app directory
├── assets/             # Static assets
├── components/         # Reusable components
├── constants/          # App constants
├── hooks/             # Custom hooks
├── store/             # Jotai atoms and state management
└── types/             # TypeScript type definitions
```

### Key Technologies
- React Native with Expo
- TypeScript
- Jotai for state management
- Gluestack UI for components
- NativeWind for styling
- React Hook Form with Zod validation
- Expo Router for navigation

## Components

### Core Components
- `TaskCard`: Displays individual task information
- `UserProgressBar`: Shows user's daily progress
- `ProfileCard`: User profile information display
- `EmptyState`: Empty state component for lists

### UI Components
We use Gluestack UI components for consistent styling:
- Buttons
- Inputs
- Forms
- Modals
- Navigation elements

## State Management

### Jotai Atoms
- `tasksAtom`: Manages task state
- `routinesAtom`: Manages routine state
- `settingsAtom`: Manages app settings
- `avatarUriAtom`: Manages user avatar

### Data Flow
1. User actions trigger atom updates
2. Atoms update the UI
3. Changes are persisted to AsyncStorage

## Styling

### NativeWind
We use NativeWind (Tailwind CSS for React Native) for styling:
```tsx
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-lg font-bold text-gray-800 dark:text-white">
    Hello World
  </Text>
</View>
```

### Theme Support
- Light/Dark mode support
- Custom color schemes
- Responsive design

## Testing

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for atoms
- Component tests
- Integration tests

## Deployment

### Building for Production
1. Configure app.json
2. Build for platforms:
```bash
# iOS
npm run ios:build

# Android
npm run android:build
```

### App Store Submission
1. Prepare assets
2. Configure app store settings
3. Submit for review

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make changes
4. Run tests and linting
5. Submit a pull request

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript for type safety

### Git Hooks
- Pre-commit hooks for linting
- Pre-push hooks for testing 