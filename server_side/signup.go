package main

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

func CreateNewHashedPassword(password string) (string, string) {
	salt := GenerateSalt()
	hashedPassword := HashPassword(password, salt)
	return hashedPassword, salt
}

func HandleSignup(c *gin.Context) {
	var input loginInput
	var userExists bool

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	if !(IsValidUserInput(input.Password) && IsValidUserInput(input.Username)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_username_or_password")})
		return
	}

	userExists, err := UserExistsInDB(input.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if userExists {
		c.JSON(http.StatusConflict, gin.H{"error": GetStringFromConfig("error.user_exists")})
		return
	}

	hashedPassword, salt := CreateNewHashedPassword(input.Password)
	InsertUserToDB(input.Username, hashedPassword, salt)
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})

}
