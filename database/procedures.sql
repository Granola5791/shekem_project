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