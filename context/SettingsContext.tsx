import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark' | 'system';

interface SettingsContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    isAppLockEnabled: boolean;
    setAppLockEnabled: (enabled: boolean) => void;
    isBiometricsEnabled: boolean;
    setBiometricsEnabled: (enabled: boolean) => void;
    pin: string | null;
    setPin: (pin: string | null) => void;
    isLocked: boolean;
    setIsLocked: (locked: boolean) => void;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<ThemeType>('light');
    const [isAppLockEnabled, setAppLockEnabledState] = useState(false);
    const [isBiometricsEnabled, setBiometricsEnabledState] = useState(false);
    const [pin, setPinState] = useState<string | null>(null);
    const [isLocked, setIsLocked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('user-theme');
            const savedLock = await AsyncStorage.getItem('app-lock-enabled');
            const savedBiometrics = await AsyncStorage.getItem('biometrics-enabled');
            const savedPin = await AsyncStorage.getItem('user-pin');

            if (savedTheme) setThemeState(savedTheme as ThemeType);

            const isLockEnabled = savedLock === 'true';
            setAppLockEnabledState(isLockEnabled);

            if (savedPin) {
                setPinState(savedPin);
                setIsLocked(isLockEnabled);
            } else {
                // First launch - Force lock for PIN setup
                setIsLocked(true);
            }

            if (savedBiometrics) setBiometricsEnabledState(savedBiometrics === 'true');
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setIsLoading(false);
        }
    };

    const setTheme = async (newTheme: ThemeType) => {
        setThemeState(newTheme);
        await AsyncStorage.setItem('user-theme', newTheme);
    };

    const setAppLockEnabled = async (enabled: boolean) => {
        setAppLockEnabledState(enabled);
        await AsyncStorage.setItem('app-lock-enabled', String(enabled));
        if (!enabled) setIsLocked(false);
    };

    const setBiometricsEnabled = async (enabled: boolean) => {
        setBiometricsEnabledState(enabled);
        await AsyncStorage.setItem('biometrics-enabled', String(enabled));
    };

    const setPin = async (newPin: string | null) => {
        setPinState(newPin);
        if (newPin) {
            await AsyncStorage.setItem('user-pin', newPin);
        } else {
            await AsyncStorage.removeItem('user-pin');
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                theme,
                setTheme,
                isAppLockEnabled,
                setAppLockEnabled,
                isBiometricsEnabled,
                setBiometricsEnabled,
                pin,
                setPin,
                isLocked,
                setIsLocked,
                isLoading,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
