package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func HandleGetCategories(c *gin.Context) {
	categories := GetCategories()
	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
	})
}
