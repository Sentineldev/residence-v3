package storage

import (
	"database/sql"
	"fmt"
	"server/database"
	"server/property"
	"strings"
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

func PaymentById(id string) (property.DBChargePayment, error) {
	connection, err := database.Connection()

	if err != nil {
		return property.DBChargePayment{}, err
	}

	query := "SELECT * FROM charge_payment WHERE id = $1"

	var payment property.DBChargePayment
	row := connection.QueryRow(query, id).Scan(
		&payment.Id,
		&payment.TransactionId,
		&payment.PropertyId,
		&payment.Dollars,
		&payment.Date,
	)

	if row != nil {
		if row == sql.ErrNoRows {
			return property.DBChargePayment{}, row
		}
		return property.DBChargePayment{}, row
	}
	defer connection.Close()
	return payment, nil
}

func ChargeTransactionById(id string) (property.DBChargeTransaction, error) {

	connection, err := database.Connection()

	if err != nil {
		return property.DBChargeTransaction{}, err
	}

	query := `
	SELECT pt.id, pt.property_id , pt.concept, pt.type ,pt.date, pt.dollars, pt.bolivares, pt.change_rate, ct.dollars_payed, ct.status 
	FROM 
	charge_transaction ct 
	JOIN property_transaction pt ON ct.transaction_id  = pt.id 
	WHERE transaction_id = $1
	`

	var transaction property.DBChargeTransaction
	row := connection.QueryRow(query, id).Scan(
		&transaction.Transaction.Transaction.Id,
		&transaction.Property,
		&transaction.Transaction.Transaction.Concept,
		&transaction.Transaction.Transaction.Type,
		&transaction.Transaction.Transaction.Date,
		&transaction.Transaction.Transaction.Dollars,
		&transaction.Transaction.Transaction.Bolivares,
		&transaction.Transaction.Transaction.ChangeRate,
		&transaction.Transaction.DollarsPayed,
		&transaction.Transaction.Status,
	)

	if row != nil {
		if row == sql.ErrNoRows {
			return property.DBChargeTransaction{}, row
		}
		return property.DBChargeTransaction{}, row
	}
	defer connection.Close()
	return transaction, nil
}

func DeleteChargePayment(paymentId string) error {

	payment, err := PaymentById(paymentId)

	if err != nil {
		return err
	}

	connection, err := database.Connection()
	if err != nil {
		return err
	}

	if err != nil {
		return err
	}

	query := `DELETE FROM charge_payment WHERE id = $1`

	fmt.Printf("%s\n", paymentId)

	if _, err := connection.Query(query, paymentId); err != nil {
		return err
	}

	defer connection.Close()

	UpdateTransactionStatus(payment.TransactionId)
	UpdatePropertyDebt(payment.PropertyId)
	AddPropertyBalance(payment.PropertyId, payment.Dollars)
	return nil
}

func Delete(transactionId string, transactionType string) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	transaction, err := ById(transactionId)
	if err != nil {
		return err
	}

	if transactionType == "PAYMENT" {
		transaction, err := ById(transactionId)
		if err != nil {
			return err
		}
		if err := AddPropertyBalance(transaction.Property, -transaction.Transaction.Dollars); err != nil {
			return err
		}
	}

	if transactionType == "CHARGE" {
		transaction, err := ChargeTransactionById(transactionId)

		if err != nil {
			return err
		}
		if err := AddPropertyBalance(transaction.Property, transaction.Transaction.DollarsPayed); err != nil {
			return err
		}
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
	UpdatePropertyDebt(transaction.Property)

	return nil
}

func Transactions(id string, transactionType string, date string) ([]property.Transaction, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := `
	SELECT id, concept, type, date,  dollars, bolivares, change_rate FROM property_transaction WHERE property_id = $1 AND type = $2
	AND EXTRACT(YEAR FROM date) = $3 AND EXTRACT(MONTH FROM date) = $4
	`
	// query := `
	// SELECT id, concept, type, date,  dollars, bolivares, change_rate FROM property_transaction WHERE property_id = $1 AND type = $2
	// `

	// rows, err := connection.Query(query, id, transactionType)
	rows, err := connection.Query(query, id, transactionType, strings.Split(date, "-")[0], strings.Split(date, "-")[1])

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

func ChargeTransactions(id string, date string) ([]property.ChargeTransaction, error) {
	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := `
	SELECT pt.id, pt.concept, pt.type ,pt.date, pt.dollars, pt.bolivares, pt.change_rate, ct.dollars_payed, ct.status
	FROM
	charge_transaction ct
	JOIN property_transaction pt ON ct.transaction_id  = pt.id
	WHERE ct.property_id = $1 AND EXTRACT(YEAR FROM pt.date) = $2 AND EXTRACT(MONTH FROM pt.date) = $3
	`
	// query := `
	// SELECT pt.id, pt.concept, pt.type ,pt.date, pt.dollars, pt.bolivares, pt.change_rate, ct.dollars_payed, ct.status
	// FROM
	// charge_transaction ct
	// JOIN property_transaction pt ON ct.transaction_id  = pt.id
	// WHERE ct.property_id = $1
	// `
	rows, err := connection.Query(query, id, strings.Split(date, "-")[0], strings.Split(date, "-")[1])
	// rows, err := connection.Query(query, id)
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

func ChargeTransactionPayments(transactionId string) ([]property.ChargePayment, error) {
	connection, err := database.Connection()

	if err != nil {
		return nil, err
	}

	query := `
	SELECT pt.id, pt.property_id , pt.concept, pt.type ,pt.date, pt.dollars, pt.bolivares, pt.change_rate, cp.id as payment_id ,cp.dollars, cp.date 
	FROM 
	charge_payment cp 
	JOIN property_transaction pt ON cp.transaction_id  = pt.id
	WHERE cp.transaction_id = $1
	`

	rows, err := connection.Query(query, transactionId)
	if err != nil {
		return nil, err
	}

	var transactions []property.ChargePayment

	for rows.Next() {
		var transaction property.ChargePayment
		if err := rows.Scan(
			&transaction.Transaction.Transaction.Id,
			&transaction.Transaction.Property,
			&transaction.Transaction.Transaction.Concept,
			&transaction.Transaction.Transaction.Type,
			&transaction.Transaction.Transaction.Date,
			&transaction.Transaction.Transaction.Dollars,
			&transaction.Transaction.Transaction.Bolivares,
			&transaction.Transaction.Transaction.ChangeRate,
			&transaction.Id,
			&transaction.Dollars,
			&transaction.Date,
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
	if _, err := statement.Exec(vals...); err != nil {
		return err
	}

	defer connection.Close()

	if len(chargeTransactions) > 0 {
		if err := RegisterMultipleChargeTransaction(chargeTransactions); err != nil {
			return err
		}
	}
	for _, property := range transactions {

		// if property.Transaction.Type == "CHARGE" {
		// 	if err := AddPropertyBalance(property.Property, -property.Transaction.Dollars); err != nil {
		// 		return err
		// 	}
		// }
		if property.Transaction.Type == "PAYMENT" {
			if err := AddPropertyBalance(property.Property, property.Transaction.Dollars); err != nil {
				return err
			}
		}
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
	if _, err := statement.Exec(vals...); err != nil {
		return err
	}
	defer connection.Close()

	for _, element := range transactions {
		if err := UpdatePropertyDebt(element.Property); err != nil {
			return err
		}
	}

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

	if _, err := statement.Exec(payment.Id, payment.Transaction.Transaction.Id, payment.Transaction.Property, payment.Dollars, payment.Date); err != nil {
		return err
	}

	if err := AddPropertyBalance(payment.Transaction.Property, -payment.Dollars); err != nil {
		return err
	}

	if err := UpdateTransactionStatus(payment.Transaction.Transaction.Id); err != nil {
		return err
	}

	defer connection.Close()

	if err := UpdatePropertyDebt(payment.Transaction.Property); err != nil {
		return err
	}

	return nil
}

func UpdateTransactionStatus(id string) error {

	transaction, err := ChargeTransactionById(id)
	if err != nil {

		return err
	}

	transactions, err := ChargeTransactionPayments(id)

	if err != nil {

		return err
	}

	var accumulator = 0.00
	for _, element := range transactions {
		accumulator += element.Dollars
	}
	transaction.Transaction.DollarsPayed = accumulator
	if accumulator >= transaction.Transaction.Transaction.Dollars {
		transaction.Transaction.Status = "PAYED"
	}
	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := "UPDATE charge_transaction ct SET dollars_payed = $1, status = $2 WHERE ct.transaction_id = $3"

	statement, err := connection.Prepare(query)

	if err != nil {
		return err
	}

	if _, err := statement.Exec(transaction.Transaction.DollarsPayed, transaction.Transaction.Status, id); err != nil {
		return err
	}

	defer connection.Close()

	return nil

}
