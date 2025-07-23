package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
	"github.com/spf13/viper"
)

func InsertUserToDB(username string, hashedPassword string, salt string) {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
INSERT INTO users (username, hashed_password, salt)
VALUES ($1, $2, $3)`
	_, err := db.Exec(sqlStatement, username, hashedPassword, salt)
	if err != nil {
		panic(err)
	}
}

func DeleteUserFromDB(username string) {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
DELETE FROM users
WHERE username = $1`
	_, err := db.Exec(sqlStatement, username)
	if err != nil {
		panic(err)
	}
}

func UserExistsInDB(username string) bool {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
SELECT * FROM users
WHERE username = $1`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	return rows.Next()
}

func GetUserRoleFromDB(username string) string {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
SELECT user_role FROM users
WHERE username = $1`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	var userRole string
	err = rows.Scan(&userRole)
	if err != nil {
		panic(err)
	}
	return userRole

}

func GetUserHashedPasswordFromDB(username string) string {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
SELECT hashed_password FROM users
WHERE username = $1`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	var hashedPassword string
	err = rows.Scan(&hashedPassword)
	if err != nil {
		panic(err)
	}
	return hashedPassword
}

func GetUserSaltFromDB(username string) string {
	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))
	defer db.Close()
	sqlStatement := `
SELECT salt FROM users
WHERE username = $1`
	rows, err := db.Query(sqlStatement, username)
	if err != nil {
		panic(err)
	}
	if !rows.Next() {
		return ""
	}
	var salt string
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

func fun() {

	db := OpenSQLConnection(viper.GetString("database.host"), viper.GetInt("database.port"), viper.GetString("database.user"), viper.GetString("database.password"), viper.GetString("database.dbname"))

	defer db.Close()

	err := db.Ping()
	if err != nil {
		panic(err)
	}

	sqlStatement := `
INSERT INTO users (username, user_role, created_at, hashed_password, salt)
VALUES ('username', 'admin', NOW(), 'CIef5TxQciapUdekezYAyaWuzwtn6p1lrK2xieziHCI', 'LQxEEpsjti5sP9/YumTrbQ')`
	_, err = db.Exec(sqlStatement)
	if err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected!")
}
