CREATE OR REPLACE VIEW undeleted_items AS
    SELECT *
    FROM items
    WHERE is_deleted = FALSE;

CREATE OR REPLACE VIEW undeleted_users AS
    SELECT *
    FROM users
    WHERE is_deleted = FALSE;

CREATE OR REPLACE VIEW order_items_view AS
    SELECT oi.order_id, oi.item_id, i.item_name, oi.quantity, i.price * oi.quantity AS price
    FROM order_items oi
    JOIN items i
    ON oi.item_id = i.item_id;