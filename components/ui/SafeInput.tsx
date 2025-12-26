import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface SafeInputProps {
    label: string;
    value: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    showCopy?: boolean;
    showToggle?: boolean;
    onToggle?: () => void;
    onCopy?: () => void;
}

export function SafeInput({
    label,
    value,
    onChangeText,
    secureTextEntry,
    showCopy,
    showToggle,
    onToggle,
    onCopy
}: SafeInputProps) {
    const colorScheme = useColorScheme() ?? 'light';

    return (
        <View style={styles.container}>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <View style={[styles.inputContainer, { backgroundColor: Colors[colorScheme].background, borderColor: Colors[colorScheme].border }]}>
                <TextInput
                    style={[styles.input, { color: Colors[colorScheme].text }]}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    editable={!!onChangeText}
                />
                <View style={styles.actions}>
                    {showToggle && (
                        <TouchableOpacity onPress={onToggle} style={styles.actionButton}>
                            <IconSymbol name={secureTextEntry ? "eye.slash" : "eye"} size={20} color={Colors[colorScheme].icon} />
                        </TouchableOpacity>
                    )}
                    {showCopy && (
                        <TouchableOpacity onPress={onCopy} style={styles.actionButton}>
                            <IconSymbol name="square.on.square" size={20} color={Colors[colorScheme].icon} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        marginBottom: 8,
        opacity: 0.6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 52,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 8,
        marginLeft: 4,
    },
});
