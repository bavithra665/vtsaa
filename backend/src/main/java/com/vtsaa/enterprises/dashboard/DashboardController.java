package com.vtsaa.enterprises.dashboard;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    private static final DateTimeFormatter MONTH_FORMAT =
            DateTimeFormatter.ofPattern("uuuu-MM").withResolverStyle(ResolverStyle.STRICT);

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(@RequestParam(required = false) String month) {
        YearMonth requestedMonth;
        try {
            requestedMonth = month == null ? YearMonth.now() : YearMonth.parse(month, MONTH_FORMAT);
        } catch (DateTimeParseException exception) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "month must use the YYYY-MM format."));
        }

        return ResponseEntity.ok(dashboardService.getDashboard(requestedMonth));
    }
}
