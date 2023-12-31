import { IncomingExpenseDto } from "../../../API/dto/expense.dto";
import ExpenseAPI from "../../../API/expense.api";


export type DeleteExpenseModalProps = {
    onCreatedHandler: () => void;
    expense: IncomingExpenseDto;
    selectExpense: (expense: IncomingExpenseDto | undefined, action: 'DELETE' | 'UPDATE' | 'NONE') => void;
}
export default function DeleteExpenseModal({ onCreatedHandler, expense, selectExpense }: DeleteExpenseModalProps) {


    function CloseModalHandler() {

        const dialog = document.getElementById('delete-expense-modal') as HTMLDialogElement
        if (dialog) {
            dialog.close();
        }
    }

    async function onSubmitHandler(e: Event & {
        submitter: HTMLElement;
    } & {
        currentTarget: HTMLFormElement;
        target: Element;
    }) {
        e.preventDefault();


        const response = await ExpenseAPI.delete(expense.ID)
        if (response.status === 200) {
            onCreatedHandler();
            CloseModalHandler();
            return
        }

        alert('Error creating concept');

    }
    
    return (
        <>
        
        <dialog onClose={() => selectExpense(undefined, 'NONE')} id="delete-expense-modal" class="rounded-lg relative">
            <button class="absolute right-0 m-3 rounded-full p-1 border" onclick={CloseModalHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
            </button>
            <form onsubmit={onSubmitHandler} class="p-6 w-[200px] lg:w-[480px] flex flex-col gap-4">
                <p>Esta seguro de eliminar el gasto?</p>
                <ul>
                    <li>
                        <p>Concepto: {expense.Concept}</p>
                    </li>
                    <li>
                        <p>Tipo: {expense.Type}</p>
                    </li>
                    <li>
                        <p>Fecha: {expense.Date.split("T")[0]}</p>
                    </li>
                    <li>
                        <p>Bolivares: {expense.Dollars as number}</p>
                    </li>
                    <li>
                        <p>Dolares: {expense.Dollars as number}</p>
                    </li>
                    <li>
                        <p>Cambio: {expense.ChangeRate}</p>
                    </li>
                </ul>
                <button class="bg-red-400 p-2 px-4 text-white rounded-xl text-center">Eliminar</button>
            </form>
            
        </dialog>
        {/* <button class="bg-blue-400 p-2 px-4 text-white rounded-xl text-center" onclick={OpenModalHandler}>Registrar Gasto</button> */}
        </>
    );
}