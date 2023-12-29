package expense

import "database/sql"

type Expense struct {
	ID         sql.NullString
	Concept    sql.NullString
	Type       sql.NullString
	Date       sql.NullString
	Dollars    sql.NullFloat64
	Bolivares  sql.NullFloat64
	ChangeRate sql.NullFloat64
}
