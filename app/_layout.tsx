import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useEffect } from 'react';
import 'react-native-reanimated';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import { drizzle } from "drizzle-orm/expo-sqlite";
import { SQLiteProvider, openDatabaseSync } from "expo-sqlite/next";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import { useColorScheme } from '@/components/useColorScheme';
import { DATABASE_NAME } from '@/constants/Database';

import migrations from '@/drizzle/migrations';
import { Image } from 'react-native';

export {
  ErrorBoundary,
} from 'expo-router';

import * as ImagePicker from 'expo-image-picker';

export const unstable_settings = { initialRouteName: '(tabs)' };

SplashScreen.preventAutoHideAsync();

const expoDB = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });
const db = drizzle(expoDB)

export default function RootLayout() {
  const [loadedFont, errorFont] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (errorFont || error) throw errorFont;
  }, [errorFont, error]);

  useEffect(() => {
    if (loadedFont && success) {
      SplashScreen.hideAsync();
    }
  }, [loadedFont, success]);

  if (!loadedFont || !success) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <SQLiteProvider databaseName={DATABASE_NAME}>
      <ActionSheetProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{
              headerShown: false
            }} />
            <Stack.Screen name="detalhes/[id]" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
      </ActionSheetProvider>
    </SQLiteProvider>
  );
}
