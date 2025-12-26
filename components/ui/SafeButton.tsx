import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

interface SafeButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
}

export function SafeButton({ title, onPress, loading }: SafeButtonProps) {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={onPress}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#FFF" />
            ) : (
                <ThemedText style={styles.text}>{title}</ThemedText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginVertical: 12,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
