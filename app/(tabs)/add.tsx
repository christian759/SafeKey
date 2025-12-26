import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeButton } from '@/components/ui/SafeButton';
import { SafeInput } from '@/components/ui/SafeInput';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { addAccount } from '@/services/database';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const POPULAR_SERVICES = [
    { name: 'Google', icon: 'logo-google', website: 'https://google.com' },
    { name: 'YouTube', icon: 'logo-youtube', website: 'https://youtube.com' },
    { name: 'Dribbble', icon: 'logo-dribbble', website: 'https://dribbble.com' },
    { name: 'Facebook', icon: 'logo-facebook', website: 'https://facebook.com' },
    { name: 'Twitter', icon: 'logo-twitter', website: 'https://twitter.com' },
    { name: 'Spotify', icon: 'logo-spotify', website: 'https://spotify.com' },
    { name: 'Apple', icon: 'logo-apple', website: 'https://apple.com' },
    { name: 'Github', icon: 'logo-github', website: 'https://github.com' },
];

export default function AddScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const router = useRouter();

    const [form, setForm] = React.useState({
        name: '',
        email: '',
        password: '',
        website: '',
        tags: '',
        icon: '',
    });

    const selectService = (service: typeof POPULAR_SERVICES[0]) => {
        setForm({
            ...form,
            name: service.name,
            website: service.website,
            icon: service.icon,
        });
    };

    const handleSave = async () => {
        if (!form.name) {
            Alert.alert('Error', 'Please fill in the Service Name');
            return;
        }

        try {
            await addAccount(form);
            Alert.alert('Success', 'Account saved successfully!', [
                { text: 'OK', onPress: () => router.push('/') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save account');
            console.error(error);
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Add New Account</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <ThemedText style={styles.sectionLabel}>Popular Services</ThemedText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.servicePicker}>
                    {POPULAR_SERVICES.map((service) => (
                        <TouchableOpacity
                            key={service.name}
                            style={[
                                styles.serviceItem,
                                { backgroundColor: Colors[colorScheme].secondaryGreen }
                            ]}
                            onPress={() => selectService(service)}
                        >
                            <IconSymbol name="globe" size={24} color={Colors[colorScheme].tint} />
                            <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <SafeInput
                    label="Service Name (e.g. Google)"
                    value={form.name}
                    onChangeText={(text) => setForm({ ...form, name: text })}
                />

                <SafeInput
                    label="Email or username (Optional)"
                    value={form.email}
                    onChangeText={(text) => setForm({ ...form, email: text })}
                />

                <SafeInput
                    label="Password"
                    value={form.password}
                    onChangeText={(text) => setForm({ ...form, password: text })}
                    secureTextEntry
                    showToggle
                />

                <SafeInput
                    label="Website (e.g. https://example.com)"
                    value={form.website}
                    onChangeText={(text) => setForm({ ...form, website: text })}
                />

                <SafeInput
                    label="Tags (comma separated)"
                    value={form.tags}
                    onChangeText={(text) => setForm({ ...form, tags: text })}
                />

                <SafeButton title="Save Account" onPress={handleSave} />
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontSize: 12,
        marginBottom: 12,
        opacity: 0.6,
        textTransform: 'uppercase',
    },
    servicePicker: {
        marginBottom: 24,
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    serviceItem: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        borderRadius: 16,
        marginRight: 12,
        gap: 8,
    },
    serviceName: {
        fontSize: 10,
        fontWeight: '600',
    }
});
