import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchDashboard } from '../api/dashboard';
import BottomTabBar from '../components/BottomTabBar';
import ExpenseCategoryCard from '../components/ExpenseCategoryCard';
import MonthlyExpenseChart, { ProfitCard } from '../components/MonthlyExpenseChart';
import { colors } from '../theme';

const expenseCategories = [
  { id: 'GENERAL', title: 'General expense', icon: 'receipt-outline' },
  { id: 'ASSETS', title: 'Assets', icon: 'cube-outline' },
  { id: 'MONTHLY', title: 'Monthly expense', icon: 'calendar-clear-outline' },
  { id: 'SALARY_ADVANCE', title: 'Salary advance', icon: 'wallet-outline' },
];

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function ProfileMenu({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable accessibilityLabel="Close profile menu" style={styles.modalBackdrop} onPress={onClose}>
        <View style={styles.profileMenu}>
          <Text style={styles.profileMenuText}>My Profile</Text>
        </View>
      </Pressable>
    </Modal>
  );
}

function HomeHeader({ onOpenProfile }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open profile menu"
        onPress={onOpenProfile}
        style={styles.avatar}
      >
        <Text style={styles.avatarLetter}>E</Text>
      </Pressable>
      <View style={styles.greeting}>
        <Text style={styles.greetingEyebrow}>Welcome</Text>
        <Text numberOfLines={1} style={styles.greetingName}>
          Edhayachandran!
        </Text>
      </View>
    </View>
  );
}

function DashboardMessage({ loading, error, onRetry }) {
  if (loading) {
    return (
      <View style={styles.messageCard}>
        <ActivityIndicator color={colors.navy} size="small" />
        <Text style={styles.messageText}>Loading dashboard</Text>
      </View>
    );
  }

  if (!error) {
    return null;
  }

  return (
    <View accessibilityRole="alert" style={styles.errorCard}>
      <Ionicons name="alert-circle-outline" size={20} color="#A74343" />
      <View style={styles.errorBody}>
        <Text style={styles.errorTitle}>Dashboard data unavailable</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const month = currentMonth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileVisible, setProfileVisible] = useState(false);
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => setRequestVersion((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchDashboard(month, controller.signal);
        setDashboard(result);
      } catch (requestError) {
        if (!controller.signal.aborted) {
          setDashboard(null);
          setError(requestError instanceof Error ? requestError.message : 'Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => controller.abort();
  }, [month, requestVersion]);

  const categoryAmounts = new Map(
    (dashboard?.categories ?? []).map((category) => [category.category, category.amount]),
  );
  const hasData = dashboard?.hasData === true;
  const monthLabel = new Date(`${month}-02T12:00:00`).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <HomeHeader onOpenProfile={() => setProfileVisible(true)} />
      {dashboard?.sampleData ? (
        <View style={styles.sampleBadge}>
          <View style={styles.sampleDot} />
          <Text style={styles.sampleLabel}>SAMPLE DATA</Text>
        </View>
      ) : null}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DashboardMessage loading={loading} error={error} onRetry={retry} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Monthly expense</Text>
            <Text style={styles.monthLabel}>{monthLabel}</Text>
          </View>
          <ProfitCard
            amount={dashboard?.monthlyProfit ?? 0}
            currency={dashboard?.currency ?? 'INR'}
            hasData={hasData && dashboard?.monthlyProfit != null}
          />
        </View>

        <MonthlyExpenseChart
          trend={dashboard?.monthlyTrend ?? []}
          currency={dashboard?.currency ?? 'INR'}
          hasData={dashboard?.hasTrendData === true}
        />

        <View style={styles.categoryHeading}>
          <Text style={styles.sectionTitle}>Expenses</Text>
        </View>
        <View style={styles.categoryGrid}>
          {expenseCategories.map((category) => (
            <ExpenseCategoryCard
              key={category.id}
              category={category}
              amount={categoryAmounts.get(category.id) ?? 0}
              currency={dashboard?.currency ?? 'INR'}
              hasData={hasData}
            />
          ))}
        </View>
      </ScrollView>
      <BottomTabBar />
      <ProfileMenu visible={profileVisible} onClose={() => setProfileVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 21,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.navy,
  },
  avatarLetter: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
  },
  greeting: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  greetingEyebrow: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
  },
  greetingName: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  sampleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 21,
    marginBottom: 5,
    gap: 5,
  },
  sampleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D08A2F',
  },
  sampleLabel: {
    color: '#9A6422',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionTitle: {
    color: colors.navy,
    fontSize: 18,
    fontWeight: '700',
  },
  monthLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  categoryHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 11,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 13,
    marginBottom: 14,
  },
  messageText: {
    color: colors.muted,
    fontSize: 12,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderColor: '#F0D5D5',
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: '#FFF9F8',
    padding: 13,
    marginBottom: 14,
  },
  errorBody: {
    flex: 1,
  },
  errorTitle: {
    color: '#8C3333',
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    color: '#7B5555',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingTop: 8,
  },
  retryLabel: {
    color: colors.navy,
    fontSize: 11,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(13, 29, 51, 0.12)',
    paddingTop: 92,
    paddingLeft: 20,
  },
  profileMenu: {
    width: 172,
    borderRadius: 14,
    backgroundColor: colors.white,
    paddingVertical: 15,
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 5,
  },
  profileMenuText: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '600',
  },
});
