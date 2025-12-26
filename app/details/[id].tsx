import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeInput } from '@/components/ui/SafeInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Account, deleteAccount, getAccountById } from '@/services/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AccountDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';

    const [account, setAccount] = React.useState<Account | null>(null);
    const [showPassword, setShowPassword] = React.useState(false);

    React.useEffect(() => {
        async function loadAccount() {
            if (id) {
                const data = await getAccountById(Number(id));
                setAccount(data);
            }
        }
        loadAccount();
    }, [id]);

    const handleDelete = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete this account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteAccount(Number(id));
                        router.back();
                    }
                },
            ]
        );
    };

    if (!account) return null;

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <IconSymbol name="chevron.left" size={24} color={Colors[colorScheme].text} />
                </TouchableOpacity>

                <View style={styles.profileSection}>
                    <View style={styles.iconContainer}>
                        <IconSymbol
                            name={
                                (account.icon && account.icon.includes('google') ? 'logo-google' :
                                    account.icon && account.icon.includes('youtube') ? 'logo-youtube' :
                                        'person.circle.fill') as any
                            }
                            size={60}
                            color={Colors[colorScheme].tint}
                        />
                    </View>
                    <ThemedText type="title" style={styles.title}>{account.name}</ThemedText>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <IconSymbol name="trash" size={20} color={Colors[colorScheme].icon} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <SafeInput
                    label="Email or username"
                    value={account.email}
                    showCopy
                />

                <SafeInput
                    label="Password"
                    value={account.password || ''}
                    secureTextEntry={!showPassword}
                    showToggle
                    showCopy
                    onToggle={() => setShowPassword(!showPassword)}
                />

                <SafeInput
                    label="Website"
                    value={account.website || ''}
                    showCopy
                />

                <View style={styles.tagsSection}>
                    <ThemedText style={styles.label}>Tags</ThemedText>
                    <View style={styles.tagsContainer}>
                        {(account.tags || '').split(',').filter(Boolean).map(tag => (
                            <View key={tag} style={[styles.tag, { backgroundColor: Colors[colorScheme].secondaryGreen }]}>
                                <ThemedText style={[styles.tagText, { color: Colors[colorScheme].tint }]}>{tag}</ThemedText>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerAction}>
                    <IconSymbol name="star" size={20} color={Colors[colorScheme].icon} />
                    <ThemedText style={styles.footerText}>Favourite</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerAction}>
                    <IconSymbol name="pencil" size={20} color={Colors[colorScheme].icon} />
                    <ThemedText style={styles.footerText}>Edit</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerAction}>
                    <IconSymbol name="ellipsis.vertical" size={20} color={Colors[colorScheme].icon} />
                    <ThemedText style={styles.footerText}>Others</ThemedText>
                </TouchableOpacity>
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    profileSection: {
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    deleteButton: {
        padding: 8,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    label: {
        fontSize: 12,
        marginBottom: 12,
        opacity: 0.6,
    },
    tagsSection: {
        marginTop: 8,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    tagText: {
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        backgroundColor: '#FFF',
    },
    footerAction: {
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 12,
        opacity: 0.6,
    },
});
