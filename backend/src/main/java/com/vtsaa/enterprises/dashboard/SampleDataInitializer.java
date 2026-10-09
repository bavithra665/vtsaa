package com.vtsaa.enterprises.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "vtsaa.dashboard.sample-data.enabled", havingValue = "true")
public class SampleDataInitializer implements ApplicationRunner {
    private static final List<SampleMonth> SAMPLE_MONTHS = List.of(
            new SampleMonth("180000", "18600", "0", "52000", "8000"),
            new SampleMonth("195000", "21200", "32000", "52000", "7000"),
            new SampleMonth("205000", "19950", "0", "54000", "12000"),
            new SampleMonth("225000", "24500", "12500", "54000", "10000"),
            new SampleMonth("240000", "22600", "0", "57000", "11000"),
            new SampleMonth("250000", "24500", "85000", "63000", "12000"));

    private final JdbcTemplate jdbcTemplate;

    public SampleDataInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        Long existingEntries = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM financial_entry",
                Long.class);
        if (existingEntries != null && existingEntries > 0) {
            return;
        }

        for (int offset = 0; offset < SAMPLE_MONTHS.size(); offset++) {
            SampleMonth sample = SAMPLE_MONTHS.get(offset);
            LocalDate entryDate = YearMonth.now()
                    .minusMonths(SAMPLE_MONTHS.size() - offset - 1L)
                    .atDay(15);

            insert("INCOME", "INCOME", sample.income(), entryDate);
            insert("EXPENSE", "GENERAL", sample.general(), entryDate);
            insert("EXPENSE", "ASSETS", sample.assets(), entryDate);
            insert("EXPENSE", "MONTHLY", sample.monthly(), entryDate);
            insert("EXPENSE", "SALARY_ADVANCE", sample.salaryAdvance(), entryDate);
        }
    }

    private void insert(String type, String category, String amount, LocalDate entryDate) {
        jdbcTemplate.update(
                """
                INSERT INTO financial_entry (entry_type, category, amount, entry_date, is_sample)
                VALUES (?, ?, ?, ?, TRUE)
                """,
                type,
                category,
                new BigDecimal(amount),
                entryDate);
    }

    private record SampleMonth(
            String income,
            String general,
            String assets,
            String monthly,
            String salaryAdvance) {
    }
}
