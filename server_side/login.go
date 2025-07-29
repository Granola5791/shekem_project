package main

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

type loginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func HandleLogin(c *gin.Context) {
	var input loginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
		return
	}

	if !(IsValidUserInput(input.Password) && IsValidUserInput(input.Username)) {
		c.String(http.StatusUnauthorized, "Invalid username or password")
		return
	}

	if !UserExistsInDB(input.Username) {
		c.String(http.StatusUnauthorized, "User does not exist")
		return
	}

	hashedPassword := GetUserHashedPasswordFromDB(input.Username)
	salt := GetUserSaltFromDB(input.Username)
	if !VerifyPassword(hashedPassword, input.Password, salt) {
		c.String(http.StatusUnauthorized, "Invalid username or password")
		return
	}

	token, err := GenerateToken(input.Username, GetUserRoleFromDB(input.Username), []byte(os.Getenv("SECRET")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Failed to create token",
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "auth_token",
		Value:    token,
		Path:     "/", // visible to all paths
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   1800,
	})

	c.String(http.StatusOK, "Login successful")
}

func CreateNewHashedPassword(password string) (string, string) {
	salt := GenerateSalt()
	hashedPassword := HashPassword(password, salt)
	return hashedPassword, salt
}

func IsValidUserInput(input string) bool {
	var inputLen int = len(input)
	return inputLen >= 8 && inputLen <= 30 && !strings.ContainsAny(input, " \t\n\r\f\v\b\a\"'")
}
