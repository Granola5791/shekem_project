package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetRouter() {
	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{GetStringFromConfig("server.frontend_addr")},
		AllowMethods:     []string{"POST", "OPTIONS", "GET", "DELETE", "PATCH"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	router.POST(GetStringFromConfig("server.api.login_path"), HandleLogin)
	router.POST(GetStringFromConfig("server.api.signup_path"), HandleSignup)
	router.POST(GetStringFromConfig("server.api.add_to_cart_path"), RequireAuthentication, HandleAddToCart)
	router.POST(GetStringFromConfig("server.api.order_submit_path"), RequireAuthentication, HandleOrderSubmit)
	router.GET(GetStringFromConfig("server.api.check_login_path"), RequireAuthentication)
	router.GET(GetStringFromConfig("server.api.get_categories_path"), RequireAuthentication, HandleGetCategories)
	router.GET(GetStringFromConfig("server.api.get_category_photo_path"), RequireAuthentication, HandleGetCategoryPhoto)
	router.GET(GetStringFromConfig("server.api.get_item_photo_path"), RequireAuthentication, HandleGetItemPhoto)
	router.GET(GetStringFromConfig("server.api.get_cart_path"), RequireAuthentication, HandleGetCart)
	router.GET(GetStringFromConfig("server.api.get_category_items_count_path"), RequireAuthentication, HandleGetCategoryItemsCount)
	router.GET(GetStringFromConfig("server.api.get_category_items_page_path"), RequireAuthentication, HandleGetCategoryItemsPage)
	router.DELETE(GetStringFromConfig("server.api.delete_from_cart_path"), RequireAuthentication, HandleDeleteFromCart)
	router.PATCH(GetStringFromConfig("server.api.update_cart_item_quantity_path"), RequireAuthentication, HandleUpdateCartItemQuantity)

	router.Run(GetStringFromConfig("server.listen_addr"))
}
