CREATE VIEW recommended_items AS
    SELECT i.*
    FROM items i
    JOIN cat_to_item ctoi ON i.item_id = ctoi.item_id
    WHERE ctoi.category_id = 1; -- 1 is the 'recommended' category

CREATE OR REPLACE VIEW undeleted_items AS
    SELECT *
    FROM items
    WHERE is_deleted = FALSE;

CREATE OR REPLACE VIEW undeleted_users AS
    SELECT *
    FROM users
    WHERE is_deleted = FALSE;