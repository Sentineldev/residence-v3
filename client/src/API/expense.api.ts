import { CreateConceptoDto } from "./dto/expense.dto"

export default class ExpenseAPI {


    constructor() {}



    public static async getExpenses() {
        const response = await fetch('http://localhost:8001/expenses')
        const data = await response.json()
        return data
    }

    public static async Create(body: CreateConceptoDto) {
        const response = await fetch('http://localhost:8001/expenses', {
            method: "POST",
            body: JSON.stringify(body)
        })
        return response
    }

}