import { For } from "solid-js";
import { IncomingExpenseDto } from "../../API/dto/expense.dto"
import ExpenseDisplay from "./expense-display";

export type ExpensesDisplayProps = {
    expenses: IncomingExpenseDto[];
    selectExpense: (expense: IncomingExpenseDto | undefined, action: 'DELETE' | 'UPDATE' | 'NONE') => void;
}
export default function ExpensesDisplay({ expenses, selectExpense }: ExpensesDisplayProps) {

    return (
        <div class="flex flex-col gap-4 py-8">
            <div class="hidden lg:grid lg:grid-cols-5 gap-4 items-center ">
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
                    {(expense) => (<ExpenseDisplay selectExpense={selectExpense} expense={expense} />)}
                </For>
            </div>
        </div>
    );
}