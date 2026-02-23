-- Table: Customer
USE aes;

DROP TABLE IF EXISTS Customer;

CREATE TABLE IF NOT EXISTS Customer
(
    Name VARCHAR(31) PRIMARY KEY,
    SName VARCHAR(10),
    FSCM character(5) UNIQUE NOT NULL,
    Telex VARCHAR(15),
    Hold character(5),
    Commission_FSCM CHAR(5),
    Commission_PCT real,
    Credit float,
    CreditLimit float,
    Terms integer,
    Percent integer
);
