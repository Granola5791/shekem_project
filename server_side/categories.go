package main

import (
	"github.com/lib/pq"
	"github.com/gin-gonic/gin"
	"net/http"
)

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
	Photos_paths pq.StringArray `json:"photosPaths"`
}

func HandleGetCategories(c *gin.Context) {
	categories, err := GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		panic(err)
	}
	c.JSON(http.StatusOK, gin.H{
		"categories": categories,
	})
}
