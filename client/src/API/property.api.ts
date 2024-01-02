export default class PropertyAPI {


    constructor() {}



    public static async getProperties() {
        const response = await fetch('http://localhost:8001/properties')
        const data = await response.json()
        return data
    }

    public static async getProperty(symbol: string) {
        const response = await fetch(`http://localhost:8001/properties/${encodeURIComponent(symbol)}`)
        const data = await response.json()
        return data
    }

    public static async getTransactions(id: string, type: 'PAYMENT' | 'CHARGE' ) {
        const response = await fetch(`http://localhost:8001/properties/transaction/${encodeURIComponent(id)}/${encodeURIComponent(type)}`)
        const data = await response.json()
        return data
    }


}