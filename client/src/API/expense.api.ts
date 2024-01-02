import { CreateConceptoDto } from "./dto/expense.dto"

export default class ExpenseAPI {


    constructor() {}



    public static async getStats(year: number, month: number) {


        const url = new URL(`http://localhost:8001/expenses/stats/${year}/${month}`)

        const response = await fetch(url);

        const data = await response.json()

        return data
    }

    public static async getExpenses(search: string, date: string, type: string) {

        const url = new URL(`http://localhost:8001/expenses`);
        url.searchParams.append('search', encodeURIComponent(search));
        url.searchParams.append('date', date);
        url.searchParams.append('type', type);
        const response = await fetch(url)
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