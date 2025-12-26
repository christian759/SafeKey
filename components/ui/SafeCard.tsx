import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

interface SafeCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function SafeCard({ children, style }: SafeCardProps) {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: Colors[colorScheme].card,
                borderColor: Colors[colorScheme].border
            },
            style
        ]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }
        }),
    },
});
