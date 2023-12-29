package controller

import (
	"fmt"
	"net/http"
	"server/expense"
	"server/expense/storage"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Expenses(context *gin.Context) {
	fmt.Println("Buscar todos los gastos")
	expenses, err := storage.GetExpenses()

	if err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, expenses)
}

func ById(context *gin.Context) {
	id := context.Param("id")

	expense, err := storage.ById(id)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, expense)
}

func Create(context *gin.Context) {

	var newExpense = expense.Expense{ID: uuid.NewString()}

	if err := context.BindJSON(&newExpense); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	if err := storage.Create(newExpense); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusCreated, newExpense)
}

func Update(context *gin.Context) {
	id := context.Param("id")

	currentExpense, err := storage.ById(id)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}
	var updatedExpense expense.Expense
	if err := context.BindJSON(&updatedExpense); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	var storedExpense = expense.Expense{
		ID:         currentExpense.ID,
		Concept:    updatedExpense.Concept,
		Type:       updatedExpense.Type,
		Date:       updatedExpense.Date,
		Dollars:    updatedExpense.Dollars,
		Bolivares:  updatedExpense.Bolivares,
		ChangeRate: updatedExpense.ChangeRate,
	}
	if err := storage.Update(storedExpense); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, storedExpense)
}

func Delete(context *gin.Context) {
	id := context.Param("id")

	if _, err := storage.ById(id); err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": err.Error()})
		return
	}

	if err := storage.Delete(id); err != nil {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}
	context.IndentedJSON(http.StatusOK, gin.H{})
}
