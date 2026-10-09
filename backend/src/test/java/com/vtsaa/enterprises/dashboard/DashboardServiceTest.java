package com.vtsaa.enterprises.dashboard;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.Map;

import org.junit.jupiter.api.Test;

class DashboardServiceTest {
    @Test
    void buildsMonthlyTotalsAndSixMonthTrend() {
        DashboardRepository repository = mock(DashboardRepository.class);
        YearMonth month = YearMonth.of(2026, 10);
        when(repository.summarize(month.atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(new DashboardRepository.Summary(
                        new BigDecimal("184500.00"),
                        new BigDecimal("250000.00"),
                        12));
        when(repository.expensesByCategory(month.atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(Map.of("GENERAL", new BigDecimal("24500.00")));
        when(repository.monthlyExpenses(month.minusMonths(5).atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(Map.of(month, new BigDecimal("184500.00")));
        when(repository.hasSampleData(month.minusMonths(5).atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(true);

        DashboardResponse response = new DashboardService(repository, "INR").getDashboard(month);

        assertEquals("2026-10", response.month());
        assertEquals("INR", response.currency());
        assertEquals(new BigDecimal("184500.00"), response.monthlyExpense());
        assertEquals(new BigDecimal("65500.00"), response.monthlyProfit());
        assertEquals(4, response.categories().size());
        assertEquals(new BigDecimal("24500.00"), response.categories().get(0).amount());
        assertEquals(6, response.monthlyTrend().size());
        assertEquals("2026-05", response.monthlyTrend().get(0).month());
        assertEquals("2026-10", response.monthlyTrend().get(5).month());
        assertTrue(response.hasData());
        assertTrue(response.hasTrendData());
        assertTrue(response.sampleData());
    }

    @Test
    void returnsEmptyTotalsWhenThereAreNoRecords() {
        DashboardRepository repository = mock(DashboardRepository.class);
        YearMonth month = YearMonth.of(2026, 10);
        when(repository.summarize(month.atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(new DashboardRepository.Summary(
                        BigDecimal.ZERO,
                        BigDecimal.ZERO,
                        0));
        when(repository.expensesByCategory(month.atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(Map.of());
        when(repository.monthlyExpenses(month.minusMonths(5).atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(Map.of());
        when(repository.hasSampleData(month.minusMonths(5).atDay(1), month.plusMonths(1).atDay(1)))
                .thenReturn(false);

        DashboardResponse response = new DashboardService(repository, "INR").getDashboard(month);

        assertEquals(BigDecimal.ZERO, response.monthlyExpense());
        assertEquals(BigDecimal.ZERO, response.monthlyProfit());
        assertFalse(response.hasData());
        assertFalse(response.hasTrendData());
        assertFalse(response.sampleData());
        assertEquals(4, response.categories().size());
        assertEquals(6, response.monthlyTrend().size());
    }
}
