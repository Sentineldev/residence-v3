package dto

type TransactionBody struct {
	Concept    string
	Date       string
	Dollars    float64
	Bolivares  float64
	ChangeRate float64
	Properties []string
}
