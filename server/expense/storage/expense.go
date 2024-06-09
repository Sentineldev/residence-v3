package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"server/database"
	"server/expense"
	"strings"
)

func Stats(month int, year int) (expense.Stats, error) {

	connection, err := database.Connection()

	if err != nil {
		return expense.Stats{}, err
	}

	var stats expense.Stats
	row := connection.QueryRow(`
	select 
	coalesce(sum(case when e."type" = 'REAL' then  e.dollars  end),0) as REAL,
	coalesce(sum(case when e."type" = 'ESTIMATED' then  e.dollars  end  ),0) as ESTIMATED
	from expense e where extract(year from e."date") = $1 and extract(month from e."date") = $2
	`, year, month).Scan(&stats.Real, &stats.Estimated)

	if row != nil {
		if row == sql.ErrNoRows {
			return expense.Stats{}, row
		}
		return expense.Stats{}, row
	}

	defer connection.Close()

	return stats, nil
}

func GetExpenses(expenseType string, date string, search string) ([]expense.Expense, error) {

	connection, err := database.Connection()
	if err != nil {
		return nil, errors.New(err.Error())
	}

	words := strings.Fields(search)
	var query string
	for _, element := range words {
		query += "%%" + element + "%%"
	}
	// rows, err := connection.Query("SELECT * FROM expense where type = $1 and date >= $2 and LOWER(concept) like $3",
	// 	expenseType,
	// 	date,
	// 	fmt.Sprintf("%%"+strings.ToLower(query)+"%%"))

	rows, err := connection.Query("SELECT * FROM expense where type = $1 and EXTRACT(MONTH FROM date) = $2 and EXTRACT(YEAR FROM date) = $3 and LOWER(concept) like $4",
		expenseType,
		strings.Split(date, "-")[1],
		strings.Split(date, "-")[0],
		fmt.Sprintf("%%"+strings.ToLower(query)+"%%"))
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
