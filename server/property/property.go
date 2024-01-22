package property

type Resident struct {
	Id             string
	Identification string
	Name           string
}

type Property struct {
	Id      string
	Symbol  string
	Floor   int32
	Balance float64
	Debt    float64
	Owner   Resident
}
