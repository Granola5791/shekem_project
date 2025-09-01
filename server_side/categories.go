package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type Category struct {
	ID     int           `json:"id"`
	Name   string        `json:"name"`
	Photos pq.ByteaArray `json:"photos"`
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

func HandleGetCategoryPhoto(c *gin.Context) {
	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid category ID"})
		return
	}
	photoIndex, err := strconv.Atoi(c.Param("photo_index"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid photo index"})
		return
	}
	photo, err := GetCategoryPhoto(categoryID, photoIndex)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Data(http.StatusOK, "image/jpeg", []byte(photo))
}

func HandleGetCategoryName (c *gin.Context) {
	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	name, err := GetCategoryNameFromDB(categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"name": name})
}