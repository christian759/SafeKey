import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getDatabase } from '@/services/database';
import React from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Switch, TextInput, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const [showPinModal, setShowPinModal] = React.useState(false);
    const [tempPin, setTempPin] = React.useState('');
    const [pinPurpose, setPinPurpose] = React.useState<'set' | 'change'>('set');

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to delete ALL saved passwords? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Everything',
                    style: 'destructive',
                    onPress: async () => {
                        const db = await getDatabase();
                        await db.runAsync('DELETE FROM accounts');
                        Alert.alert('Success', 'All data has been cleared.');
                    }
                },
            ]
        );
    };

    const handleAppLockToggle = async (value: boolean) => {
        // App Lock can only be turned on if a PIN exists (LockScreen handles first launch)
        if (value && !pin) {
            // This case should theoretically not happen if LockScreen works as intended
            Alert.alert('Security Required', 'Please set up your PIN first.');
        } else {
            setAppLockEnabled(value);
        }
    };

    const handlePinSubmit = () => {
        if (tempPin.length === 4) {
            setPin(tempPin);
            if (pinPurpose === 'set') setAppLockEnabled(true);
            setShowPinModal(false);
            setTempPin('');
            Alert.alert('Success', pinPurpose === 'set' ? 'PIN set successfully.' : 'PIN updated successfully.');
        } else {
            Alert.alert('Error', 'PIN must be 4 digits.');
        }
    };

    return (
        <ThemedView style={styles.container}>
            <View style={styles.header}>
                <ThemedText type="title">Settings</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Section title="Security">
                    <SettingRow
                        icon="lock.fill"
                        label="App Lock"
                        value={isAppLockEnabled}
                        onValueChange={handleAppLockToggle}
                        type="switch"
                    />
                    <SettingRow
                        icon="faceid"
                        label="Use Biometrics"
                        value={isBiometricsEnabled}
                        onValueChange={setBiometricsEnabled}
                        type="switch"
                    />
                    {isAppLockEnabled && (
                        <SettingRow
                            icon="key.fill"
                            label="Change PIN"
                            onPress={() => {
                                setPinPurpose('change');
                                setShowPinModal(true);
                            }}
                        />
                    )}
                </Section>

                <Section title="Appearance">
                    <SettingRow
                        icon="moon.fill"
                        label="Dark Mode"
                        value={theme === 'dark'}
                        onValueChange={(v) => setTheme(v ? 'dark' : 'light')}
                        type="switch"
                    />
                    <SettingRow
                        icon="circle.lefthalf.filled"
                        label="Use System Theme"
                        value={theme === 'system'}
                        onValueChange={(v) => setTheme(v ? 'system' : (colorScheme === 'dark' ? 'dark' : 'light'))}
                        type="switch"
                    />
                </Section>

                <Section title="Data Management">
                    <SettingRow
                        icon="trash.fill"
                        label="Clear All Data"
                        onPress={handleClearData}
                        color="#FF4444"
                    />
                </Section>

                <Section title="About">
                    <SettingRow
                        icon="info.circle.fill"
                        label="Version"
                        rightText="1.0.0"
                    />
                    <SettingRow
                        icon="star.fill"
                        label="Rate App"
                        onPress={() => { }}
                    />
                </Section>
            </ScrollView>

            {/* Simple PIN Modal */}
            <Modal
                visible={showPinModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPinModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: Colors[colorScheme].card }]}>
                        <ThemedText style={styles.modalTitle}>
                            {pinPurpose === 'set' ? 'Set App PIN' : 'Change App PIN'}
                        </ThemedText>
                        <ThemedText style={styles.modalSubtitle}>
                            Enter a 4-digit PIN to secure your app
                        </ThemedText>

                        <View style={styles.modalInputWrapper}>
                            <TextInput
                                style={[styles.modalInput, { color: Colors[colorScheme].text, borderBottomColor: Colors[colorScheme].tint }]}
                                value={tempPin}
                                onChangeText={setTempPin}
                                keyboardType="number-pad"
                                maxLength={4}
                                secureTextEntry
                                autoFocus
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: 'rgba(0,0,0,0.05)' }]}
                                onPress={() => {
                                    setShowPinModal(false);
                                    setTempPin('');
                                }}
                            >
                                <ThemedText>Cancel</ThemedText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: Colors[colorScheme].tint }]}
                                onPress={handlePinSubmit}
                            >
                                <ThemedText style={{ color: '#FFF', fontWeight: 'bold' }}>Save</ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ThemedView>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
            <View style={styles.sectionContent}>
                {children}
            </View>
        </View>
    );
}

interface SettingRowProps {
    icon: string;
    label: string;
    value?: boolean;
    onValueChange?: (v: boolean) => void;
    onPress?: () => void;
    type?: 'switch' | 'link';
    rightText?: string;
    color?: string;
}

function SettingRow({ icon, label, value, onValueChange, onPress, type, rightText, color }: SettingRowProps) {
    const colorScheme = useColorScheme() ?? 'light';

    const content = (
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: color ? `${color}15` : Colors[colorScheme].secondaryGreen }]}>
                    <IconSymbol name={icon as any} size={20} color={color || Colors[colorScheme].tint} />
                </View>
                <ThemedText style={[styles.rowLabel, color ? { color } : {}]}>{label}</ThemedText>
            </View>

            <View style={styles.rowRight}>
                {type === 'switch' ? (
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        trackColor={{ true: Colors[colorScheme].tint }}
                    />
                ) : rightText ? (
                    <ThemedText style={styles.rightText}>{rightText}</ThemedText>
                ) : (
                    <IconSymbol name="chevron.right" size={16} color={Colors[colorScheme].icon} />
                )}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        opacity: 0.5,
        marginBottom: 12,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    sectionContent: {
        backgroundColor: 'rgba(0,0,0,0.02)',
        borderRadius: 20,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rightText: {
        fontSize: 14,
        opacity: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        opacity: 0.6,
        textAlign: 'center',
        marginBottom: 24,
    },
    modalInputWrapper: {
        width: '100%',
        marginBottom: 24,
    },
    modalInput: {
        fontSize: 32,
        letterSpacing: 20,
        textAlign: 'center',
        borderBottomWidth: 2,
        paddingBottom: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    modalButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
