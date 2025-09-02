
CREATE FUNCTION get_hashed_password(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_hashed_password VARCHAR(255);
BEGIN
   SELECT hashed_password INTO ret_hashed_password 
   FROM users 
   WHERE username = username_param;

   RETURN ret_hashed_password;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION get_salt(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_salt VARCHAR(255);
BEGIN
   SELECT salt INTO ret_salt 
   FROM users 
   WHERE username = username_param;

   RETURN ret_salt;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION get_user_role(username_param VARCHAR(50)) 
RETURNS VARCHAR(255) AS $$
DECLARE
   ret_user_role VARCHAR(255);
BEGIN
   SELECT user_role INTO ret_user_role 
   FROM users 
   WHERE username = username_param;

   RETURN ret_user_role;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION user_exists(username_param VARCHAR(50)) 
RETURNS BOOLEAN AS $$
DECLARE
   ret_user_exists BOOLEAN;
BEGIN
   SELECT EXISTS(SELECT 1 FROM users WHERE username = username_param) INTO ret_user_exists;
   RETURN ret_user_exists;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION get_user_id(username_param VARCHAR(50)) 
RETURNS INT AS $$
DECLARE
   ret_user_id INT;
BEGIN
   SELECT user_id INTO ret_user_id 
   FROM users 
   WHERE username = username_param;

   RETURN ret_user_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_users(search_term VARCHAR(50))
RETURNS TABLE(user_id INT, username VARCHAR(50), user_role VARCHAR(255)) AS $$
BEGIN
   RETURN QUERY
   SELECT u.user_id, u.username, u.user_role
   FROM users u
   WHERE u.username ILIKE '%' || search_term || '%';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION search_items(search_term VARCHAR(50))
RETURNS TABLE(item_id INT) AS $$
BEGIN
   RETURN QUERY
   SELECT i.item_id
   FROM items i
   WHERE i.item_name ILIKE '%' || search_term || '%';
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
    FROM cat_to_item
    WHERE category_id = category_id_param;
    RETURN cnt;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_category_items_page(category_id_param INT, offset_param INT, limit_param INT)
RETURNS TABLE (item_id INT, item_name VARCHAR(255), price DECIMAL(10, 2), stock INT) AS $$
BEGIN
    RETURN QUERY
    SELECT i.item_id, i.item_name, i.price, i.stock
    FROM items i
    JOIN cat_to_item ctoi
    ON i.item_id = ctoi.item_id
    WHERE ctoi.category_id = category_id_param
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
    FROM items
    WHERE item_id = item_id_param;
    RETURN ret_stock;
END;
$$ LANGUAGE plpgsql;