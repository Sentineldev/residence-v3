import { Show, createResource, createSignal, onMount } from "solid-js";
import ExpenseAPI from "../../API/expense.api";
// import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import ExpensesDisplay from "./expenses-display";
import CreateExpenseModal from "./modals/create-expense";
import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import UpdateExpenseModal from "./modals/update-expense";

export default function ExpenseIndex() {

    const [onCreated, setOnCreated] = createSignal<boolean>(false)

    const [selectedExpense, setSelectedExpense] = createSignal<IncomingExpenseDto>();
    const [expenseList] = createResource<IncomingExpenseDto[], boolean>(onCreated, ExpenseAPI.getExpenses)

    function onCreatedHandler() {
        setOnCreated((previous) => !previous)
    }

    function onSelectExpenseHandler(expense: IncomingExpenseDto | undefined) {
        setSelectedExpense(expense);
        if (expense) OpenModalHandler();
    }   

    function OpenModalHandler() {

        const dialog = document.getElementById('update-expense-modal') as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    onMount(() => {
        setOnCreated((previous) => !previous)
    })
    return (
        <div class="p-12">
            <header class="font-bold text-4xl text-center py-6">Detalle de Gastos</header>
            <div>
                <CreateExpenseModal onCreatedHandler={onCreatedHandler}/>
                { selectedExpense() && <UpdateExpenseModal selectExpense={onSelectExpenseHandler} onCreatedHandler={onCreatedHandler} expense={selectedExpense()!} />  }
            </div>
            <Show when={expenseList()} fallback={<p> loading...</p>} >
                <div>
                    <ExpensesDisplay selectExpense={onSelectExpenseHandler} expenses={expenseList()!} />
                </div>
            </Show>
        </div>
    );
}