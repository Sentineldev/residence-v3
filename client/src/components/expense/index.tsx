import { Show, createResource } from "solid-js";
import ExpenseAPI from "../../API/expense.api";
import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import ExpensesDisplay from "./expenses-display";
import CreateExpenseModal from "./modals/create-expense";

export default function ExpenseIndex() {

    const [expenseList] = createResource<IncomingExpenseDto[]>(ExpenseAPI.getExpenses)
    return (
        <div class="p-12">
        <header class="font-bold text-4xl text-center py-6">Detalle de Gastos</header>
        <div>
            <CreateExpenseModal/>
        </div>
        <Show when={expenseList()} fallback={<p> loading...</p>} >
            <div>
                <ExpensesDisplay expenses={expenseList()!} />
            </div>
        </Show>
        </div>
    );
}