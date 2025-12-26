import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeButton } from '@/components/ui/SafeButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Clipboard, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PasswordGeneratorModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [length, setLength] = useState(27);
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (characters === '') {
      setPassword('');
      return;
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(result);
  }, [length, options]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStrength = () => {
    if (length < 8) return { label: 'Weak', color: '#FF4444' };
    if (length < 12) return { label: 'Medium', color: '#FFA500' };
    return { label: 'Strong password', color: colors.tint };
  };

  const strength = getStrength();

  const handleUsePassword = () => {
    Clipboard.setString(password);
    Alert.alert('Success', 'Password copied to clipboard!');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>Generate password</ThemedText>
        <TouchableOpacity onPress={generatePassword}>
          <IconSymbol name="arrow.clockwise" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <ThemedText style={[styles.password, { color: colors.text }]}>{password}</ThemedText>
        <View style={[styles.badge, { backgroundColor: `${strength.color}15` }]}>
          <ThemedText style={[styles.badgeText, { color: strength.color }]}>{strength.label}</ThemedText>
        </View>
      </View>

      <View style={styles.sliderSection}>
        <View style={styles.sliderHeader}>
          <ThemedText style={styles.label}>Password length</ThemedText>
          <ThemedText style={styles.lengthValue}>{length}</ThemedText>
        </View>
        <Slider
          style={styles.slider}
          minimumValue={8}
          maximumValue={50}
          value={length}
          onValueChange={v => setLength(Math.round(v))}
          minimumTrackTintColor={colors.tint}
          maximumTrackTintColor={colors.border}
          thumbTintColor={colors.tint}
        />
      </View>

      <View style={styles.optionsGrid}>
        <OptionToggle
          label="Uppercase"
          enabled={options.uppercase}
          onPress={() => toggleOption('uppercase')}
        />
        <OptionToggle
          label="Lowercase"
          enabled={options.lowercase}
          onPress={() => toggleOption('lowercase')}
        />
        <OptionToggle
          label="Numbers"
          enabled={options.numbers}
          onPress={() => toggleOption('numbers')}
        />
        <OptionToggle
          label="Symbol"
          enabled={options.symbols}
          onPress={() => toggleOption('symbols')}
        />
      </View>

      <View style={styles.footer}>
        <SafeButton title="Use Password" onPress={handleUsePassword} />
      </View>
    </ThemedView>
  );
}

function OptionToggle({ label, enabled, onPress }: { label: string, enabled: boolean, onPress: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: enabled ? colors.secondaryGreen : colors.card, borderColor: enabled ? colors.tint : colors.border }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, { backgroundColor: enabled ? colors.tint : 'transparent', borderColor: enabled ? colors.tint : colors.icon }]}>
        {enabled && <IconSymbol name="checkmark" size={12} color="#FFF" />}
      </View>
      <ThemedText style={[styles.optionText, { color: colors.text }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  passwordContainer: {
    marginBottom: 40,
  },
  password: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sliderSection: {
    marginBottom: 40,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    opacity: 0.6,
  },
  lengthValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    width: '48%',
    borderWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 30,
  }
});
