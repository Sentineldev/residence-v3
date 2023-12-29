import { For } from "solid-js";
import { IncomingExpenseDto } from "../../API/dto/expense.dto"
import ExpenseDisplay from "./expense-display";

export type ExpensesDisplayProps = {
    expenses: IncomingExpenseDto[];
}
export default function ExpensesDisplay({ expenses }: ExpensesDisplayProps) {

    return (
        <div class="flex flex-col gap-4">
        <div class="grid grid-cols-4 ">
            <div>
                <header class="font-bold text-xl">Concepto</header>
            </div>
            <div>
                <header class="font-bold text-xl">Fecha</header>
            </div>
            <div>
                <header class="font-bold text-xl">Tipo</header>
            </div>
            <div>
                <header class="font-bold text-xl">Dolares</header>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <For each={expenses}>
                {(expense) => (<ExpenseDisplay expense={expense} />)}
            </For>
        </div>
        </div>
    );
}