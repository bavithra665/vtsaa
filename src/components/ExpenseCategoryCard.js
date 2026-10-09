import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { formatCurrency } from '../utils/currency';

export default function ExpenseCategoryCard({ category, amount, currency, hasData }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Ionicons name={category.icon} size={18} color={colors.navy} />
        </View>
        <Ionicons name="arrow-up-right" size={15} color={colors.muted} />
      </View>
      <Text numberOfLines={2} style={styles.title}>
        {category.title}
      </Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.amount}>
        {hasData ? formatCurrency(amount, currency) : '—'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    flexShrink: 0,
    minHeight: 140,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 11,
  },
  amount: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 3,
  },
});
