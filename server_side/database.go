package main

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/lib/pq"
)

var db *sql.DB

func GetUserIDFromDB(username string) (int, error) {
	var userID int
	sqlStatement := `SELECT get_user_id($1)`
	err := db.QueryRow(sqlStatement, username).Scan(&userID)
	if err != nil {
		return 0, err
	}
	return userID, nil
}

func InsertUserToDB(username string, hashedPassword string, salt string) error {
	sqlStatement := `CALL create_user($1, $2, $3);`
	_, err := db.Exec(sqlStatement, username, hashedPassword, salt)
	if err != nil {
		return err
	}
	return nil
}

func DeleteUserFromDB(username string) error {
	sqlStatement := `CALL delete_user($1);`
	_, err := db.Exec(sqlStatement, username)
	if err != nil {
		return err
	}
	return nil
}

func UserExistsInDB(username string) (bool, error) {
	var exists bool
	sqlStatement := `SELECT user_exists($1)`
	err := db.QueryRow(sqlStatement, username).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func GetUserRoleFromDB(username string) (string, error) {
	var userRole string
	sqlStatement := `SELECT get_user_role($1)`
	err := db.QueryRow(sqlStatement, username).Scan(&userRole)
	if err != nil {
		return "", err
	}
	return userRole, nil
}

func GetUserHashedPasswordFromDB(username string) (string, error) {
	var hashedPassword string
	sqlStatement := `SELECT get_hashed_password($1)`
	err := db.QueryRow(sqlStatement, username).Scan(&hashedPassword)
	if err != nil {
		return "", err
	}
	return hashedPassword, nil
}

func GetUserSaltFromDB(username string) (string, error) {
	var salt string
	sqlStatement := `SELECT get_salt($1)`
	err := db.QueryRow(sqlStatement, username).Scan(&salt)
	if err != nil {
		return "", err
	}
	return salt, nil
}

func AddToCart(userID int, productID int, quantity int) error {
	sqlStatement := `CALL add_to_cart($1, $2, $3);`
	_, err := db.Exec(sqlStatement, userID, productID, quantity)
	if err != nil {
		return err
	}
	return nil
}

func GetSearchUsersPage(query string, page int) ([]User, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	users := make([]User, pageSize)
	start := (page - 1) * pageSize
	sqlStatement := `SELECT * FROM get_search_users_page($1, $2, $3);`
	rows, err := db.Query(sqlStatement, query, start, pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&users[i].ID, &users[i].Username, &users[i].CreatedAt, &users[i].Role)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return users[0:i], nil
}

func GetSearchUsersCount(query string) (int, error) {
	var count int
	sqlStatement := `SELECT get_search_users_count($1);`
	err := db.QueryRow(sqlStatement, query).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func GetSearchItemsPage(searchTerm string, page int) ([]Item, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	items := make([]Item, pageSize)
	start := (page - 1) * pageSize
	sqlStatement := `SELECT * FROM get_search_items_page($1, $2, $3);`
	rows, err := db.Query(sqlStatement, searchTerm, start, pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].Price, &items[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return items[0:i], nil
}

func GetSearchItemsPageWithFiltersAndSort(searchTerm string, page int, categoryID int, sortColumn string, is_asc bool) ([]Item, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	items := make([]Item, pageSize)
	start := (page - 1) * pageSize
	sqlStatement := `SELECT * FROM get_search_items_page($1, $2, $3, $4, $5, $6);`
	rows, err := db.Query(sqlStatement, searchTerm, categoryID, sortColumn, is_asc, start, pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].Price, &items[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return items[0:i], nil
}

func GetSearchItemsPageWithSort(searchTerm string, page int, sortColumn string, is_asc bool) ([]Item, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	items := make([]Item, pageSize)
	start := (page - 1) * pageSize
	sqlStatement := `SELECT * FROM get_search_items_page($1, $2, $3, $4, $5);`
	rows, err := db.Query(sqlStatement, searchTerm, sortColumn, is_asc, start, pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].Price, &items[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return items[0:i], nil
}

func GetSearchItemsPageWithFilters(searchTerm string, page int, categoryID int) ([]Item, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	items := make([]Item, pageSize)
	start := (page - 1) * pageSize
	sqlStatement := `SELECT * FROM get_search_items_page($1, $2, $3, $4);`
	rows, err := db.Query(sqlStatement, searchTerm, categoryID, start, pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].Price, &items[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return items[0:i], nil
}

func GetSearchItemsCount(searchTerm string) (int, error) {
	var count int
	sqlStatement := `SELECT get_search_items_count($1);`
	err := db.QueryRow(sqlStatement, searchTerm).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func GetSearchItemsCountWithFilters(searchTerm string, categoryID int) (int, error) {
	var count int
	sqlStatement := `SELECT get_search_items_count($1, $2);`
	err := db.QueryRow(sqlStatement, searchTerm, categoryID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func UpdateItemPhoto(itemID int, photoPath string) error {
	sqlStatement := `UPDATE items SET photo = $2 WHERE item_id = $1;`
	fileBytes, err := os.ReadFile(photoPath)
	if err != nil {
		return err
	}
	_, err = db.Exec(sqlStatement, itemID, fileBytes)
	if err != nil {
		return err
	}
	return nil
}

func UpdateCategoryPhotos(categoryID int, photoPaths []string) error {
	sqlStatement := `UPDATE categories SET photos = $2 WHERE category_id = $1;`
	photos := make([][]byte, len(photoPaths))
	for i, path := range photoPaths {
		fileBytes, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		photos[i] = fileBytes
	}
	_, err := db.Exec(sqlStatement, categoryID, pq.ByteaArray(photos))
	if err != nil {
		return err
	}
	return nil
}

func GetCategories() ([]Category, error) {
	var i int
	bufferSize := GetIntFromConfig("database.categories_buffer_size")
	categories := make([]Category, bufferSize)
	sqlStatement := `SELECT * FROM get_categories();`
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < bufferSize && rows.Next(); i++ {
		err = rows.Scan(&categories[i].ID, &categories[i].Name)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return categories[0:i], nil
}

func GetCategoryPhoto(categoryID int, photoIndex int) ([]byte, error) {
	var photo []byte
	sqlStatement := `SELECT get_category_photo($1, $2);`
	err := db.QueryRow(sqlStatement, categoryID, photoIndex).Scan(&photo)
	if err != nil {
		return nil, err
	}
	return photo, nil
}

func GetCartFromDB(userID int) ([]FullCartItem, error) {
	var i int
	bufferSize := GetIntFromConfig("database.cart_buffer_size")
	cart := make([]FullCartItem, bufferSize)
	sqlStatement := `SELECT * FROM get_cart($1);`
	rows, err := db.Query(sqlStatement, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < bufferSize && rows.Next(); i++ {
		err = rows.Scan(&cart[i].ItemID, &cart[i].Quantity, &cart[i].Title, &cart[i].Price, &cart[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return cart[0:i], nil
}

func GetItemPhoto(itemID int) ([]byte, error) {
	var photo []byte
	sqlStatement := `SELECT get_item_photo($1);`
	err := db.QueryRow(sqlStatement, itemID).Scan(&photo)
	if err != nil {
		return nil, err
	}
	return photo, nil
}

func DeleteFromCart(userID int, itemID int) error {
	sqlStatement := `CALL delete_from_cart($1, $2);`
	_, err := db.Exec(sqlStatement, userID, itemID)
	if err != nil {
		return err
	}
	return nil
}

func UpdateCartItemQuantity(userID int, itemID int, quantity int) error {
	sqlStatement := `CALL update_cart_item_quantity($1, $2, $3);`
	_, err := db.Exec(sqlStatement, userID, itemID, quantity)
	if err != nil {
		return err
	}
	return nil
}

func SubmitOrderToDB(userID int) error {
	sqlStatement := `CALL create_order_from_cart($1);`
	_, err := db.Exec(sqlStatement, userID)
	if err != nil {
		return err
	}
	return nil
}

func GetCategoryItemsCount(categoryID int) (int, error) {
	var count int
	sqlStatement := `SELECT get_category_items_count($1);`
	err := db.QueryRow(sqlStatement, categoryID).Scan(&count)
	if err != nil {
		return 0, err
	}
	return count, nil
}

func GetCategoryItemsPage(categoryID int, page int) ([]Item, error) {
	var i int
	pageSize := GetIntFromConfig("database.items_page_size")
	items := make([]Item, pageSize)
	offset := (page - 1) * pageSize

	sqlStatement := `SELECT * FROM get_category_items_page($1, $2, $3)`
	rows, err := db.Query(sqlStatement, categoryID, offset, offset+pageSize)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].Price, &items[i].Stock)
		if err != nil {
			return nil, err
		}
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return items[0:i], nil
}

func GetCategoryNameFromDB(categoryID int) (string, error) {
	var name string
	sqlStatement := `SELECT get_category_name($1);`
	err := db.QueryRow(sqlStatement, categoryID).Scan(&name)
	if err != nil {
		return "", err
	}
	return name, nil
}

func UpdateItem(ItemID int, item_title string, item_price float64, item_stock int) error {
	sqlStatement := `CALL update_item($1, $2, $3, $4);`
	_, err := db.Exec(sqlStatement, ItemID, item_title, item_price, item_stock)
	if err != nil {
		return err
	}
	return nil
}

func UpdateItemWithPhoto(ItemID int, item_title string, item_price float64, item_stock int, photo []byte) error {
	sqlStatement := `CALL update_item_with_photo($1, $2, $3, $4, $5);`
	_, err := db.Exec(sqlStatement, ItemID, item_title, item_price, item_stock, photo)
	if err != nil {
		return err
	}
	return nil
}

func AddItem(ItemID int, item_title string, item_price float64, item_stock int, photo []byte) error {
	sqlStatement := `CALL add_item($1, $2, $3, $4, $5);`
	_, err := db.Exec(sqlStatement, ItemID, item_title, item_price, item_stock, photo)
	if err != nil {
		return err
	}
	return nil
}

func DeleteItem(ItemID int) error {
	sqlStatement := `CALL soft_delete_item($1);`
	_, err := db.Exec(sqlStatement, ItemID)
	if err != nil {
		return err
	}
	return nil
}

func DeleteUser(UserID int) error {
	sqlStatement := `CALL soft_delete_user($1);`
	_, err := db.Exec(sqlStatement, UserID)
	if err != nil {
		return err
	}
	return nil
}

func SetAdmin(UserID int) error {
	sqlStatement := `CALL set_admin($1);`
	_, err := db.Exec(sqlStatement, UserID)
	if err != nil {
		return err
	}
	return nil
}

func DeleteEntireCartFromDB(userID int) error {
	sqlStatement := `CALL delete_entire_cart($1);`
	_, err := db.Exec(sqlStatement, userID)
	if err != nil {
		return err
	}
	return nil
}

func OpenSQLConnection() error {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		GetStringFromConfig("database.host"),
		GetIntFromConfig("database.port"),
		GetStringFromConfig("database.user"),
		os.Getenv("SQL_PASSWORD"),
		GetStringFromConfig("database.dbname"),
	)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		return err
	}
	return nil
}
