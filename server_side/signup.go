package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func CreateNewHashedPassword(password string) (string, string) {
	salt := GenerateSalt()
	hashedPassword := HashPassword(password, salt)
	return hashedPassword, salt
}

func HandleSignup(c *gin.Context) {
	var input loginInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": viper.GetString("error.invalid_input")})
		return
	}

	if !(IsValidUserInput(input.Password) && IsValidUserInput(input.Username)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": viper.GetString("error.invalid_username_or_password")})
		return
	}

	if UserExistsInDB(input.Username) {
		c.JSON(http.StatusConflict, gin.H{"error": viper.GetString("error.user_exists")})
		return
	}

	hashedPassword, salt := CreateNewHashedPassword(input.Password)
	InsertUserToDB(input.Username, hashedPassword, salt)
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})

}
