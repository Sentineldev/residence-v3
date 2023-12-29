package main

import (
	expenseController "server/controller/expense"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()
	router.GET("/expenses/:id", expenseController.Create)
	router.GET("/expenses", expenseController.Expenses)
	router.POST("/expenses", expenseController.Create)
	router.PUT("/expenses/:id", expenseController.Update)
	router.DELETE("/expenses/:id", expenseController.Delete)
	router.Run("localhost:8080")
}
