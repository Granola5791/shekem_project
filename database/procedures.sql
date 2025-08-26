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
BEGIN
    INSERT INTO cart_items (user_id, item_id, quantity)
    VALUES (user_id_param, item_id_param, quantity_param)
    ON CONFLICT (user_id, item_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
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
BEGIN
    UPDATE cart_items
    SET quantity = quantity_param
    WHERE user_id = user_id_param AND item_id = item_id_param;
END;
$$