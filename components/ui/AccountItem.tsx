import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface AccountItemProps {
    name: string;
    email: string;
    icon?: string;
    onPress?: () => void;
}

export function AccountItem({ name, email, icon, onPress }: AccountItemProps) {
    const colorScheme = useColorScheme() ?? 'light';

    const getIconName = () => {
        if (icon && icon.includes('google')) return 'logo-google';
        if (icon && icon.includes('youtube')) return 'logo-youtube';
        if (icon && icon.includes('facebook')) return 'logo-facebook';
        if (icon && icon.includes('twitter')) return 'logo-twitter';
        if (icon && icon.includes('spotify')) return 'logo-spotify';
        if (icon && icon.includes('apple')) return 'logo-apple';
        if (icon && icon.includes('github')) return 'logo-github';
        return 'person.circle.fill';
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <IconSymbol name={getIconName() as any} size={28} color={Colors[colorScheme].tint} />
                </View>
                <View style={styles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={styles.name}>{name}</ThemedText>
                    <ThemedText style={styles.email}>{email}</ThemedText>
                </View>
            </View>
            <IconSymbol name="square.on.square" size={20} color={Colors[colorScheme].icon} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        marginBottom: 2,
    },
    email: {
        fontSize: 12,
        opacity: 0.5,
    },
});
