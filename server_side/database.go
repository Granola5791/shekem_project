package main

import (
	"database/sql"
	"fmt"
	"github.com/lib/pq"
	"github.com/spf13/viper"
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

func InsertUserToDB(username string, hashedPassword string, salt string) {
	sqlStatement := `CALL create_user($1, $2, $3);`
	_, err := db.Exec(sqlStatement, username, hashedPassword, salt)
	if err != nil {
		panic(err)
	}
}

func DeleteUserFromDB(username string) {
	sqlStatement := `CALL delete_user($1);`
	_, err := db.Exec(sqlStatement, username)
	if err != nil {
		panic(err)
	}
}

func UserExistsInDB(username string) bool {
	var exists bool
	sqlStatement := `SELECT user_exists($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return false
	}
	err = rows.Scan(&exists)
	if err != nil {
		panic(err)
	}
	return exists
}

func GetUserRoleFromDB(username string) string {
	var userRole string
	sqlStatement := `SELECT get_user_role($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	err = rows.Scan(&userRole)
	if err != nil {
		panic(err)
	}
	return userRole
}

func GetUserHashedPasswordFromDB(username string) string {
	var hashedPassword string
	sqlStatement := `SELECT get_hashed_password($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	err = rows.Scan(&hashedPassword)
	if err != nil {
		panic(err)
	}
	return hashedPassword
}

func GetUserSaltFromDB(username string) string {
	var salt string
	sqlStatement := `SELECT get_salt($1)`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	err = rows.Scan(&salt)
	if err != nil {
		panic(err)
	}
	return salt
}

func AddToCart(userID int, productID int, quantity int) error {
	sqlStatement := `CALL add_to_cart($1, $2, $3);`
	_, err := db.Exec(sqlStatement, userID, productID, quantity)
	if err != nil {
		return err
	}
	return nil
}

func SearchItems(searchTerm string, page int) []int {
	pageSize := viper.GetInt("search.page_size")
	itemIDs := make([]int, pageSize)
	offset := (page - 1) * pageSize
	sqlStatement := `CALL search_items($1)`
	rows, err := db.Query(sqlStatement, searchTerm)
	if err != nil {
		panic(err)
	}
	defer rows.Close()
	for i := 0; i < offset && rows.Next(); i++ {
		rows.Next()
	}
	if !rows.Next() {
		return nil
	}
	for i := 0; i < pageSize && rows.Next(); i++ {
		err = rows.Scan(&itemIDs[i])
		if err != nil {
			panic(err)
		}
	}
	return itemIDs
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

func GetRecommendedItems() []Item {
	amount := GetIntFromConfig("database.recommended_items_amount")
	items := make([]Item, amount)
	sqlStatement := `SELECT * FROM recommended_items;`
	rows, err := db.Query(sqlStatement)
	if err != nil {
		panic(err)
	}
	defer rows.Close()
	for i := 0; i < amount && rows.Next(); i++ {
		err = rows.Scan(&items[i].ID, &items[i].Name, &items[i].PhotoPath, &items[i].Price)
		if err != nil {
			panic(err)
		}
	}
	return items
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

func GetCategoryPhoto(categoryID int, photoIndex int) ( []byte, error) {
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

func OpenSQLConnection() {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		viper.GetString("database.host"),
		viper.GetInt("database.port"),
		viper.GetString("database.user"),
		os.Getenv("SQL_PASSWORD"),
		viper.GetString("database.dbname"),
	)

	db, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
}
