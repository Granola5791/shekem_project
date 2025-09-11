CREATE OR REPLACE VIEW undeleted_items AS
    SELECT *
    FROM items
    WHERE is_deleted = FALSE;

CREATE OR REPLACE VIEW undeleted_users AS
    SELECT *
    FROM users
    WHERE is_deleted = FALSE;