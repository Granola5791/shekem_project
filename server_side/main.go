package main

import (
	"log"

	"github.com/joho/godotenv"
)

func InitEnv() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	InitConfig()
	InitEnv()
	OpenSQLConnection()
	SetRouter()
}
