package main

import (
	"io"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Item struct {
	ID    int     `json:"id"`
	Name  string  `json:"name"`
	Price float64 `json:"price"`
	Stock int     `json:"stock"`
}

func HandleGetItemPhoto(c *gin.Context) {
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

func HandleGetCategoryItemsPage(c *gin.Context) {
	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	page, err := strconv.Atoi(c.DefaultQuery("p", "1"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	items, err := GetCategoryItemsPage(categoryID, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items})
}

func HandleGetCategoryItemsCount(c *gin.Context) {
	categoryID, err := strconv.Atoi(c.Param("category_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	count, err := GetCategoryItemsCount(categoryID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": count})
}

func HandleGetSearchItems(c *gin.Context) {
	query := c.DefaultQuery("q", "")
	page, err := strconv.Atoi(c.DefaultQuery("p", "1"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	items, err := GetSearchItemsPage(query, page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	count, err := GetSearchItemsCount(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"items": items, "count": count})
}

func HandleUpdateItem(c *gin.Context) {
	ItemID, err := strconv.Atoi(c.Param("item_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	item_title := c.PostForm("item_title")
	item_price, err := strconv.ParseFloat(c.PostForm("price"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	item_stock, err := strconv.Atoi(c.PostForm("stock"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	if err := UpdateItem(ItemID, item_title, item_price, item_stock); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": GetStringFromConfig("success.item_updated")})
}

func HandleUpdateItemWithPhoto(c *gin.Context) {
	ItemID, err := strconv.Atoi(c.Param("item_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	item_title := c.PostForm("item_title")
	item_price, err := strconv.ParseFloat(c.PostForm("price"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	item_stock, err := strconv.Atoi(c.PostForm("stock"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	photo, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	photoFile, err := photo.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer photoFile.Close()
	photoBytes, err := io.ReadAll(photoFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := UpdateItemWithPhoto(ItemID, item_title, item_price, item_stock, photoBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
}

func HandleAddItem(c *gin.Context) {
	item_id, err := strconv.Atoi(c.PostForm("item_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	item_title := c.PostForm("item_title")
	item_price, err := strconv.ParseFloat(c.PostForm("price"), 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	item_stock, err := strconv.Atoi(c.PostForm("stock"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}

	photo, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	photoFile, err := photo.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer photoFile.Close()
	photoBytes, err := io.ReadAll(photoFile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := AddItem(item_id, item_title, item_price, item_stock, photoBytes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": GetStringFromConfig("success.item_added")})
}

func HandleDeleteItem(c *gin.Context) {
	ItemID, err := strconv.Atoi(c.Param("item_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	if err := DeleteItem(ItemID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": GetStringFromConfig("success.item_deleted")})
}