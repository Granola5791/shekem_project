package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func TestUser(c *gin.Context) {
	fmt.Println("Hello, I'm a user")
}

func TestAdmin(c *gin.Context) {
	fmt.Println("Hello, I'm an admin")
}

func SetRouter() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	router.POST("api/login", HandleLogin)
	router.GET("api/test/user", RequireAuthentication, TestUser)
	router.GET("api/test/admin", RequireAuthentication, RequireAdmin, TestAdmin)
	router.GET("api/check_login", RequireAuthentication)

	router.Run("localhost:8081")
}
