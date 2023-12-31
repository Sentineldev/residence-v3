export type IncomingExpenseDto = {
    ID: string;
    Concept: string;
    Type: string;
    Date: String;
    Dollars: Number;
    Bolivares: Number;
    ChangeRate: number;
}

export type CreateConceptoDto = {
    Concept: String;
    Type: String;
    Date: String;
    Dollars: Number;
    Bolivares: Number;
    ChangeRate: Number;
}