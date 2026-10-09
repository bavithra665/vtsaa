import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { formatCurrency } from '../utils/currency';

function shortMonth(value) {
  return new Date(`${value}-02T12:00:00`).toLocaleDateString('en-IN', { month: 'short' });
}

export function ProfitCard({ amount, currency, hasData }) {
  return (
    <View style={styles.profitCard}>
      <View style={styles.profitIcon}>
        <Ionicons name="trending-up-outline" size={15} color={colors.navy} />
      </View>
      <Text style={styles.profitLabel}>Monthly profit</Text>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.profitAmount}>
        {hasData ? formatCurrency(amount, currency) : '—'}
      </Text>
    </View>
  );
}

export default function MonthlyExpenseChart({ trend, currency, hasData }) {
  const maxAmount = Math.max(...trend.map((month) => month.expense), 0);

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeading}>
        <View style={styles.legend}>
          <View style={styles.legendMark} />
          <Text style={styles.legendText}>Expenses</Text>
        </View>
        <Text style={styles.currencyLabel}>{currency}</Text>
      </View>
      <View style={styles.chart}>
        <View style={styles.gridLine} />
        <View style={[styles.gridLine, styles.middleLine]} />
        <View style={[styles.gridLine, styles.baseLine]} />
        {trend.map((month) => {
          const height = maxAmount === 0 ? 0 : Math.max((month.expense / maxAmount) * 100, 4);

          return (
            <View key={month.month} style={styles.barColumn}>
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${height}%` }]} />
              </View>
              <Text style={styles.monthLabel}>{shortMonth(month.month)}</Text>
            </View>
          );
        })}
      </View>
      {!hasData ? (
        <Text style={styles.emptyChart}>No expense records for this period</Text>
      ) : (
        <Text style={styles.axisHint}>
          {formatCurrency(maxAmount, currency)} highest month
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profitCard: {
    width: 112,
    minHeight: 112,
    borderRadius: 18,
    padding: 13,
    backgroundColor: colors.navy,
    justifyContent: 'space-between',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 3,
  },
  profitIcon: {
    width: 27,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  profitLabel: {
    color: '#D6E1F1',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
  profitAmount: {
    color: colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 2,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 15,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 13,
  },
  chartHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendMark: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.blue,
    marginRight: 7,
  },
  legendText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: '600',
  },
  currencyLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '700',
  },
  chart: {
    height: 137,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  middleLine: {
    top: 58,
  },
  baseLine: {
    top: 108,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  barTrack: {
    height: 108,
    width: '58%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 2,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: colors.blue,
  },
  monthLabel: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 7,
  },
  emptyChart: {
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
  },
  axisHint: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 7,
  },
});
