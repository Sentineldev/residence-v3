import { Show, createResource, createSignal } from "solid-js";
// import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import ExpensesDisplay from "./expenses-display";
import CreateExpenseModal from "./modals/create-expense";
import { IncomingExpenseDto } from "../../API/dto/expense.dto";
import UpdateExpenseModal from "./modals/update-expense";
import ExpenseAPI from "../../API/expense.api";
import DeleteExpenseModal from "./modals/delete-expense";
import SideBar from "../sidebar/sidebar";
import ExpenseStats from "./stats";

export default function ExpenseIndex() {

    const [selectedExpense, setSelectedExpense] = createSignal<IncomingExpenseDto>();


    const [dateFilter, setDateFilter] = createSignal<string>(new Date().toISOString().split('T')[0]);
    const [typeFilter, setTypeFilter] = createSignal<string>("REAL");
    const [searchFilter, setSearchFilter] = createSignal<string>("");

    const [expenseList, { refetch, mutate }] = createResource(
        () => [dateFilter(), typeFilter(), searchFilter()] as const, 
        async ([date, type, search]) => await ExpenseAPI.getExpenses(search, date, type)
    )

    const [stats, statsMutation] = createResource(
        () => [dateFilter()] as const,
        async ([date]) => {
            const dateObj = new Date(date);
            return await ExpenseAPI.getStats(dateObj.getUTCFullYear(), dateObj.getUTCMonth() + 1)
        }
    )



    

    function onCreatedHandler() {
        queryExpenses();
        queryStats();
    }

    function queryExpenses() {
        mutate();
        refetch();
        
    }

    function queryStats() {
        statsMutation.mutate()
        statsMutation.refetch()
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

    function onDateChange(e: Event & {
        currentTarget: HTMLInputElement;
        target: HTMLInputElement;
    }) {
        if (e.target.value === '') {
            setDateFilter(new Date().toISOString().split('T')[0]);
        }
        else {
            setDateFilter(e.target.value);
        }
        queryExpenses();
        queryStats();
    }

    return (
        <SideBar>
            <div class="p-12 flex flex-col h-full overflow-y-auto">
                <Show when={stats()}>
                    <div class="pb-12">
                        <ExpenseStats stats={stats()}/>
                    </div>
                </Show>
                <div class="flex-2">
                    <div>
                        <CreateExpenseModal onCreatedHandler={onCreatedHandler}/>
                        { selectedExpense() && <UpdateExpenseModal selectExpense={onSelectExpenseHandler} onCreatedHandler={onCreatedHandler} expense={selectedExpense()!} />  }
                        { selectedExpense() && <DeleteExpenseModal selectExpense={onSelectExpenseHandler} onCreatedHandler={onCreatedHandler} expense={selectedExpense()!} />  }
                    </div>
                    <div class="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <input onkeyup={(e) => { setSearchFilter((e.target as HTMLInputElement).value); queryExpenses(); }} class="border-b border-neutral-400 py-2 outline-none" type="text" name="search" id="search" placeholder="Buscar concepto" />
                        {/* <input onchange={(e) => { setDateFilter((e.target as HTMLInputElement).value); queryExpenses(); queryStats() }} class="border-b border-neutral-400 py-2 outline-none" type="date" name="date" id="date" /> */}
                        <input value={dateFilter()} onchange={onDateChange} class="border-b border-neutral-400 py-2 outline-none" type="date" name="date" id="date" />
                        <select onchange={(e) => { setTypeFilter(e.target.value); queryExpenses(); }} class="border-b border-neutral-400 bg-transparent outline-none py-2" name="type" id="type">
                            <option value="REAL">Real</option>
                            <option value="ESTIMATED">Estimado</option>
                        </select>
                    </div>
                    <Show when={expenseList()}>
                        <div>
                            <ExpensesDisplay selectExpense={onSelectExpenseHandler} expenses={expenseList()!} />
                        </div>
                    </Show>
                </div>
            </div>
        </SideBar>
    );
}