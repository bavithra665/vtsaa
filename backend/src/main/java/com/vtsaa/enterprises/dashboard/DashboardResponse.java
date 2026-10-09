package com.vtsaa.enterprises.dashboard;

import java.math.BigDecimal;
import java.util.List;

public record DashboardResponse(
        String month,
        String currency,
        BigDecimal monthlyExpense,
        BigDecimal monthlyProfit,
        List<CategoryTotal> categories,
        List<MonthlyTrend> monthlyTrend,
        boolean hasData,
        boolean hasTrendData,
        boolean sampleData) {

    public record CategoryTotal(String category, BigDecimal amount) {
    }

    public record MonthlyTrend(String month, BigDecimal expense) {
    }
}
