package main

import (
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	"os"
)

var db *sql.DB

func GetUserIDFromDB(username string) (int, error) {
	var userID int
	sqlStatement := `SELECT get_user_id($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return 0, err
	}
	if !rows.Next() {
		return 0, sql.ErrNoRows
	}
	err = rows.Scan(&userID)
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
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return false, err
	}
	if !rows.Next() {
		return false, nil
	}
	err = rows.Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func GetUserRoleFromDB(username string) (string, error) {
	var userRole string
	sqlStatement := `SELECT get_user_role($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return "", err
	}
	if !rows.Next() {
		return "", sql.ErrNoRows
	}
	err = rows.Scan(&userRole)
	if err != nil {
		return "", err
	}
	return userRole, nil
}

func GetUserHashedPasswordFromDB(username string) (string, error) {
	var hashedPassword string
	sqlStatement := `SELECT get_hashed_password($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return "", err
	}
	if !rows.Next() {
		return "", sql.ErrNoRows
	}
	err = rows.Scan(&hashedPassword)
	if err != nil {
		return "", err
	}
	return hashedPassword, nil
}

func GetUserSaltFromDB(username string) (string, error) {
	var salt string
	sqlStatement := `SELECT get_salt($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		return "", err
	}
	if !rows.Next() {
		return "", sql.ErrNoRows
	}
	err = rows.Scan(&salt)
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

func SearchItems(searchTerm string, page int) ([]int, error) {
	pageSize := GetIntFromConfig("search.page_size")
	itemIDs := make([]int, pageSize)
	offset := (page - 1) * pageSize
	sqlStatement := `CALL search_items($1)`
	rows, err := db.Query(sqlStatement, searchTerm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i := 0; i < offset && rows.Next(); i++ {
		rows.Next()
	}
	if !rows.Next() {
		return nil, sql.ErrNoRows
	}
	for i := 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&itemIDs[i])
		if err != nil {
			return nil, err
		}
	}
	return itemIDs, nil
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


func GetRecommendedItems() ([]Item, error) {
	amount := GetIntFromConfig("database.recommended_items_amount")
	items := make([]Item, amount)
	sqlStatement := `SELECT * FROM recommended_items;`
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i := 0; i < amount && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].PhotoPath, &items[i].Price)
		if err != nil {
			return nil, err
		}
	}
	return items, nil
}

func GetCategories() ([]Category, error) {
	var i int
	bufferSize := GetIntFromConfig("database.categories_buffer_size")
	categories := make([]Category, bufferSize)
	sqlStatement := `SELECT * FROM categories;`
	rows, err := db.Query(sqlStatement)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for i = 0; i < bufferSize && rows.Next(); i++ {
		err = rows.Scan(&categories[i].ID, &categories[i].Name, &categories[i].Photos)
		if err != nil {
			return nil, err
		}
	}
	return categories[0:i], nil
}

func GetCategoryPhoto(categoryID int, photoIndex int) ([]byte, error) {
	var photo []byte
	sqlStatement := `SELECT get_category_photo($1, $2);`
	rows, err := db.Query(sqlStatement, categoryID, photoIndex)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	if !rows.Next() {
		return nil, sql.ErrNoRows
	}
	err = rows.Scan(&photo)
	if err != nil {
		return nil, err
	}
	return photo, nil
}

func GetCart(userID int) ([]FullCartItem, error) {
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
		err = rows.Scan(&cart[i].ItemID, &cart[i].Quantity, &cart[i].Title, &cart[i].Price)
		if err != nil {
			return nil, err
		}
	}
	return cart[0:i], nil
}

func GetItemPhoto(itemID int) ([]byte, error) {
	var photo []byte
	sqlStatement := `SELECT get_item_photo($1);`
	rows, err := db.Query(sqlStatement, itemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	if !rows.Next() {
		return nil, sql.ErrNoRows
	}
	err = rows.Scan(&photo)
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
