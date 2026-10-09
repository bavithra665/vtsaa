package com.vtsaa.enterprises.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private static final List<String> EXPENSE_CATEGORIES = List.of(
            "GENERAL",
            "ASSETS",
            "MONTHLY",
            "SALARY_ADVANCE");

    private final DashboardRepository dashboardRepository;
    private final String currency;

    public DashboardService(
            DashboardRepository dashboardRepository,
            @Value("${vtsaa.dashboard.currency:INR}") String currency) {
        this.dashboardRepository = dashboardRepository;
        this.currency = currency;
    }

    public DashboardResponse getDashboard(YearMonth month) {
        LocalDate monthStart = month.atDay(1);
        LocalDate nextMonthStart = month.plusMonths(1).atDay(1);
        DashboardRepository.Summary summary =
                dashboardRepository.summarize(monthStart, nextMonthStart);

        Map<String, BigDecimal> categoryAmounts =
                dashboardRepository.expensesByCategory(monthStart, nextMonthStart);
        List<DashboardResponse.CategoryTotal> categories = EXPENSE_CATEGORIES.stream()
                .map(category -> new DashboardResponse.CategoryTotal(
                        category,
                        categoryAmounts.getOrDefault(category, BigDecimal.ZERO)))
                .toList();

        YearMonth firstTrendMonth = month.minusMonths(5);
        Map<YearMonth, BigDecimal> trendAmounts = dashboardRepository.monthlyExpenses(
                firstTrendMonth.atDay(1),
                nextMonthStart);
        List<DashboardResponse.MonthlyTrend> trend = new ArrayList<>(6);
        boolean hasTrendData = false;

        for (int offset = 0; offset < 6; offset++) {
            YearMonth trendMonth = firstTrendMonth.plusMonths(offset);
            BigDecimal expense = trendAmounts.getOrDefault(trendMonth, BigDecimal.ZERO);
            hasTrendData |= expense.signum() > 0;
            trend.add(new DashboardResponse.MonthlyTrend(trendMonth.toString(), expense));
        }

        return new DashboardResponse(
                month.toString(),
                currency,
                summary.expense(),
                summary.income().subtract(summary.expense()),
                categories,
                trend,
                summary.entryCount() > 0,
                hasTrendData,
                dashboardRepository.hasSampleData(firstTrendMonth.atDay(1), nextMonthStart));
    }
}
