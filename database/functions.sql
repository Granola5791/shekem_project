
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