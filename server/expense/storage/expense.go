package storage

import (
	"database/sql"
	"errors"
	"server/database"
	"server/expense"
)

func GetExpenses() ([]expense.Expense, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, errors.New(err.Error())
	}

	rows, err := connection.Query("SELECT * FROM expense")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var expenses []expense.Expense

	for rows.Next() {
		var expense expense.Expense
		if err := rows.Scan(&expense.ID, &expense.Concept, &expense.Type, &expense.Date, &expense.Dollars, &expense.Bolivares, &expense.ChangeRate); err != nil {
			return expenses, err
		}
		expenses = append(expenses, expense)
	}
	if err = rows.Err(); err != nil {
		return expenses, err
	}

	defer connection.Close()
	return expenses, nil

}

func ById(id string) (expense.Expense, error) {
	connection, err := database.Connection()
	if err != nil {
		return expense.Expense{}, err
	}
	var findExpense expense.Expense
	row := connection.QueryRow("SELECT * FROM expense where id = $1", id).
		Scan(&findExpense.ID,
			&findExpense.Concept,
			&findExpense.Type,
			&findExpense.Date,
			&findExpense.Dollars,
			&findExpense.Bolivares,
			&findExpense.ChangeRate)
	if row != nil {
		if row == sql.ErrNoRows {
			return expense.Expense{}, row
		}
		return expense.Expense{}, row
	}
	defer connection.Close()
	return findExpense, nil

}

func Create(expense expense.Expense) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	if _, err := connection.Exec("INSERT INTO expense(id, concept, type, date, dollars, bolivares, change_rate) VALUES ($1,$2,$3,$4,$5,$6,$7)",
		expense.ID, expense.Concept, expense.Type, expense.Date, expense.Dollars, expense.Bolivares, expense.ChangeRate); err != nil {

		return err
	}
	defer connection.Close()
	return nil
}

func Update(expense expense.Expense) error {
	connection, err := database.Connection()

	if err != nil {
		return err
	}

	if _, err := connection.Exec(`
	UPDATE expense SET concept = $1, type = $2, date = $3, dollars = $4, bolivares = $5, change_rate = $6
	WHERE id = $7
	`, expense.Concept, expense.Type, expense.Date, expense.Dollars, expense.Bolivares, expense.ChangeRate, expense.ID); err != nil {
		return err
	}

	defer connection.Close()
	return nil
}

func Delete(id string) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	if _, err := connection.Exec("DELETE FROM expense WHERE id = $1", id); err != nil {
		return err
	}

	defer connection.Close()

	return nil
}
