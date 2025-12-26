import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AccountItem } from '@/components/ui/AccountItem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SafeCard } from '@/components/ui/SafeCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Account, getAccounts } from '@/services/database';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadAccounts = useCallback(async () => {
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
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const filteredAccounts = accounts.filter(acc =>
    acc.name.toLowerCase().includes(search.toLowerCase()) ||
    acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colorScheme === 'dark' ? '#1C1F21' : '#F1F3F4' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor={colors.icon}
            style={[styles.searchInput, { color: colors.text }]}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.sortSection}>
        <ThemedText type="defaultSemiBold" style={styles.sortTitle}>Sort by</ThemedText>
        <TouchableOpacity style={styles.sortDropdown}>
          <ThemedText style={{ color: colors.tint, fontWeight: '600', fontSize: 13 }}>Most used</ThemedText>
          <IconSymbol name="chevron.down" size={12} color={colors.tint} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadAccounts} tintColor={colors.tint} />
        }
      >
        {filteredAccounts.length > 0 ? (
          <SafeCard>
            <View style={styles.cardContent}>
              {filteredAccounts.map((item, index) => (
                <React.Fragment key={item.id}>
                  <AccountItem
                    name={item.name}
                    email={item.email}
                    icon={item.icon}
                    onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.id } } as any)}
                  />
                  {index < filteredAccounts.length - 1 && <View style={[styles.separator, { backgroundColor: colors.border }]} />}
                </React.Fragment>
              ))}
            </View>
          </SafeCard>
        ) : (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              {search ? 'No matches found' : 'No passwords saved yet'}
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              {search ? 'Try a different search term' : 'Tap the "+" button to add your first one!'}
            </ThemedText>
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
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  sortSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginBottom: 20,
  },
  sortTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  cardContent: {
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    width: '100%',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
