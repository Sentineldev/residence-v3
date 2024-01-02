import { CreateConceptoDto } from "./dto/expense.dto"

export default class ExpenseAPI {


    constructor() {}



    public static async getExpenses() {
        const response = await fetch('http://localhost:8001/expenses')
        const data = await response.json()
        return data
    }

    public static async create(body: CreateConceptoDto) {
        const response = await fetch('http://localhost:8001/expenses', {
            method: "POST",
            body: JSON.stringify(body)
        })
        return response
    }

    public static async update(id: string, body: CreateConceptoDto) {
        const response = await fetch(`http://localhost:8001/expenses/${encodeURIComponent(id)}`, {
            method: "PUT",
            body: JSON.stringify(body)
        })
        return response
    }

    public static async delete(id: string) {
        const response = await fetch(`http://localhost:8001/expenses/${encodeURIComponent(id)}`, {
            method: "DELETE",
        })
        return response
    }

}