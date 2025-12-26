import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeButton } from '@/components/ui/SafeButton';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PasswordGeneratorModal() {
  const colorScheme = useColorScheme() ?? 'light';
  const [length, setLength] = React.useState(27);
  const [options, setOptions] = React.useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.handle} />

      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>Generate password</ThemedText>
        <TouchableOpacity>
          <IconSymbol name="arrow.clockwise" size={20} color={Colors[colorScheme].text} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <ThemedText style={styles.password}>Adssfdyu))092347%.uPADjnjsd</ThemedText>
        <View style={[styles.badge, { backgroundColor: Colors[colorScheme].secondaryGreen }]}>
          <ThemedText style={[styles.badgeText, { color: Colors[colorScheme].tint }]}>Strong password</ThemedText>
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
          minimumTrackTintColor={Colors[colorScheme].tint}
          maximumTrackTintColor={Colors[colorScheme].border}
          thumbTintColor={Colors[colorScheme].tint}
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
        <SafeButton title="Use Password" onPress={() => { }} />
      </View>
    </ThemedView>
  );
}

function OptionToggle({ label, enabled, onPress }: { label: string, enabled: boolean, onPress: () => void }) {
  const colorScheme = useColorScheme() ?? 'light';
  return (
    <TouchableOpacity
      style={[
        styles.option,
        { backgroundColor: enabled ? Colors[colorScheme].secondaryGreen : Colors[colorScheme].card }
      ]}
      onPress={onPress}
    >
      <View style={[styles.checkbox, { backgroundColor: enabled ? Colors[colorScheme].tint : 'transparent', borderColor: Colors[colorScheme].tint }]}>
        {enabled && <IconSymbol name="checkmark" size={12} color="#FFF" />}
      </View>
      <ThemedText style={[styles.optionText, { color: Colors[colorScheme].text }]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
  },
  passwordContainer: {
    marginBottom: 32,
  },
  password: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  sliderSection: {
    marginBottom: 32,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    opacity: 0.6,
  },
  lengthValue: {
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    width: '48%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 20,
  }
});
