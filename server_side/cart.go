package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type cartItem struct {
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

func HandleAddToCart(c *gin.Context) {
	var input cartItem
	userID, _ := c.Get("userID")

	if err := c.ShouldBindJSON(&input); err != nil || input.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	if err := AddToCart(userID.(int), input.ProductID, input.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Item added to cart successfully"})
}
