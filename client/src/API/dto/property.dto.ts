

export type TransactionType = 'CHARGE' | 'PAYMENT';
export type ChargeTransactionStatus = "PENDING" | "PAYED";

export type IncomingResidentDto = {
    Id: string;
    Identification: string;
    Name: string;
}
export type IncomingPropertyDto = {
    Id: string;
    Symbol: string;
    Floor: number;
    Balance: number;
    Owner: IncomingResidentDto;
}

export type IncomingTransactionDto = {
    Id: string;
    Concept: string;
    Date: string;
    Dollars: number;
    Bolivares: number;
    ChangeRate: number;
    Type: TransactionType;
}


export type IncomingChargeTransactionDto = {
    Transaction: IncomingTransactionDto;
    Status: ChargeTransactionStatus;
    DollarsPayed: number;
}


export type RegisterTransactionDto = {
    Concept: string;
    Date: string;
    Dollars: number;
    Bolivares:  number;
    ChangeRate: number;
    Properties: string[];
}

export type AddChargePaymentBody = {
    Dollars: number;
    Date: string;
}