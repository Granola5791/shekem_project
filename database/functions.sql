CREATE OR REPLACE FUNCTION get_hashed_password(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_hashed_password VARCHAR(255);
BEGIN
   SELECT hashed_password INTO ret_hashed_password 
   FROM undeleted_users
   WHERE username = username_param;

   RETURN ret_hashed_password;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_salt(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_salt VARCHAR(255);
BEGIN
   SELECT salt INTO ret_salt 
   FROM undeleted_users
   WHERE username = username_param;

   RETURN ret_salt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_role(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_user_role VARCHAR(255);
BEGIN
   SELECT user_role INTO ret_user_role 
   FROM undeleted_users
   WHERE username = username_param;

   RETURN ret_user_role;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION user_exists(username_param VARCHAR(50)) 
RETURNS BOOLEAN AS $$
DECLARE
   ret_user_exists BOOLEAN;
BEGIN
   SELECT EXISTS(SELECT 1 FROM users WHERE username = username_param) INTO ret_user_exists;
   RETURN ret_user_exists;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_id(username_param VARCHAR(50)) 
RETURNS INT AS $$
DECLARE
   ret_user_id INT;
BEGIN
   SELECT user_id INTO ret_user_id 
   FROM undeleted_users
   WHERE username = username_param;

   RETURN ret_user_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_search_items_page(search_term VARCHAR(50), offset_param INT, limit_param INT)
RETURNS TABLE(item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
   RETURN QUERY
   SELECT i.item_id, i.item_name, i.price, i.stock
   FROM undeleted_items i
   WHERE i.item_name ILIKE '%' || search_term || '%' OR i.item_id::TEXT = search_term
   ORDER BY i.item_name
   OFFSET offset_param LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_items_page(search_term VARCHAR(50), sort_by_column VARCHAR(50), is_ascending BOOLEAN, offset_param INT, limit_param INT)
RETURNS TABLE(item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
   RETURN QUERY
   SELECT i.item_id, i.item_name, i.price, i.stock
   FROM undeleted_items i
   WHERE i.item_name ILIKE '%' || search_term || '%' OR i.item_id::TEXT = search_term
   ORDER BY
    CASE WHEN sort_by_column = 'price' AND is_ascending THEN i.price END ASC,
    CASE WHEN sort_by_column = 'price' AND NOT is_ascending THEN i.price END DESC,
    CASE WHEN sort_by_column = 'item_name' AND is_ascending THEN i.item_name END ASC,
    CASE WHEN sort_by_column = 'item_name' AND NOT is_ascending THEN i.item_name END DESC
   OFFSET offset_param LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_items_page(search_term VARCHAR(50), category_id_param INT, offset_param INT, limit_param INT)
RETURNS TABLE(item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
   RETURN QUERY
   SELECT i.item_id, i.item_name, i.price, i.stock
   FROM undeleted_items i
   WHERE is_item_of_category(i.item_id, category_id_param) AND (i.item_name ILIKE '%' || search_term || '%' OR i.item_id::TEXT = search_term)
   ORDER BY i.item_name
   OFFSET offset_param LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_items_page(search_term VARCHAR(50), category_id_param INT, sort_by_column VARCHAR(50), is_ascending BOOLEAN, offset_param INT, limit_param INT)
RETURNS TABLE(item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
   RETURN QUERY
   SELECT i.item_id, i.item_name, i.price, i.stock
   FROM undeleted_items i
   WHERE is_item_of_category(i.item_id, category_id_param) AND (i.item_name ILIKE '%' || search_term || '%' OR i.item_id::TEXT = search_term)
   ORDER BY
    CASE WHEN sort_by_column = 'price' AND is_ascending THEN i.price END ASC,
    CASE WHEN sort_by_column = 'price' AND NOT is_ascending THEN i.price END DESC,
    CASE WHEN sort_by_column = 'item_name' AND is_ascending THEN i.item_name END ASC,
    CASE WHEN sort_by_column = 'item_name' AND NOT is_ascending THEN i.item_name END DESC
   OFFSET offset_param LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_items_count(search_term VARCHAR(50))
RETURNS INT AS $$
DECLARE 
    cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt
    FROM undeleted_items
    WHERE item_name ILIKE '%' || search_term || '%' OR item_id::TEXT = search_term;
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_items_count(search_term VARCHAR(50), category_id_param INT)
RETURNS INT AS $$
DECLARE 
    cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt
    FROM undeleted_items i
    WHERE is_item_of_category(i.item_id, category_id_param) AND (i.item_name ILIKE '%' || search_term || '%' OR i.item_id::TEXT = search_term);
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_photo(category_id_param INT, photo_index INT)
RETURNS BYTEA AS $$
DECLARE
   ret_photo BYTEA;
BEGIN
   SELECT photos[photo_index] INTO ret_photo
   FROM categories
   WHERE category_id = category_id_param;
   RETURN ret_photo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_cart(user_id_param INT)
RETURNS TABLE(item_id INT, quantity INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
   RETURN QUERY
   SELECT c.item_id, c.quantity, i.item_name, i.price, i.stock
   FROM cart_items c JOIN items i
   ON c.item_id = i.item_id
   WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_item_photo(item_id_param INT)
RETURNS BYTEA AS $$
DECLARE
   ret_photo BYTEA;
BEGIN
   SELECT photo INTO ret_photo
   FROM items
   WHERE item_id = item_id_param;
   RETURN ret_photo;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_total_cart_price(user_id_param INT)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
   ret_total_price DECIMAL(10, 2);
BEGIN
   SELECT SUM(i.price * c.quantity) INTO ret_total_price
   FROM cart_items c JOIN items i
   ON c.item_id = i.item_id
   WHERE user_id = user_id_param;
   RETURN ret_total_price;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_items_count(category_id_param int)
RETURNS INT AS $$
DECLARE 
    cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt
    FROM cat_to_item ctoi
    JOIN undeleted_items i
    ON i.item_id = ctoi.item_id
    WHERE i.stock > 0 AND ctoi.category_id = category_id_param;
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_items_page(category_id_param INT, offset_param INT, limit_param INT)
RETURNS TABLE (item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
    RETURN QUERY
    SELECT i.item_id, i.item_name, i.price, i.stock
    FROM undeleted_items i
    JOIN cat_to_item ctoi
    ON i.item_id = ctoi.item_id
    WHERE i.stock > 0 AND ctoi.category_id = category_id_param
    ORDER BY item_id
    LIMIT limit_param OFFSET offset_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_name(category_id_param INT)
RETURNS VARCHAR(255) AS $$
DECLARE
    ret_category_name VARCHAR(255);
BEGIN
    SELECT category_name INTO ret_category_name
    FROM categories
    WHERE category_id = category_id_param;
    RETURN ret_category_name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_item_stock(item_id_param INT)
RETURNS INT AS $$
DECLARE
    ret_stock INT;
BEGIN
    SELECT stock INTO ret_stock
    FROM undeleted_items
    WHERE item_id = item_id_param;
    RETURN ret_stock;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_users_page(search_term VARCHAR(50), offset_param INT, limit_param INT)
RETURNS TABLE(user_id INT, username VARCHAR(50), created_at TIMESTAMP, user_role VARCHAR(255)) AS $$
BEGIN
   RETURN QUERY
   SELECT u.user_id, u.username, u.created_at, u.user_role
   FROM undeleted_users u
   WHERE u.username ILIKE '%' || search_term || '%' OR u.user_id::TEXT = search_term
   ORDER BY u.username
   OFFSET offset_param LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_search_users_count(search_term VARCHAR(50))
RETURNS INT AS $$
DECLARE 
    cnt INT;
BEGIN
    SELECT COUNT(*) INTO cnt
    FROM undeleted_users
    WHERE username ILIKE '%' || search_term || '%' OR user_id::TEXT = search_term;
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_categories()
RETURNS TABLE(category_id INT, category_name VARCHAR(255)) AS $$
BEGIN
    RETURN QUERY
    SELECT c.category_id, c.category_name
    FROM categories c;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_item_of_category(item_id_param INT, category_id_param INT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM cat_to_item
        WHERE item_id = item_id_param AND category_id = category_id_param
    );
END;
$$ LANGUAGE plpgsql;