import { IncomingExpenseDto } from "../../../API/dto/expense.dto";
import ExpenseAPI from "../../../API/expense.api";


export type CreateExpenseModalProps = {
    onCreatedHandler: () => void;
    expense: IncomingExpenseDto;
    selectExpense: (expense: IncomingExpenseDto | undefined) => void;
}
export default function UpdateExpenseModal({ onCreatedHandler, expense, selectExpense }: CreateExpenseModalProps) {



    function CloseModalHandler() {

        const dialog = document.getElementById('update-expense-modal') as HTMLDialogElement
        if (dialog) {
            dialog.close();
        }
        selectExpense(undefined);
    }

    async function onSubmitHandler(e: Event & {
        submitter: HTMLElement;
    } & {
        currentTarget: HTMLFormElement;
        target: Element;
    }) {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const concept = form.elements.namedItem("concept") as HTMLInputElement;
        const type = form.elements.namedItem("type") as HTMLInputElement;
        const date = form.elements.namedItem("date") as HTMLInputElement;
        const dollars = form.elements.namedItem("dollars") as HTMLInputElement;
        const bolivares = form.elements.namedItem("bolivares") as HTMLInputElement;
        const changeRate = form.elements.namedItem("change_rate") as HTMLInputElement;

        const response = await ExpenseAPI.Create({
            Concept: concept.value,
            Type: type.value,
            Date: date.value,
            Dollars: parseFloat(dollars.value),
            Bolivares: parseFloat(bolivares.value),
            ChangeRate: parseFloat(changeRate.value)
        })
        if (response.status === 201) {
            form.reset()
            onCreatedHandler();
            return
        }

        alert('Error creating concept');

    }
    return (
        <>
        
        <dialog id="update-expense-modal" class="rounded-lg relative">
            <button class="absolute right-0 m-3 rounded-full p-1 border" onclick={CloseModalHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
            </button>
            <h1>{expense.Concept}</h1>
            <form onsubmit={onSubmitHandler} class="p-6 w-[200px] lg:w-[480px] flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Concepto</label>
                    <input value={expense.Concept} class="border-b outline-none py-1" type="text" name="concept" id="concept" placeholder="Concepto de gasto" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Tipo de Gasto</label>
                    {/* <input class="border-b outline-none" type="text" name="concept" id="concept" placeholder="Concepto de gasto..." /> */}
                    <select class="border-b outline-none bg-transparent py-2" name="type" id="type">
                        <option value="ESTIMATED">Estimado</option>
                        <option value="REAL">Real</option>
                    </select>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Fecha</label>
                    <input value={expense.Date.split('T')[0]} class="border-b outline-none py-1" type="date" name="date" id="date" placeholder="Fecha..." />
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <label for="concept" class="font-semibold">Dolares</label>
                        <input value={expense.Dollars as number} step={'0.002'} class="border-b outline-none py-1" type="number" name="dollars" id="dollars" placeholder="Cantidad de Dolares" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="concept" class="font-semibold">Bolivares</label>
                        <input value={expense.Bolivares as number} step={'0.002'} class="border-b outline-none py-1" type="number" name="bolivares" id="bolivares" placeholder="Cantidad de Bolivares" />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Tasa de Cambio</label>
                    <input value={expense.ChangeRate as number} step={'0.002'} class="border-b outline-none py-1" type="number" name="change_rate" id="change_rate" placeholder="Tasa de Cambio" />
                </div>
                <button class="bg-blue-400 p-2 px-4 text-white rounded-xl text-center">Actualizar</button>
            </form>
            
        </dialog>
        {/* <button class="bg-blue-400 p-2 px-4 text-white rounded-xl text-center" onclick={OpenModalHandler}>Registrar Gasto</button> */}
        </>
    );
}