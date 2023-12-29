package expenseController

import (
	"fmt"
	"net/http"
	"server/database"

	"github.com/gin-gonic/gin"
)

func Expenses(context *gin.Context) {
	//Envio todos los expenses
	var expenses = database.GetExpenses()
	context.IndentedJSON(http.StatusOK, expenses)
}

func Create(context *gin.Context) {
	// var newExpense expense.Expense = expense.Expense{ID: sql.NullString{String: uuid.NewString()}}

	// if err := context.BindJSON(&newExpense); err != nil {
	// 	return
	// }
	// database.Expenses = append(database.Expenses, newExpense)
	// context.IndentedJSON(http.StatusCreated, newExpense)
}

func Update(context *gin.Context) {
	//actualizo
	id := context.Param("id")

	context.IndentedJSON(http.StatusOK, id)
}

func GetById(context *gin.Context) {
	//Filtro por ID
	id := context.Param("id")

	expense, err := database.GetExpenseById(id)
	if err != nil {
		context.IndentedJSON(http.StatusNotFound, gin.H{"message": "Expense not found"})
	}

	fmt.Printf("hola %s", expense.ID.String)
	context.IndentedJSON(http.StatusOK, expense)

}

func Delete(context *gin.Context) {
	id := context.Param("id")
	context.IndentedJSON(http.StatusOK, id)
	//Borro los datos de la bd.
}
