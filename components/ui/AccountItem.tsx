import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Alert, Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './icon-symbol';

interface AccountItemProps {
    name: string;
    email: string;
    icon?: string;
    onPress?: () => void;
}

const BRAND_COLORS: Record<string, string> = {
    google: '#EA4335',
    youtube: '#FF0000',
    facebook: '#1877F2',
    twitter: '#1DA1F2',
    spotify: '#1DB954',
    apple: '#000000',
    figma: '#F24E1E',
    skype: '#00AFF0',
};

export function AccountItem({ name, email, icon, onPress }: AccountItemProps) {
    const colorScheme = useColorScheme() ?? 'light';
    const colors = Colors[colorScheme];

    const getIconInfo = () => {
        const lowerIcon = icon?.toLowerCase() || '';
        const lowerName = name?.toLowerCase() || '';

        for (const brand in BRAND_COLORS) {
            if (lowerIcon.includes(brand) || lowerName.includes(brand)) {
                return { name: `logo-${brand}`, color: BRAND_COLORS[brand] };
            }
        }
        return { name: 'person.circle.fill', color: colors.tint };
    };

    const iconInfo = getIconInfo();

    const handleCopy = (e: any) => {
        e.stopPropagation();
        Clipboard.setString(email);
        Alert.alert('Copied', 'Email copied to clipboard!');
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.6}>
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, { backgroundColor: `${iconInfo.color}10` }]}>
                    <IconSymbol name={iconInfo.name as any} size={24} color={iconInfo.color} />
                </View>
                <View style={styles.textContainer}>
                    <ThemedText type="defaultSemiBold" style={[styles.name, { color: colors.text }]}>{name}</ThemedText>
                    <ThemedText style={[styles.email, { color: colors.icon }]}>{email}</ThemedText>
                </View>
            </View>
            <TouchableOpacity onPress={handleCopy} hitSlop={10}>
                <IconSymbol name="square.on.square" size={20} color={colors.icon} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    email: {
        fontSize: 13,
    },
});
