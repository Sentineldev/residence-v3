package storage

import (
	"fmt"
	"server/database"
	"server/property"
)

func Transactions(propertyId string, transactionType string) ([]property.Transaction, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := "SELECT id, concept, type, date,  dollars, bolivares, change_rate FROM property_transaction WHERE property_id = $1 AND type = $2"

	rows, err := connection.Query(query, propertyId, transactionType)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var transactions []property.Transaction

	for rows.Next() {
		var transaction property.Transaction
		if err := rows.Scan(&transaction.Id,
			&transaction.Concept,
			&transaction.Type, &transaction.Date, &transaction.Dollars, &transaction.Bolivares, &transaction.ChangeRate); err != nil {
			return transactions, err
		}
		transactions = append(transactions, transaction)
	}
	if err = rows.Err(); err != nil {
		return transactions, err
	}
	defer connection.Close()

	return transactions, nil
}

func RegisterMultiple(transactions []property.DBTransaction) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := "INSERT INTO property_transaction(id, property_id, concept, type, date, dollars, bolivares, change_rate) VALUES "

	vals := []interface{}{}
	for index, element := range transactions {

		query += fmt.Sprintf("($%d,$%d,$%d,$%d,$%d,$%d,$%d,$%d),",
			8*index+1, 8*index+2, 8*index+3, 8*index+4,
			8*index+5, 8*index+6, 8*index+7, 8*index+8)

		vals = append(vals,
			element.Transaction.Id,
			element.Property,
			element.Transaction.Concept,
			element.Transaction.Type,
			element.Transaction.Date,
			element.Transaction.Dollars,
			element.Transaction.Bolivares,
			element.Transaction.ChangeRate)
	}

	query = query[0 : len(query)-1]
	statement, err := connection.Prepare(query)
	if err != nil {
		return err
	}
	result, err := statement.Exec(vals...)

	if err != nil {
		return err
	}
	result.RowsAffected()
	defer connection.Close()

	return nil
}
