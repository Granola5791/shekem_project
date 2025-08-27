CREATE OR REPLACE FUNCTION update_stock_function()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE items
    SET stock = stock - NEW.quantity
    WHERE item_id = NEW.item_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;