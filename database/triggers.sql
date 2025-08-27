CREATE OR REPLACE TRIGGER update_stock
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_stock_function();