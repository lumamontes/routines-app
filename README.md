# Tarefitas

A React Native task management application built with Expo, TypeScript, and Jotai for state management.

## 🚀 Features

- Task management with priorities and due dates
- Daily routines and habits tracking
- Dark/Light mode support
- Offline-first with AsyncStorage
- Beautiful UI with Gluestack UI components

## 🛠 Tech Stack

- React Native with Expo
- TypeScript
- Jotai for state management
- Gluestack UI for components
- NativeWind for styling
- React Hook Form with Zod validation
- Expo Router for navigation

## 📦 Installation

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

## 🎯 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start the app on Android
- `npm run ios` - Start the app on iOS
- `npm run web` - Start the app on web
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗 Project Structure

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

## 📝 Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

To maintain code quality:
1. Run `npm run lint` before committing
2. Run `npm run format` to format your code
3. Fix any TypeScript errors before committing

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
