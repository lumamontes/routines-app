import React, { ReactNode } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { useAtom } from 'jotai';
import { Alert } from 'react-native';
import database from '../services/database';

// Database provider wrapper
export const AppDatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SQLiteProvider databaseName="habits_tasks.db" onInit={database.initDatabase}>
      <DataLoader>
        {children}
      </DataLoader>
    </SQLiteProvider>
  );
};


// Data loader component that loads items when date changes
const DataLoader: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load items when date changes
  React.useEffect(() => {
    const loadItems = async () => {
      console.log('Loading items...');
    }

    loadItems();
  }, []);

  return <>{children}</>;
};