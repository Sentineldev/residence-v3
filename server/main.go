package main

import (
	ExpenseController "server/expense/controller"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "*"
		},
		MaxAge: 12 * time.Hour,
	}))

	router.GET("/expenses", ExpenseController.Expenses)
	router.GET("/expenses/:id", ExpenseController.ById)
	router.POST("/expenses", ExpenseController.Create)
	router.PUT("/expenses/:id", ExpenseController.Update)
	router.DELETE("/expenses/:id", ExpenseController.Delete)
	router.Run("localhost:8001")
}
