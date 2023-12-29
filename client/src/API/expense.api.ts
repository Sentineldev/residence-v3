export default class ExpenseAPI {


    constructor() {}



    public static async getExpenses() {
        const response = await fetch('http://localhost:8080/expenses')
        const data = await response.json()
        return data
    }

}