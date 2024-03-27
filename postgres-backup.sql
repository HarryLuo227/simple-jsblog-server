-- Create blog database
CREATE DATABASE jsblog
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

\connect jsblog;

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
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

INSERT INTO users(fullname, account, password, birth) VALUES('tester', 'tester@example.com', '123456', '2000-01-01');

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id SERIAL NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name),
    PRIMARY KEY (id)
);

COMMENT ON COLUMN tags.id IS 'Tag ID';
COMMENT ON COLUMN tags.name IS 'Tag name';
COMMENT ON COLUMN tags.created_at IS 'Timestamp of tag created';
COMMENT ON COLUMN tags.modified_at IS 'Timestamp of tag modified';

INSERT INTO tags(name) VALUES('nodejs');
INSERT INTO tags(name) VALUES('express');
INSERT INTO tags(name) VALUES('postgresql');
INSERT INTO tags(name) VALUES('redis');

-- Create articles table
CREATE TABLE IF NOT EXISTS public.articles (
    id SERIAL NOT NULL,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    content TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by INTEGER NOT NULL DEFAULT 1 REFERENCES users(id),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (title, created_by),
    PRIMARY KEY (id)
);

COMMENT ON COLUMN articles.id IS 'Article ID';
COMMENT ON COLUMN articles.title IS 'Article title';
COMMENT ON COLUMN articles.description IS 'Article description';
COMMENT ON COLUMN articles.content IS 'Article content';
COMMENT ON COLUMN articles.created_at IS 'Timestamp of tag created';
COMMENT ON COLUMN articles.created_by IS 'Article creator''s ID, must exists in users table';
COMMENT ON COLUMN articles.modified_at IS 'Timestamp of tag modified';

-- Create articles_tags table
CREATE TABLE IF NOT EXISTS public.articles_tags (
    id SERIAL NOT NULL,
    articles_id INTEGER NOT NULL REFERENCES articles(id),
    tags_id INTEGER NOT NULL REFERENCES tags(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    modified_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(articles_id, tags_id),
    PRIMARY KEY(id)
);

COMMENT ON COLUMN articles_tags.id IS 'The ID of articles'' tag of record';
COMMENT ON COLUMN articles_tags.articles_id IS 'Article ID';
COMMENT ON COLUMN articles_tags.tags_id IS 'Tag ID';
COMMENT ON COLUMN articles_tags.created_at IS 'Timestamp of tag created';
COMMENT ON COLUMN articles_tags.modified_at IS 'Timestamp of tag modified';
