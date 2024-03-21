-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
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
