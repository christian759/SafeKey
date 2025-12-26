import { useSettings } from '@/context/SettingsContext';
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
    const { theme } = useSettings();
    const systemColorScheme = useNativeColorScheme();

    if (theme === 'system') {
        return systemColorScheme ?? 'light';
    }

    return theme;
}
