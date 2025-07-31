package main

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"net/http"
	"os"
	"regexp"
)

type loginInput struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func HandleLogin(c *gin.Context) {
	var input loginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": viper.GetString("error.invalid_input")})
		return
	}

	if !(IsValidUserInput(input.Password) && IsValidUserInput(input.Username)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": viper.GetString("error.invalid_username_or_password")})
		return
	}

	if !UserExistsInDB(input.Username) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": viper.GetString("invalid_username_or_password")})
		return
	}

	hashedPassword := GetUserHashedPasswordFromDB(input.Username)
	salt := GetUserSaltFromDB(input.Username)
	if !VerifyPassword(hashedPassword, input.Password, salt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": viper.GetString("error.invalid_password")})
		return
	}

	token, err := GenerateToken(input.Username, GetUserRoleFromDB(input.Username), []byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": viper.GetString("error.failed_generate_token"),
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

	c.JSON(http.StatusOK, gin.H{"success": viper.GetString("success.login_success")})
}

func IsValidUserInput(s string) bool {
	/*
		TODO:
		1. learn regex
		2. Const
		3. learn how to make this regex beutiful (seperate url)
		4. regex tutorial. (1)
	*/
	re := regexp.MustCompile(`^[a-zA-Z0-9!@#\$%\^&\*\-_=+]{8,30}$`)
	return re.MatchString(s)
}
