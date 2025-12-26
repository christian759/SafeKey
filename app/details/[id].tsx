```
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Account, deleteAccount, getAccountById } from '@/services/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View, ScrollView, Clipboard } from 'react-native';

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

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [account, setAccount] = useState<Account | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadAccount();
  }, [id]);

  const loadAccount = async () => {
    const data = await getAccountById(Number(id));
    setAccount(data);
  };

  const getIconInfo = () => {
    const icon = account?.icon?.toLowerCase() || '';
    const name = account?.name?.toLowerCase() || '';
    for (const brand in BRAND_COLORS) {
      if (icon.includes(brand) || name.includes(brand)) {
        return { name: `logo - ${ brand } `, color: BRAND_COLORS[brand] };
      }
    }
    return { name: 'person.circle.fill', color: colors.tint };
  };

  const iconInfo = getIconInfo();

  const handleCopy = (text?: string) => {
    if (text) {
      Clipboard.setString(text);
      Alert.alert('Copied', 'Copied to clipboard!');
    }
  };

  if (!account) return null;

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Delete Account', 'Are you sure?', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                  await deleteAccount(account.id);
                  router.back();
                },
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
