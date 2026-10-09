CREATE TABLE financial_entry (
    id BIGSERIAL PRIMARY KEY,
    entry_type VARCHAR(10) NOT NULL,
    category VARCHAR(24) NOT NULL,
    amount NUMERIC(14, 2) NOT NULL CHECK (amount > 0),
    entry_date DATE NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT financial_entry_type_category_check CHECK (
        (entry_type = 'INCOME' AND category = 'INCOME')
        OR
        (entry_type = 'EXPENSE' AND category IN (
            'GENERAL',
            'ASSETS',
            'MONTHLY',
            'SALARY_ADVANCE'
        ))
    )
);

CREATE INDEX financial_entry_date_type_category_idx
    ON financial_entry (entry_date, entry_type, category);
