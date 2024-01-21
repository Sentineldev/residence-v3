package storage

import (
	"database/sql"
	"fmt"
	"server/database"
	"server/property"
)

func ById(id string) (property.DBTransaction, error) {

	connection, err := database.Connection()

	if err != nil {
		return property.DBTransaction{}, err
	}

	query := "SELECT * FROM property_transaction WHERE id = $1"

	var transaction property.DBTransaction
	row := connection.QueryRow(query, id).Scan(
		&transaction.Transaction.Id,
		&transaction.Property,
		&transaction.Transaction.Concept,
		&transaction.Transaction.Type,
		&transaction.Transaction.Date,
		&transaction.Transaction.Dollars,
		&transaction.Transaction.Bolivares,
		&transaction.Transaction.ChangeRate,
	)

	if row != nil {
		if row == sql.ErrNoRows {
			return property.DBTransaction{}, row
		}
		return property.DBTransaction{}, row
	}
	defer connection.Close()
	return transaction, nil
}

func Delete(transactionId string, transactionType string) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := "DELETE FROM property_transaction WHERE id = $1"

	if transactionType == "CHARGE" {
		queryAux := "DELETE FROM charge_transaction WHERE transaction_id  = $1"
		queryAux2 := "DELETE FROM charge_payment WHERE transaction_id  = $1"
		if _, err := connection.Query(queryAux, transactionId); err != nil {
			return err
		}
		if _, err := connection.Query(queryAux2, transactionId); err != nil {
			return err
		}
	}

	if _, err := connection.Query(query, transactionId); err != nil {
		return err
	}
	defer connection.Close()

	return nil
}

func Transactions(id string, transactionType string) ([]property.Transaction, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := "SELECT id, concept, type, date,  dollars, bolivares, change_rate FROM property_transaction WHERE property_id = $1 AND type = $2"

	rows, err := connection.Query(query, id, transactionType)

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

func ChargeTransactions(id string) ([]property.ChargeTransaction, error) {
	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := `
	SELECT pt.id, pt.concept, pt.type ,pt.date, pt.dollars, pt.bolivares, pt.change_rate, ct.dollars_payed, ct.status 
	FROM 
	charge_transaction ct 
	JOIN property_transaction pt ON ct.transaction_id  = pt.id 
	WHERE ct.property_id = $1
	`
	rows, err := connection.Query(query, id)
	if err != nil {
		return nil, err
	}

	var transactions []property.ChargeTransaction

	for rows.Next() {
		var transaction property.ChargeTransaction
		if err := rows.Scan(
			&transaction.Transaction.Id,
			&transaction.Transaction.Concept,
			&transaction.Transaction.Type,
			&transaction.Transaction.Date,
			&transaction.Transaction.Dollars,
			&transaction.Transaction.Bolivares,
			&transaction.Transaction.ChangeRate,
			&transaction.DollarsPayed,
			&transaction.Status,
		); err != nil {
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

	var chargeTransactions []property.DBChargeTransaction
	for _, transaction := range transactions {
		if transaction.Transaction.Type == "CHARGE" {
			chargeTransactions = append(chargeTransactions, property.DBChargeTransaction{
				Transaction: property.ChargeTransaction{Transaction: transaction.Transaction, Status: "PENDING", DollarsPayed: 0},
				Property:    transaction.Property,
			})
		}
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

	err = RegisterMultipleChargeTransaction(chargeTransactions)

	if err != nil {
		return err
	}
	return nil
}

func RegisterMultipleChargeTransaction(transactions []property.DBChargeTransaction) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := "INSERT INTO charge_transaction(transaction_id, property_id, status, dollars_payed) VALUES "

	vals := []interface{}{}
	for index, element := range transactions {

		query += fmt.Sprintf("($%d,$%d,$%d,$%d),",
			4*index+1, 4*index+2, 4*index+3, 4*index+4)

		vals = append(vals,
			element.Transaction.Transaction.Id,
			element.Property,
			element.Transaction.Status,
			element.Transaction.DollarsPayed,
		)
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

func AddChargeTransactionPayment(payment property.ChargePayment) error {
	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := "INSERT INTO charge_payment(id, transaction_id, property_id, dollars, date) VALUES ($1, $2, $3, $4, $5)"
	statement, err := connection.Prepare(query)

	if err != nil {
		return err
	}

	result, err := statement.Exec(payment.Id, payment.Transaction.Transaction.Id, payment.Transaction.Property, payment.Dollars, payment.Date)

	if err != nil {
		return err
	}
	result.RowsAffected()

	defer connection.Close()

	return nil
}
