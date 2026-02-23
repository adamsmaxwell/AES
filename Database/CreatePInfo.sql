-- Table: PInfo

USE aes;

DROP TABLE IF EXISTS PInfo;

CREATE TABLE PInfo
(
    CoastPN VARCHAR(8),
    Item integer NOT NULL,
    Level integer,
    Name VARCHAR(50),
    Class VARCHAR(10),
    PerUnit integer,
    Unit VARCHAR(10),
    PartDwg VARCHAR(40),
    Rev VARCHAR(3),
    ManFSCM VARCHAR(5),
    PRIMARY KEY (CoastPN, Item)
)
