import { AddChargePaymentBody, RegisterTransactionDto } from "./dto/property.dto"
import { API_URL } from "./url"

export default class PropertyAPI {


    constructor() {}



    public static async getProperties() {
        const response = await fetch(`${API_URL}/properties`)
        const data = await response.json()
        return data
    }

    public static async getProperty(symbol: string) {
        const response = await fetch(`${API_URL}/properties/${encodeURIComponent(symbol)}`)
        const data = await response.json()
        return data
    }

    public static async getTransactions(id: string, type: 'PAYMENT' | 'CHARGE' ) {
        const response = await fetch(`${API_URL}/properties/transaction/${encodeURIComponent(id)}/${encodeURIComponent(type)}`)
        const data = await response.json()
        return data
    }

    public static async RegisterTransaction(type: string, body: RegisterTransactionDto) {
        const response = await fetch(`${API_URL}/properties/transaction/${encodeURIComponent(type)}`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        return response;
    }

    public static async AddChargePayment(id: string, body: AddChargePaymentBody) {
        const response = await fetch(`${API_URL}/properties/transaction/add-payment/${encodeURIComponent(id)}`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
        return response;
    }

    public static async DeleteTransaction(id: string, type: string) {
        const response = await fetch(`${API_URL}/properties/transaction/${encodeURIComponent(id)}/${encodeURIComponent(type)}`, {
            method: 'DELETE',
        })
        return response;
    }


}