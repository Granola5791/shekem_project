package main

import (
	"github.com/gin-gonic/gin"
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
	var salt, hashedPassword, token, role string
	var userExists bool
	var err error

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	if !(IsValidUserInput(input.Password) && IsValidUserInput(input.Username)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_username_or_password")})
		return
	}

	userExists, err = UserExistsInDB(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !userExists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": GetStringFromConfig("error.invalid_username_or_password")})
		return
	}

	hashedPassword, err = GetUserHashedPasswordFromDB(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	salt, err = GetUserSaltFromDB(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !VerifyPassword(hashedPassword, input.Password, salt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": GetStringFromConfig("error.invalid_password")})
		return
	}

	role, err = GetUserRoleFromDB(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	token, err = GenerateToken(input.Username, role, []byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": GetStringFromConfig("error.failed_generate_token"),
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     GetStringFromConfig("jwt.token_cookie_name"),
		Value:    token,
		Path:     "/", // visible to all paths
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   GetIntFromConfig("jwt.token_expiration_seconds"),
	})

	c.JSON(http.StatusOK, gin.H{"success": GetStringFromConfig("success.login_success")})
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
