package main

import (
	"crypto/rand"
	"encoding/base64"

	"github.com/spf13/viper"
	"golang.org/x/crypto/argon2"
)



func hashPassword(password string, salt string) string {
	hash := argon2.IDKey([]byte(password), []byte(salt), viper.GetUint32("hash.time"), viper.GetUint32("hash.memory"), viper.GetUint8("hash.threads"), viper.GetUint32("hash.keyLen"))
	return base64.RawStdEncoding.EncodeToString(hash)
}

func GenerateSalt() string {
	salt := make([]byte, viper.GetInt("hash.saltLen"))
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
