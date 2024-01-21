import { IncomingPropertyDto } from "../../../API/dto/property.dto"
import { createSignal, createResource, For } from "solid-js";
import PropertyAPI from "../../../API/property.api";
import TransactionDisplay from "./transaction-display";
import ChargeTransactionDisplay from "./charge-transaction-display";

export type TransactionsDisplayProps = {
    property: IncomingPropertyDto;
}
export default function TransactionsDisplay({ property }: TransactionsDisplayProps) {

    const [type, setType] = createSignal<"CHARGE" | "PAYMENT">("CHARGE");

    const [transactions, { mutate, refetch }] = createResource(
        () => [property, type] as const,
        ([property, type]) => PropertyAPI.getTransactions(property.Id, type())
    );


    function onSelectHandler(e: Event & {
        currentTarget: HTMLSelectElement;
        target: HTMLSelectElement;
    }
    ) {
        const value = e.target.value as "CHARGE" | "PAYMENT";
        setType(value);
        refetch(value);
        mutate();
    }

    return (

        <div class="py-6">
            <header class="font-semibold text-2xl text-secondary">Transacciones</header>
            <select onchange={onSelectHandler} class="outline-none p-2 px-4 bg-transparent border-primary border  rounded-lg my-4" name="type" id="type">
                <option value="CHARGE">Cargos</option>
                <option value="PAYMENT">Pagos</option>
            </select>
            <div class="hidden lg:grid grid-cols-5 gap-2 py-4 items-center">
                <div>
                    <header class="font-semibold text-secondary">Concepto</header>
                </div>
                <div>
                    <header class="font-semibold text-secondary">Fecha</header>
                </div>
                <div>
                    <header class="font-semibold text-secondary">Dolares</header>
                </div>
                <div>
                    <header class="font-semibold text-secondary">Tipo</header>
                </div>
            </div>
            <For each={transactions()}>
                {(transaction) => 
                (type() === "CHARGE" ? <ChargeTransactionDisplay  transaction={transaction} /> : <TransactionDisplay  transaction={transaction} />)}
            </For>
        </div>
    );
}