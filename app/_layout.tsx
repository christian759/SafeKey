import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import 'react-native-reanimated';

import { LockScreen } from '@/components/LockScreen';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isLocked, setIsLocked, isAppLockEnabled, isLoading } = useSettings();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' && isAppLockEnabled) {
        setIsLocked(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAppLockEnabled]);

  if (isLoading) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      {isLocked && <LockScreen />}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <RootLayoutContent />
    </SettingsProvider>
  );
}
