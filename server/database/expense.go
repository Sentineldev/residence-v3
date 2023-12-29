package database

import (
	"errors"
	"server/expense"
)

func GetExpenses() []expense.Expense {

	var expenses []expense.Expense

	connection := Connection()

	result, err := connection.Query("SELECT * FROM expense")

	if err != nil {
		panic(err)
	}

	defer result.Close()

	for result.Next() {
		var expense expense.Expense
		if err := result.Scan(&expense.ID, &expense.Concept, &expense.Type, &expense.Date, &expense.Dollars, &expense.Bolivares, &expense.ChangeRate); err != nil {
			panic(err)
		}
		expenses = append(expenses, expense)

	}
	defer connection.Close()

	return expenses
}

func GetExpenseById(id string) (expense.Expense, error) {

	connection := Connection()

	result, err := connection.Query("SELECT * FROM expense WHERE id = $1", id)

	if err != nil {
		return expense.Expense{}, errors.New("Expense not found")
	}

	defer result.Close()

	var expense expense.Expense
	if err := result.Scan(&expense.ID, &expense.Concept, &expense.Type, &expense.Date, &expense.Dollars, &expense.Bolivares, &expense.ChangeRate); err != nil {
		panic(err)
	}

	defer connection.Close()

	return expense, nil
}
