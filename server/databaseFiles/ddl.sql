CREATE TABLE expense(
    id TEXT PRIMARY KEY,
    concept varchar(128),
    type varchar(32),
    date Date,
    dollars float,
    bolivares float,
    change_rate float
);

create table resident(
    id TEXT PRIMARY KEY,
    identification varchar(128) UNIQUE NOT NULL,
    name varchar(128) NOT NULL
);
CREATE TABLE property(
    id TEXT PRIMARY KEY,
    owner_id varchar(128),
    symbol varchar(32) UNIQUE NOT NULL,
    floor int not null,
    balance float not null default 0,
    debt float not null default 0,
    FOREIGN KEY(owner_id) references "resident"(id)
);

CREATE TABLE property_transaction(
    id TEXT,
    property_id TEXT,
    concept varchar(128),
    type varchar(32),
    date Date,
    dollars float,
    bolivares float,
    change_rate float,
    PRIMARY KEY(id, property_id),
    FOREIGN KEY(property_id) references"property"(id)
);

CREATE TABLE charge_transaction(
    transaction_id TEXT,
    property_id TEXT,
    status TEXT, -- PENDING - PAYED
    dollars_payed float,
    PRIMARY KEY(transaction_id, property_id),
    FOREIGN KEY(transaction_id, property_id) REFERENCES "property_transaction"(id, property_id)
);

CREATE TABLE charge_payment(
    id TEXT,
    transaction_id TEXT,
    property_id TEXT,
    dollars float,
    date Date,
    PRIMARY KEY(id, transaction_id, property_id),
    FOREIGN KEY(transaction_id, property_id) REFERENCES "property_transaction"(id, property_id)
);
