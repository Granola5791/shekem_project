package main

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	"net/http"
)

type cartItem struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

func HandleAddToCart(c *gin.Context) {
	var input cartItem
	userID, _ := c.Get("userID")

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": viper.GetString("error.invalid_input")})
		return
	}

	AddToCart(userID.(int), input.ProductID, input.Quantity)
	c.JSON(http.StatusCreated, gin.H{"message": "Item added to cart successfully"})
}
