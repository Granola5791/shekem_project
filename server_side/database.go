package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"os"
)

var db *sql.DB

// TODO : make one global db connection
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

func AddToCart(userID string, productID string, quantity int) {
	sqlStatement := `CALL add_to_cart($1, $2, $3);`
	_, err := db.Exec(sqlStatement, userID, productID, quantity)
	if err != nil {
		panic(err)
	}
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
