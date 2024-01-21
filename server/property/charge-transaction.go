package property

type ChargeTransaction struct {
	Transaction  Transaction
	Status       string // PENDING - PAYED
	DollarsPayed float64
}
