package controller

import (
	"fmt"
	"net/http"
	"server/property"
	"server/property/controller/dto"
	"server/property/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func AddChargePayment(context *gin.Context) {
	id := context.Param("id")

	transaction, err := storage.ById(id)

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	var body dto.AddTransactionChargeBody
	context.BindJSON(&body)

	err = storage.AddChargeTransactionPayment(property.ChargePayment{
		Id:          uuid.NewString(),
		Transaction: transaction,
		Dollars:     body.Dollars,
		Date:        body.Date,
	})
	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	context.Status(http.StatusOK)

}

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

	date := context.Query("date")

	if transactionType == "CHARGE" {
		transactions, err := storage.ChargeTransactions(propertyId, date)

		if err != nil {
			context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
			return
		}
		context.IndentedJSON(http.StatusOK, transactions)
		return
	}

	transactions, err := storage.Transactions(propertyId, transactionType, date)

	fmt.Printf("%+v", transactions)

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

	context.IndentedJSON(http.StatusCreated, transactions)
}

func DeleteTransaction(context *gin.Context) {
	id := context.Param("id")
	transactionType := context.Param("type")

	if err := storage.Delete(id, transactionType); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.Status(http.StatusOK)
}
