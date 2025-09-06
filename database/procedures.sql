CREATE PROCEDURE create_user(IN username_param VARCHAR(50), IN hashed_password_param VARCHAR(255), IN salt_param VARCHAR(255))
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO users (username, hashed_password, salt)
    VALUES (username_param, hashed_password_param, salt_param);
END;
$$

CREATE PROCEDURE delete_user(IN username_param VARCHAR(50))
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM users
    WHERE username = username_param;
END;
$$

CREATE OR REPLACE PROCEDURE add_to_cart(IN user_id_param INT, IN item_id_param INT, IN quantity_param INT)
LANGUAGE plpgsql
AS $$
DECLARE
    item_stock INT := get_item_stock(item_id_param);
BEGIN
    INSERT INTO cart_items (user_id, item_id, quantity)
    VALUES (user_id_param, item_id_param, quantity_param)
    ON CONFLICT (user_id, item_id)
    DO UPDATE
    SET quantity = LEAST(
        cart_items.quantity + EXCLUDED.quantity,
        item_stock
    );
END;
$$

CREATE OR REPLACE PROCEDURE delete_from_cart(IN user_id_param INT, IN item_id_param INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM cart_items
    WHERE user_id = user_id_param AND item_id = item_id_param;
END;
$$

CREATE OR REPLACE PROCEDURE update_cart_item_quantity(IN user_id_param INT, IN item_id_param INT, IN quantity_param INT)
LANGUAGE plpgsql
AS $$
DECLARE
    item_stock INT := get_item_stock(item_id_param);
BEGIN
    UPDATE cart_items
    SET quantity = LEAST(quantity_param, item_stock)
    WHERE user_id = user_id_param AND item_id = item_id_param;
END;
$$

CREATE OR REPLACE PROCEDURE create_order_from_cart(IN user_id_param INT)
LANGUAGE plpgsql
AS $$
DECLARE
    new_order_id INT;
BEGIN
    INSERT INTO orders (user_id, total_price)
    VALUES (user_id_param, get_total_cart_price(user_id_param))
    RETURNING order_id INTO new_order_id;

    INSERT INTO order_items (order_id, item_id, quantity)
    SELECT new_order_id, item_id, quantity
    FROM cart_items
    WHERE user_id = user_id_param;

    DELETE FROM cart_items
    WHERE user_id = user_id_param;
END;
$$

CREATE OR REPLACE PROCEDURE update_item(IN item_id_param INT, IN item_name_param VARCHAR(255), IN price_param DECIMAL(10, 2), IN stock_param INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE items
    SET item_name = item_name_param, price = price_param, stock = stock_param
    WHERE item_id = item_id_param;
END;
$$

CREATE OR REPLACE PROCEDURE update_item_with_photo(IN item_id_param INT, IN item_name_param VARCHAR(255), IN price_param DECIMAL(10, 2), IN stock_param INT, IN photo_param BYTEA)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE items
    SET item_name = item_name_param, price = price_param, photo = photo_param, stock = stock_param
    WHERE item_id = item_id_param;
END;
$$

CREATE OR REPLACE PROCEDURE add_item(IN item_id_param INT, IN item_name_param VARCHAR(255), IN price_param DECIMAL(10, 2), IN stock_param INT, IN photo_param BYTEA)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO items (item_id, item_name, price, photo, stock)
    VALUES (item_id_param, item_name_param, price_param, photo_param, stock_param);
END;
$$

CREATE OR REPLACE PROCEDURE delete_item(IN item_id_param INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM items
    WHERE item_id = item_id_param;
END;
$$