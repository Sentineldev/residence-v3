CREATE TABLE expense(
    id TEXT PRIMARY KEY,
    concept varchar(128),
    type varchar(32),
    date Date,
    dollars float,
    bolivares float,
    change_rate float
);