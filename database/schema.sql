CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symptoms TEXT NOT NULL,
    history TEXT,
    vitals REAL,
    language TEXT,
    diagnosis TEXT,
    confidence INTEGER,
    drug_alert TEXT,
    dosage TEXT,
    referral TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
