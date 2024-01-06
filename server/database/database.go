package database

import (
	"database/sql"
	"errors"
	"fmt"

	_ "github.com/lib/pq"
)

// const (
// 	host     = "localhost"
// 	port     = 5432
// 	user     = "postgres"
// 	password = "70242526e"
// 	dbname   = "residencia"
// )

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "70242526e"
	dbname   = "residence"
)

func Connection() (*sql.DB, error) {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)
	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return &sql.DB{}, errors.New("database connection failed")
	}
	return db, nil
}
