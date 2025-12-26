import { Colors } from '@/constants/theme';
import { useSettings } from '@/context/SettingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/icon-symbol';

export const LockScreen: React.FC = () => {
    const { setIsLocked, isBiometricsEnabled, pin, setPin, setAppLockEnabled } = useSettings();
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    const [enteredPin, setEnteredPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    const isSetupMode = !pin;

    useEffect(() => {
        if (isBiometricsEnabled && !isSetupMode) {
            handleBiometrics();
        }
    }, [isBiometricsEnabled, isSetupMode]);

    const handleBiometrics = async () => {
        if (isSetupMode) return;
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) return;

            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (!isEnrolled) return;

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authenticate to unlock SafeKey',
                fallbackLabel: 'Use PIN',
            });

            if (result.success) {
                setIsLocked(false);
            }
        } catch (error) {
            console.error('Biometric auth failed', error);
        }
    };

    const handlePinPress = async (num: string) => {
        const newPin = enteredPin + num;
        if (newPin.length <= 4) {
            setEnteredPin(newPin);

            if (newPin.length === 4) {
                if (isSetupMode) {
                    if (!isConfirming) {
                        // First PIN entered during setup
                        setConfirmPin(newPin);
                        setEnteredPin('');
                        setIsConfirming(true);
                    } else {
                        // Confirming PIN
                        if (newPin === confirmPin) {
                            await setPin(newPin);
                            await setAppLockEnabled(true);
                            setIsLocked(false);
                        } else {
                            Alert.alert('PINs do not match', 'Please try again.');
                            setEnteredPin('');
                            setConfirmPin('');
                            setIsConfirming(false);
                        }
                    }
                } else {
                    // Unlock Mode
                    if (newPin === pin) {
                        setIsLocked(false);
                    } else {
                        Alert.alert('Incorrect PIN');
                        setEnteredPin('');
                    }
                }
            }
        }
    };

    const handleDelete = () => {
        setEnteredPin(enteredPin.slice(0, -1));
    };

    const renderHeader = () => {
        if (isSetupMode) {
            return (
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: colors.secondaryGreen }]}>
                        <IconSymbol name="shield.fill" size={40} color={colors.tint} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>
                        {isConfirming ? 'Confirm PIN' : 'Secure Your Vault'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.icon }]}>
                        {isConfirming ? 'Re-enter your 4-digit PIN' : 'Create a PIN to protect your passwords'}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: colors.secondaryGreen }]}>
                    <IconSymbol name="lock.fill" size={40} color={colors.tint} />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>SafeKey Locked</Text>
                <Text style={[styles.subtitle, { color: colors.icon }]}>
                    Enter PIN to unlock your vault
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {renderHeader()}

            <View style={styles.pinDisplay}>
                {[1, 2, 3, 4].map((i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            {
                                backgroundColor: enteredPin.length >= i ? colors.tint : colors.border,
                            },
                        ]}
                    />
                ))}
            </View>

            <View style={styles.numpad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={[styles.numButton, { backgroundColor: colors.card }]}
                        onPress={() => handlePinPress(num.toString())}
                    >
                        <Text style={[styles.numText, { color: colors.text }]}>{num}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity
                    style={[styles.numButton, { backgroundColor: 'transparent' }]}
                    onPress={handleBiometrics}
                    disabled={isSetupMode}
                >
                    {!isSetupMode && <IconSymbol name="faceid" size={28} color={colors.tint} />}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.numButton, { backgroundColor: colors.card }]}
                    onPress={() => handlePinPress('0')}
                >
                    <Text style={[styles.numText, { color: colors.text }]}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.numButton, { backgroundColor: 'transparent' }]}
                    onPress={handleDelete}
                >
                    <IconSymbol name="delete.left" size={28} color={colors.icon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    pinDisplay: {
        flexDirection: 'row',
        marginBottom: 50,
    },
    dot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginHorizontal: 15,
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
    },
    numButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    numText: {
        fontSize: 24,
        fontWeight: '600',
    },
});
