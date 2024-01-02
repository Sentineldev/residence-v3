package storage

import (
	"database/sql"
	"errors"
	"server/database"
	"server/property"
)

func GetProperties() ([]property.Property, error) {

	connection, err := database.Connection()

	if err != nil {
		return nil, errors.New(err.Error())
	}

	rows, err := connection.Query(`
	SELECT id, symbol, floor,
	(
	(SELECT SUM(dollars)from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	(SELECT SUM(dollars)from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE') 
	)balance FROM property p
	`)
	// rows, err := connection.Query("SELECT * FROM property")
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var properties []property.Property

	for rows.Next() {
		var property property.Property
		if err := rows.Scan(&property.Id, &property.Symbol, &property.Floor, &property.Balance); err != nil {
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
	query := `
	SELECT id, symbol, floor,
	(
	(SELECT SUM(dollars)from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	(SELECT SUM(dollars)from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE') 
	)balance FROM property p WHERE p.symbol = $1
	`
	row := connection.QueryRow(query, symbol).
		Scan(&findProperty.Id,
			&findProperty.Symbol,
			&findProperty.Floor,
			&findProperty.Balance)
	if row != nil {
		if row == sql.ErrNoRows {
			return property.Property{}, row
		}
		return property.Property{}, row
	}
	defer connection.Close()
	return findProperty, nil
}
