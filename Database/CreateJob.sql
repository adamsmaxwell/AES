-- Table: Job
USE aes;

DROP TABLE IF EXISTS Job;

CREATE TABLE IF NOT EXISTS Job
(
    JobNo CHAR(6) NOT NULL PRIMARY KEY,
    CoastPN CHAR(8) NOT NULL,
    CoastRev CHAR(3),
    CustPN CHAR(16),
    CustRev CHAR(15),
    CustFSCM CHAR(6) NOT NULL,
    LogDate date DEFAULT '1980-01-01',
    QtyOrd integer,
    QtyQA integer,
    QtyOS integer,
    QtySpares integer,
    Location CHAR(5),
    LocDate date  DEFAULT '1980-01-01'
);

CREATE INDEX idx_job_coastpn ON job (CoastPN, CoastRev);
CREATE INDEX idx_job_custpn ON job (CustPN, CustRev);
