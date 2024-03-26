-- Create articles_tags table
CREATE TABLE IF NOT EXISTS articles_tags (
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
