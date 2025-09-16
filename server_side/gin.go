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
	router.POST(GetStringFromConfig("server.api.add_item_path"), RequireAuthentication, RequireAdmin, HandleAddItem)
	router.GET(GetStringFromConfig("server.api.check_login_path"), RequireAuthentication)
	router.GET(GetStringFromConfig("server.api.check_admin_path"), RequireAuthentication, RequireAdmin)
	router.GET(GetStringFromConfig("server.api.get_categories_path"), RequireAuthentication, HandleGetCategories)
	router.GET(GetStringFromConfig("server.api.get_category_photo_path"), RequireAuthentication, HandleGetCategoryPhoto)
	router.GET(GetStringFromConfig("server.api.get_item_photo_path"), RequireAuthentication, HandleGetItemPhoto)
	router.GET(GetStringFromConfig("server.api.get_cart_path"), RequireAuthentication, HandleGetCart)
	router.GET(GetStringFromConfig("server.api.get_category_items_count_path"), RequireAuthentication, HandleGetCategoryItemsCount)
	router.GET(GetStringFromConfig("server.api.get_category_items_page_path"), RequireAuthentication, HandleGetCategoryItemsPage)
	router.GET(GetStringFromConfig("server.api.get_category_name_path"), RequireAuthentication, HandleGetCategoryName)
	router.GET(GetStringFromConfig("server.api.get_search_items_path"), RequireAuthentication, HandleGetSearchItems)
	router.GET(GetStringFromConfig("server.api.get_search_users_path"), RequireAuthentication, RequireAdmin, HandleGetSearchUsers)
	router.DELETE(GetStringFromConfig("server.api.delete_from_cart_path"), RequireAuthentication, HandleDeleteFromCart)
	router.DELETE(GetStringFromConfig("server.api.delete_item_path"), RequireAuthentication, RequireAdmin, HandleDeleteItem)
	router.DELETE(GetStringFromConfig("server.api.delete_user_path"), RequireAuthentication, RequireAdmin, HandleDeleteUser)
	router.DELETE(GetStringFromConfig("server.api.delete_entire_cart_path"), RequireAuthentication, HandleDeleteEntireCart)
	router.PATCH(GetStringFromConfig("server.api.update_cart_item_quantity_path"), RequireAuthentication, HandleUpdateCartItemQuantity)
	router.PATCH(GetStringFromConfig("server.api.update_item_path"), RequireAuthentication, RequireAdmin, HandleUpdateItem)
	router.PATCH(GetStringFromConfig("server.api.update_item_with_photo_path"), RequireAuthentication, RequireAdmin, HandleUpdateItemWithPhoto)
	router.PATCH(GetStringFromConfig("server.api.set_admin_path"), RequireAuthentication, RequireAdmin, HandleSetAdmin)

	router.Run(GetStringFromConfig("server.listen_addr"))
}
