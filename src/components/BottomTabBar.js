import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme';

const tabs = [
  { label: 'Home', icon: 'home-outline', selected: true },
  { label: 'Employee details', icon: 'people-outline', selected: false },
  { label: 'Attendance', icon: 'calendar-outline', selected: false },
  { label: 'Report', icon: 'bar-chart-outline', selected: false },
];

export default function BottomTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {tabs.map((tab) => (
        <View
          key={tab.label}
          accessible
          accessibilityRole="tab"
          accessibilityState={{ selected: tab.selected }}
          accessibilityLabel={tab.label}
          style={styles.tab}
        >
          <Ionicons
            name={tab.icon}
            size={20}
            color={tab.selected ? colors.navy : colors.muted}
          />
          <Text numberOfLines={2} style={[styles.label, tab.selected && styles.selectedLabel]}>
            {tab.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 11,
    paddingHorizontal: 6,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    paddingVertical: 2,
    gap: 4,
  },
  label: {
    color: colors.muted,
    fontSize: 9,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedLabel: {
    color: colors.navy,
    fontWeight: '700',
  },
});
