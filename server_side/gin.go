package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
)

func SetRouter() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, 
		AllowMethods:     []string{"POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	router.POST(viper.GetString("server.api.login_path"), HandleLogin)
	router.POST(viper.GetString("server.api.signup_path"), HandleSignup)
	router.GET(viper.GetString("server.api.check_login_path"), RequireAuthentication)

	router.Run(viper.GetString("server.listen_addr"))
}
