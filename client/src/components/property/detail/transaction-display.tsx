import { IncomingTransactionDto } from "../../../API/dto/property.dto"

export type TransactionDisplayProps = {
    transaction: IncomingTransactionDto;
}
export default function TransactionDisplay({ transaction }: TransactionDisplayProps) {

    const { Concept, Date, Dollars, Type } = transaction;
    return (
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 py-4 items-center border-b border-b-neutral-300">
            <div>
                <header>
                    <span class="lg:hidden font-semibold text-secondary">Concepto: </span>
                    <span>{Concept.length === 0 ? "Sin Concepto" : Concept}</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden font-semibold text-secondary">Fecha: </span>
                    <span>{Date.split("T")[0]}</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden font-semibold text-secondary">Dolares: </span>
                    <span>{Dollars} $</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden font-semibold text-secondary">Tipo: </span>
                    <span>{Type === "CHARGE" ? "Cargo" : "Pago" }</span>
                </header>
            </div>
        </div>
    );
}