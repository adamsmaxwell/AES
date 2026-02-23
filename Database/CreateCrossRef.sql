-- Table: public.cross_ref

USE aes;

DROP TABLE IF EXISTS CrossRef;

CREATE TABLE IF NOT EXISTS CrossRef
(
    CoastPN VARCHAR(8) NOT NULL,
    CoastRev VARCHAR(3),
    Name VARCHAR(20),
    Eng CHAR(6),
    Date Date DEFAULT '1980-01-01',
    FSCM CHAR(5),
    CustPN VARCHAR(16),
    CustRev VARCHAR(15)
);

CREATE INDEX ix_CrossRef_CoastPN ON CrossRef (CoastPN, CoastRev);
CREATE INDEX ix_CrossRef_CustPN ON CrossRef (CustPN, CustRev);

