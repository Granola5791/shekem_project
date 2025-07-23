package main

import (
	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/argon2"
	"github.com/spf13/viper"
	"log"
)

func InitConfig() {
	viper.SetConfigName("hash_constants")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	err := viper.ReadInConfig()
	if err != nil {
		log.Fatalf("Error reading config file, %s", err)
	}
}

func hashPassword(password string, salt string) string {
	hash := argon2.IDKey([]byte(password), []byte(salt), viper.GetUint32("time"), viper.GetUint32("memory"), viper.GetUint8("threads"), viper.GetUint32("keyLen"))
	return base64.RawStdEncoding.EncodeToString(hash)
}

func GenerateSalt() string {
	salt := make([]byte, viper.GetInt("saltLen"))
	_, err := rand.Read(salt)
	if err != nil {
		panic("Failed to generate salt: " + err.Error())
	}
	return base64.RawStdEncoding.EncodeToString(salt)
}

func VerifyPassword(hashedPassword string, password string, salt string) bool {
	expectedHash := hashPassword(password, salt)
	return expectedHash == hashedPassword
}
