package property

type Transaction struct {
	Id         string
	Concept    string
	Date       string
	Dollars    float64
	Bolivares  float64
	ChangeRate float64
	Type       string // 'PAYMENT' | 'CHARGE'
}

type DBTransaction struct {
	Transaction Transaction
	Property    string
}

type DBChargeTransaction struct {
	Transaction ChargeTransaction
	Property    string
}
