-- Create users table
CREATE TABLE users (
    id SERIAL NOT NULL,
    fullname TEXT NOT NULL,
    account TEXT NOT NULL,
    password TEXT NOT NULL,
    birth DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (account),
    PRIMARY KEY (id)
);
