package main

import (
	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/argon2"
)

var (
	time    uint32 = 2     // Number of iterations
	memory  uint32 = 65536 // 64 MiB
	threads uint8  = 4     // Number of threads
	keyLen  uint32 = 32    // Length of the derived key
	saltLen int    = 16    // Length of the salt
)

func hashPassword(password string, salt string) string {
	hash := argon2.IDKey([]byte(password), []byte(salt), time, memory, threads, keyLen)
	return base64.RawStdEncoding.EncodeToString(hash)
}

func GenerateSalt() string {
	salt := make([]byte, saltLen)
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
