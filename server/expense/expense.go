package expense

type Expense struct {
	// ID         sql.NullString
	// Concept    sql.NullString
	// Type       sql.NullString
	// Date       sql.ColumnType
	// Dollars    sql.NullFloat64
	// Bolivares  sql.NullFloat64
	// ChangeRate sql.NullFloat64
	ID         string
	Concept    string
	Type       string
	Date       string
	Dollars    float64
	Bolivares  float64
	ChangeRate float64
}

type Stats struct {
	Estimated float64
	Real      float64
}
