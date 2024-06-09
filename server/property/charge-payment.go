package property

type ChargePayment struct {
	Id          string
	Transaction DBTransaction
	Dollars     float64
	Date        string
}

type DBChargePayment struct {
	Id            string
	TransactionId string
	PropertyId    string
	Dollars       float64
	Date          string
}
