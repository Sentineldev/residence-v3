package storage

import (
	"database/sql"
	"errors"
	"fmt"
	"server/database"
	"server/property"
)

func GetProperties() ([]property.Property, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, errors.New(err.Error())
	}

	// query := `
	// SELECT p.id, p.symbol, p.floor,
	// (
	// (SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	// (SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE')
	// ) balance ,
	// r.id as owner_id,
	// r.identification,
	// r.name
	// FROM property p join resident r on r.id = p.owner_id
	// `
	query := `
	SELECT p.id, p.symbol, p.floor,
	p.balance,
	p.debt,
	r.id as owner_id,
	r.identification,
	r.name
	FROM property p join resident r on r.id = p.owner_id	
	`
	rows, err := connection.Query(query)
	// rows, err := connection.Query("SELECT * FROM property")

	fmt.Printf("Rows: %+v: ", rows)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var properties []property.Property

	for rows.Next() {
		var property property.Property
		if err := rows.Scan(&property.Id, &property.Symbol, &property.Floor, &property.Balance, &property.Debt, &property.Owner.Id, &property.Owner.Identification, &property.Owner.Name); err != nil {
			return properties, err
		}
		properties = append(properties, property)
	}
	if err = rows.Err(); err != nil {
		return properties, err
	}

	defer connection.Close()
	return properties, nil
}

func GetBySymbol(symbol string) (property.Property, error) {
	connection, err := database.Connection()
	if err != nil {
		return property.Property{}, err
	}
	var findProperty property.Property

	// query := "SELECT * FROM property where symbol = $1"
	// query := `
	// SELECT p.id, p.symbol, p.floor,
	// (
	// (SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	// (SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE')
	// )balance ,
	// r.id as owner_id,
	// r.identification,
	// r.name
	// FROM property p join resident r on r.id = p.owner_id WHERE p.symbol = $1
	// `
	query := `
	SELECT p.id, p.symbol, p.floor,
	p.balance,
	p.debt,
	r.id as owner_id,
	r.identification,
	r.name
	FROM property p join resident r on r.id = p.owner_id WHERE p.symbol = $1
	`
	row := connection.QueryRow(query, symbol).
		Scan(&findProperty.Id,
			&findProperty.Symbol,
			&findProperty.Floor,
			&findProperty.Balance,
			&findProperty.Debt,
			&findProperty.Owner.Id,
			&findProperty.Owner.Identification,
			&findProperty.Owner.Name)
	if row != nil {
		if row == sql.ErrNoRows {
			return property.Property{}, row
		}
		return property.Property{}, row
	}
	defer connection.Close()
	return findProperty, nil
}

func AddPropertyBalance(property string, value float64) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := `
	UPDATE property SET balance = balance + $1
	WHERE id = $2
	`

	statement, err := connection.Prepare(query)

	if err != nil {
		return err
	}

	if _, err := statement.Exec(value, property); err != nil {
		return err
	}

	defer connection.Close()

	return nil

}

func UpdatePropertyDebt(property string) error {

	connection, err := database.Connection()

	if err != nil {
		return err
	}

	query := `
	UPDATE property p
	SET debt = (SELECT SUM(dollars - dollars_payed) FROM charge_transaction ct JOIN property_transaction pt ON ct.transaction_id = pt.id WHERE pt.property_id = $1)
	WHERE p.id = $1
	`
	statement, err := connection.Prepare(query)
	if err != nil {
		return err
	}

	if _, err := statement.Exec(property); err != nil {
		return err
	}

	defer connection.Close()

	return nil
}
