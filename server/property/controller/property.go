package controller

import (
	"net/http"
	"server/property"
	"server/property/controller/dto"
	"server/property/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Properties(context *gin.Context) {
	properties, err := storage.GetProperties()

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, properties)
}

func BySymbol(context *gin.Context) {
	symbol := context.Param("symbol")

	property, err := storage.GetBySymbol(symbol)

	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, property)
}

func Transactions(context *gin.Context) {
	propertyId := context.Param("propertyId")
	transactionType := context.Param("type")

	transactions, err := storage.Transactions(propertyId, transactionType)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	context.IndentedJSON(http.StatusOK, transactions)

}

func Transaction(context *gin.Context) {
	transactionType := context.Param("type")

	if transactionType != "CHARGE" && transactionType != "PAYMENT" {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Wrong type of transaction"})
		return
	}

	var transactions dto.TransactionBody

	if err := context.BindJSON(&transactions); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	if len(transactions.Properties) == 0 {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Properties cannot be empty"})
		return
	}

	var dbTransactions []property.DBTransaction
	for _, element := range transactions.Properties {
		dbTransactions = append(dbTransactions, property.DBTransaction{
			Transaction: property.Transaction{
				Id:         uuid.NewString(),
				Concept:    transactions.Concept,
				Date:       transactions.Date,
				Dollars:    transactions.Dollars,
				Bolivares:  transactions.Bolivares,
				ChangeRate: transactions.ChangeRate,
				Type:       transactionType,
			},
			Property: element,
		})
	}
	if err := storage.RegisterMultiple(dbTransactions); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	context.IndentedJSON(http.StatusOK, transactions)
}
