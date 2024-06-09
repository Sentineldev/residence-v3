package main

import (
	ExpenseController "server/expense/controller"
	PropertyController "server/property/controller"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {

	app := gin.Default()

	app.Use(static.Serve("/", static.LocalFile("../build/dist", true)))
	app.NoRoute(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.RequestURI, "/api") {
			c.File("../build/dist/index.html")
		}
		//default 404 page not found
	})

	router := app.Group("/api")

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

	router.GET("/expenses/stats/:year/:month", ExpenseController.Stats)
	router.GET("/expenses", ExpenseController.Expenses)
	router.GET("/expenses/:id", ExpenseController.ById)
	router.POST("/expenses", ExpenseController.Create)
	router.PUT("/expenses/:id", ExpenseController.Update)
	router.DELETE("/expenses/:id", ExpenseController.Delete)

	//Router para las propiedades
	router.GET("/properties", PropertyController.Properties)
	router.GET("/properties/:symbol", PropertyController.BySymbol)
	router.GET("/properties/transaction/:propertyId/:type", PropertyController.Transactions)
	router.GET("/properties/transaction/payments/:transactionId", PropertyController.ChargeTransactionsPayments)
	router.POST("/properties/transaction/:type", PropertyController.Transaction)
	router.POST("/properties/transaction/add-payment/:id", PropertyController.AddChargePayment)
	router.DELETE("/properties/transaction/charge-payment/:paymentId", PropertyController.DeleteChargePayment)
	router.DELETE("/properties/transaction/:id/:type", PropertyController.DeleteTransaction)

	app.Run("0.0.0.0:8001")
}
