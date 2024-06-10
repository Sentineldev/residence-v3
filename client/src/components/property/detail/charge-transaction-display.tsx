import { IncomingChargeTransactionDto, IncomingPropertyDto } from "../../../API/dto/property.dto"
import transactionStatusFormater from "../utils/transaction-status-formater";
import DeleteTransactionModal from "./modals/delete-transaction-modal";
import AddChargePaymentModal from "./modals/add-charge-payment-modal";
import ShowChargeTransactionPayments from "./modals/show-charge-transaction-payments";

export type ChargeTransactionDisplayProps = {
    transaction: IncomingChargeTransactionDto;
    property: IncomingPropertyDto;
}
export default function ChargeTransactionDisplay({ transaction, property }: ChargeTransactionDisplayProps) {


    const { Concept, Date, Dollars, Type } = transaction.Transaction;
    return (
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-2 py-4 items-center border-b border-b-neutral-300">
            <div>
                <p class={`${transaction.Status === "PAYED" ? 'bg-green-400' : 'bg-primary'} w-fit p-1 px-2 rounded text-secondary font-semibold my-2`}>{transactionStatusFormater(transaction.Status)}</p>
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
                    <span>Total: </span>
                    <span>{Dollars} $</span>
                </header>
                <header>
                    <span>Pagado: </span>
                    <span>{transaction.DollarsPayed} $</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden font-semibold text-secondary">Tipo: </span>
                    <span>{Type === "CHARGE" ? "Cargo" : "Pago" }</span>
                </header>
            </div>
            <div class="flex gap-4">
                <AddChargePaymentModal property={property} charge={transaction}/>
                <ShowChargeTransactionPayments charge={transaction} />
                <DeleteTransactionModal transaction={transaction.Transaction}/>
            </div>
        </div>
    );
}