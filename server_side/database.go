package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"github.com/spf13/viper"
	"os"
)

func InsertUserToDB(username string, hashedPassword string, salt string) {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `CALL create_user($1, $2, $3);`
	_, err := db.Exec(sqlStatement, username, hashedPassword, salt)
	if err != nil {
		panic(err)
	}
}

func DeleteUserFromDB(username string) {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `CALL delete_user($1);`
	_, err := db.Exec(sqlStatement, username)
	if err != nil {
		panic(err)
	}
}

func UserExistsInDB(username string) bool {
	var exists bool
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
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
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
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
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
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
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), os.Getenv("SQL_PASSWORD"), viper.GetString("database.dbname"))
	defer db.Close()
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

func OpenSQLConnection(host string, port int, user string, password string, dbname string) *sql.DB {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	return db
}
