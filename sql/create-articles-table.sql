-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
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
