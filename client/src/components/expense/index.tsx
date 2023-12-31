import { Show, createResource, createSignal } from "solid-js";
// import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import ExpensesDisplay from "./expenses-display";
import CreateExpenseModal from "./modals/create-expense";
import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import UpdateExpenseModal from "./modals/update-expense";
import ExpenseAPI from "../../API/expense.api";
import DeleteExpenseModal from "./modals/delete-expense";

export default function ExpenseIndex() {

    const [selectedExpense, setSelectedExpense] = createSignal<IncomingExpenseDto>();
    const [expenseList, { refetch, mutate }] = createResource<IncomingExpenseDto[], number>(ExpenseAPI.getExpenses)

    function onCreatedHandler() {
        mutate();
        refetch();
    }

    function onSelectExpenseHandler(expense: IncomingExpenseDto | undefined, action: 'DELETE' | 'UPDATE' | 'NONE') {
        setSelectedExpense(expense);
        if (expense) 
            action === 'UPDATE' ? 
                OpenModalHandler('update-expense-modal') : 
                OpenModalHandler('delete-expense-modal');
    }   

    function OpenModalHandler(modalId: string) {

        const dialog = document.getElementById(modalId) as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    return (
        <div class="p-12">
            <header class="font-bold text-4xl text-center py-6">Detalle de Gastos</header>
            <div>
                <CreateExpenseModal onCreatedHandler={onCreatedHandler}/>
                { selectedExpense() && <UpdateExpenseModal selectExpense={onSelectExpenseHandler} onCreatedHandler={onCreatedHandler} expense={selectedExpense()!} />  }
                { selectedExpense() && <DeleteExpenseModal selectExpense={onSelectExpenseHandler} onCreatedHandler={onCreatedHandler} expense={selectedExpense()!} />  }
            </div>
            <Show when={expenseList()} fallback={<p> loading...</p>} >
                <div>
                    <ExpensesDisplay selectExpense={onSelectExpenseHandler} expenses={expenseList()!} />
                </div>
            </Show>
        </div>
    );
}