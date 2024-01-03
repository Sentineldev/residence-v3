
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
    Type: 'CHARGE' | 'PAYMENT';
}

export type RegisterTransactionDto = {
    Concept: string;
    Date: string;
    Dollars: number;
    Bolivares:  number;
    ChangeRate: number;
    Properties: string[];
}