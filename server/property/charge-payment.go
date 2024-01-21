package property

type ChargePayment struct {
	Id          string
	Transaction DBTransaction
	Dollars     float64
	Date        string
}
