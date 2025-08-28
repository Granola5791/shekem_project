package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	PhotoPath string  `json:"photoPath"`
	Price     float64 `json:"price"`
}


func HandleGetItemPhoto(c *gin.Context){
	itemID, err := strconv.Atoi(c.Param("item_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	photo, err := GetItemPhoto(itemID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "image/jpeg", []byte(photo))
	
}