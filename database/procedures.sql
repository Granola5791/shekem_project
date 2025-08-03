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

CREATE PROCEDURE add_to_cart(IN user_id_param INT, IN item_id_param INT, IN quantity_param INT)
LANGUAGE plpgsql
AS $$
BEGIN
    IF EXISTS (SELECT * FROM cart WHERE user_id = user_id_param AND item_id = item_id_param) THEN
        UPDATE cart
        SET quantity = quantity + quantity_param
        WHERE user_id = user_id_param AND item_id = item_id_param;
    ELSE
        INSERT INTO cart (user_id, item_id, quantity)
        VALUES (user_id_param, item_id_param, quantity_param);
    END IF;
END;
$$