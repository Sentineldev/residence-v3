package controller

import (
	"net/http"
	"net/url"
	"server/expense"
	"server/expense/storage"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Stats(context *gin.Context) {
	month, err := strconv.Atoi(context.Param("month"))

	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	year, err := strconv.Atoi(context.Param("year"))
	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	stats, _ := storage.Stats(month, year)

	context.IndentedJSON(http.StatusOK, stats)

}

func Expenses(context *gin.Context) {

	var typeFilter string
	var dateFilter string
	typeQuery := context.Query("type")
	dateQuery := context.Query("date")
	searchQuery, err := url.QueryUnescape(context.Query("search"))

	typeFilter = typeQuery

	if typeQuery != "ESTIMATED" && typeQuery != "REAL" {
		typeFilter = "REAL"
	}
	if err != nil {
		context.IndentedJSON(http.StatusBadRequest, gin.H{"message": err.Error()})
		return
	}

	dateFilter = dateQuery

	if len(dateFilter) == 0 {
		context.IndentedJSON(http.StatusInternalServerError, gin.H{"message": "Wrong parameters"})
		return
	}
	expenses, err := storage.GetExpenses(typeFilter, dateFilter, searchQuery)

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
