package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type OrderItem struct {
	ItemID   int     `json:"item_id"`
	ItemName string  `json:"item_name"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

type Order struct {
	OrderID    int         `json:"order_id"`
	TotalPrice float64     `json:"total_price"`
	Date       string      `json:"date"`
	Items      []OrderItem `json:"items"`
}

func HandleGetOrders(c *gin.Context) {
	userID, _ := c.Get("userID")
	page, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": GetStringFromConfig("error.invalid_input")})
		return
	}
	orders, err := GetOrdersPageFromDB(userID.(int), page)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	count, err := GetOrdersCountFromDB(userID.(int))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"orders": orders, "count": count})
}
