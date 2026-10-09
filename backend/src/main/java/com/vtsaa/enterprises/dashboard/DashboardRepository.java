package com.vtsaa.enterprises.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DashboardRepository {
    private final JdbcTemplate jdbcTemplate;

    public DashboardRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Summary summarize(LocalDate start, LocalDate end) {
        return jdbcTemplate.queryForObject(
                """
                SELECT
                    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'EXPENSE'), 0)::numeric(14, 2)
                        AS monthly_expense,
                    COALESCE(SUM(amount) FILTER (WHERE entry_type = 'INCOME'), 0)::numeric(14, 2)
                        AS monthly_income,
                    COUNT(*) AS entry_count
                FROM financial_entry
                WHERE entry_date >= ? AND entry_date < ?
                """,
                (resultSet, rowNumber) -> new Summary(
                        resultSet.getBigDecimal("monthly_expense"),
                        resultSet.getBigDecimal("monthly_income"),
                        resultSet.getLong("entry_count")),
                start,
                end);
    }

    public Map<String, BigDecimal> expensesByCategory(LocalDate start, LocalDate end) {
        Map<String, BigDecimal> amounts = new HashMap<>();
        jdbcTemplate.query(
                """
                SELECT category, SUM(amount)::numeric(14, 2) AS amount
                FROM financial_entry
                WHERE entry_type = 'EXPENSE'
                    AND entry_date >= ? AND entry_date < ?
                GROUP BY category
                """,
                (resultSet, rowNumber) -> {
                    amounts.put(
                            resultSet.getString("category"),
                            resultSet.getBigDecimal("amount"));
                    return null;
                },
                start,
                end);
        return amounts;
    }

    public Map<YearMonth, BigDecimal> monthlyExpenses(LocalDate start, LocalDate end) {
        Map<YearMonth, BigDecimal> amounts = new HashMap<>();
        jdbcTemplate.query(
                """
                SELECT DATE_TRUNC('month', entry_date)::date AS expense_month,
                    SUM(amount)::numeric(14, 2) AS amount
                FROM financial_entry
                WHERE entry_type = 'EXPENSE'
                    AND entry_date >= ? AND entry_date < ?
                GROUP BY DATE_TRUNC('month', entry_date)::date
                """,
                (resultSet, rowNumber) -> {
                    amounts.put(
                            YearMonth.from(resultSet.getDate("expense_month").toLocalDate()),
                            resultSet.getBigDecimal("amount"));
                    return null;
                },
                start,
                end);
        return amounts;
    }

    public boolean hasSampleData(LocalDate start, LocalDate end) {
        Boolean found = jdbcTemplate.queryForObject(
                """
                SELECT EXISTS (
                    SELECT 1
                    FROM financial_entry
                    WHERE is_sample = TRUE AND entry_date >= ? AND entry_date < ?
                )
                """,
                Boolean.class,
                start,
                end);
        return Boolean.TRUE.equals(found);
    }

    public record Summary(BigDecimal expense, BigDecimal income, long entryCount) {
    }
}
