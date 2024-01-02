export type IncomingPropertyDto = {
    Id: string;
    Symbol: string;
    Floor: number;
    Balance: number;
}

export type IncomingTransactionDto = {
    Id: string;
    Concept: string;
    Date: string;
    Dollars: number;
    Bolivares: number;
    ChangeRate: number;
    Type: 'CHARGE' | 'PAYMENT';
}