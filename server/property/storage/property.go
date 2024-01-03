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

	rows, err := connection.Query(`
	SELECT p.id, p.symbol, p.floor,
	(
	(SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	(SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE') 
	) balance ,
	r.id as owner_id,
	r.identification,
	r.name
	FROM property p join resident r on r.id = p.owner_id	
	`)
	// rows, err := connection.Query("SELECT * FROM property")

	fmt.Printf("Rows: %+v: ", rows)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	var properties []property.Property

	for rows.Next() {
		var property property.Property
		if err := rows.Scan(&property.Id, &property.Symbol, &property.Floor, &property.Balance, &property.Owner.Id, &property.Owner.Identification, &property.Owner.Name); err != nil {
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
	SELECT p.id, p.symbol, p.floor,
	(
	(SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'PAYMENT') -
	(SELECT coalesce(SUM(dollars),0) from property_transaction pt where pt.property_id  = p.id and type = 'CHARGE') 
	)balance ,
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
