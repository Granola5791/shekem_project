package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Item struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	PhotoPath string  `json:"photoPath"`
	Price     float64 `json:"price"`
}


func HandleGetRecommendedItems(c *gin.Context) {
	recommendeditems := GetRecommendedItems()
	c.JSON(http.StatusOK, gin.H{
		"recommendedItems": recommendeditems,
	})
}