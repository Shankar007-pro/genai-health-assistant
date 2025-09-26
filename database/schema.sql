-- Enable foreign keys (uncomment if using relational integrity)
/*
PRAGMA foreign_keys = ON;
*/

CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    symptoms TEXT NOT NULL,
    history TEXT,
    vitals REAL CHECK(vitals >= 30.0 AND vitals <= 45.0), -- Body temperature in °C expected range
    language TEXT CHECK(language IN ('en', 'hi', 'ta', 'te', 'bn')) DEFAULT 'en', -- ISO 639-1 codes supported
    diagnosis TEXT NOT NULL,
    confidence INTEGER CHECK(confidence BETWEEN 0 AND 100) DEFAULT NULL, -- Confidence percentage 0-100
    drug_alert TEXT DEFAULT NULL,
    dosage TEXT DEFAULT NULL,
    referral TEXT DEFAULT NULL,
    timestamp DATETIME DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')), -- UTC ISO 8601 timestamp
    UNIQUE(id)
);

-- Indexes for performance on searches by language and timestamp
CREATE INDEX IF NOT EXISTS idx_patients_language ON patients(language);
CREATE INDEX IF NOT EXISTS idx_patients_timestamp ON patients(timestamp);
