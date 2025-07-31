package main

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func InitConfig() {
	viper.SetConfigName("constants")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}
}

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
