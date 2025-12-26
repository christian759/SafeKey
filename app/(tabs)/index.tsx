import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccountItem } from '@/components/ui/AccountItem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeCard } from '@/components/ui/SafeCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Account, getAccounts } from '@/services/database';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAccounts = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: '#F1F3F4' }]}>
          <IconSymbol name="magnifyingglass" size={18} color="#9BA1A6" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#9BA1A6"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.sortSection}>
        <ThemedText type="defaultSemiBold">Sort by</ThemedText>
        <TouchableOpacity style={styles.sortDropdown}>
          <ThemedText style={{ color: Colors[colorScheme].tint }}>Most used</ThemedText>
          <IconSymbol name="chevron.down" size={14} color={Colors[colorScheme].tint} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAccounts} tintColor={Colors[colorScheme].tint} />
        }
      >
        {accounts.length > 0 ? (
          <SafeCard>
            {accounts.map((item, index) => (
              <React.Fragment key={item.id}>
                <AccountItem
                  name={item.name}
                  email={item.email}
                  icon={item.icon}
                  onPress={() => router.push(`/details/${item.id}`)}
                />
                {index < accounts.length - 1 && <View style={[styles.separator, { backgroundColor: Colors[colorScheme].border }]} />}
              </React.Fragment>
            ))}
          </SafeCard>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No passwords saved yet.</ThemedText>
            <ThemedText style={styles.emptySubtext}>Tap the '+' button to add your first one!</ThemedText>
          </View>
        )}
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
