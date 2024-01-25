import { IncomingPropertyDto } from "../../../API/dto/property.dto"
import { createSignal, createResource, For, Show } from "solid-js";
import PropertyAPI from "../../../API/property.api";
import TransactionDisplay from "./transaction-display";
import ChargeTransactionDisplay from "./charge-transaction-display";

export type TransactionsDisplayProps = {
    property: IncomingPropertyDto;
}
export default function TransactionsDisplay({ property }: TransactionsDisplayProps) {

    const [type, setType] = createSignal<"CHARGE" | "PAYMENT">("CHARGE");

    const [dateFilter, setDate] = createSignal(new Date().toISOString().split("T")[0]);

    const [transactions, { mutate, refetch }] = createResource(
        () => [property, type, dateFilter] as const,
        ([property, type, dateFilter]) => PropertyAPI.getTransactions(property.Id, type(), dateFilter())
    );


    function onSelectHandler(e: Event & {
        currentTarget: HTMLSelectElement;
        target: HTMLSelectElement;
    }
    ) {
        const value = e.target.value as "CHARGE" | "PAYMENT";
        setType(value);
        // refetch();
        // mutate();
        query();
    }


    function query(){
        refetch();
        mutate();
    }   

    return (

        <div class="py-6">
            <header class="font-semibold text-2xl text-secondary">Transacciones</header>
            <select onchange={onSelectHandler} class="outline-none p-2 px-4 bg-transparent border-primary border  rounded-lg my-4" name="type" id="type">
                <option value="CHARGE">Cargos</option>
                <option value="PAYMENT">Pagos</option>
            </select>
            <div class="flex flex-col py-2 items-start border-b border-neutral-300 lg:w-1/4">
                <label class="font-bold px-1">Fecha</label>
                <input onchange={(e) => { setDate(e.target.value); query();  }} value={dateFilter()} type="date" name="" id="" class=" bg-transparent outline-none w-full"/>
            </div>
            <Show when={transactions()}>
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
                    (type() === "CHARGE" ? <ChargeTransactionDisplay property={property}  transaction={transaction} /> : <TransactionDisplay  transaction={transaction} />)}
                </For>
            </Show>
            
        </div>
    );
}