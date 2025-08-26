package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type cartItem struct {
	ItemID   int `json:"item_id"`
	Quantity int `json:"quantity"`
}

type FullCartItem struct {
	ItemID   int     `json:"itemID"`
	Quantity int     `json:"quantity"`
	Title    string  `json:"title"`
	Price    float64 `json:"price"`
}

func HandleAddToCart(c *gin.Context) {
	var input cartItem
	userID, _ := c.Get("userID")

	if err := c.ShouldBindJSON(&input); err != nil || input.Quantity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	if err := AddToCart(userID.(int), input.ItemID, input.Quantity); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Item added to cart successfully"})
}

func HandleGetCart(c *gin.Context) {
	userID, _ := c.Get("userID")
	cart, err := GetCart(userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"cart": cart,
	})
}
