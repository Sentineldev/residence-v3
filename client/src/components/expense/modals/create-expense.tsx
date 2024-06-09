import Fa from "solid-fa";
import ExpenseAPI from "../../../API/expense.api";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import flatpickr from "flatpickr";
import { onMount } from "solid-js";
import 'flatpickr/dist/themes/confetti.css'

export type CreateExpenseModalProps = {
    onCreatedHandler: () => void;
}
export default function CreateExpenseModal({ onCreatedHandler }: CreateExpenseModalProps) {


    function OpenModalHandler() {

        const dialog = document.getElementById('create-expense-modal') as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    function CloseModalHandler() {

        const dialog = document.getElementById('create-expense-modal') as HTMLDialogElement
        if (dialog) {
            dialog.close();
        }
    }
    onMount(() => {
        flatpickr("#expense-date", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            static: true,
        });
    });

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
        const date = form.elements.namedItem("expense-date") as HTMLInputElement;
        const dollars = form.elements.namedItem("dollars") as HTMLInputElement;
        const bolivares = form.elements.namedItem("bolivares") as HTMLInputElement;
        const changeRate = form.elements.namedItem("change_rate") as HTMLInputElement;

        const response = await ExpenseAPI.create({
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
        
        <dialog id="create-expense-modal" class="rounded-lg relative">
            <button class="absolute right-0 m-3 rounded-full p-1 border" onclick={CloseModalHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
            </button>
            <form onsubmit={onSubmitHandler} class="p-6 w-[200px] lg:w-[480px] flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Fecha</label>
                    <input class="border-b border-neutral-400 outline-none py-1 w-full" type="date" name="expense-date" id="expense-date" placeholder="Fecha..." />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Concepto</label>
                    <input class="border-b border-neutral-400 outline-none py-1" type="text" name="concept" id="concept" placeholder="Concepto de gasto" />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Tipo de Gasto</label>
                    {/* <input class="border-b outline-none" type="text" name="concept" id="concept" placeholder="Concepto de gasto..." /> */}
                    <select class="border-b border-neutral-400 outline-none bg-transparent py-2" name="type" id="type">
                        <option value="ESTIMATED">Estimado</option>
                        <option value="REAL">Real</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    <div class="flex flex-col gap-1">
                        <label for="concept" class="font-semibold">Dolares</label>
                        <input step={'0.002'} class="border-b border-neutral-400 outline-none py-1" type="number" name="dollars" id="dollars" placeholder="Cantidad de Dolares" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="concept" class="font-semibold">Bolivares</label>
                        <input step={'0.002'} value={0} class="border-b border-neutral-400 outline-none py-1" type="number" name="bolivares" id="bolivares" placeholder="Cantidad de Bolivares" />
                    </div>
                </div>
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Tasa de Cambio</label>
                    <input step={'0.002'} value={0} class="border-b border-neutral-400 outline-none py-1" type="number" name="change_rate" id="change_rate" placeholder="Tasa de Cambio" />
                </div>
                <button class="flex gap-3 items-center justify-center bg-primary p-2 px-4 text-secondary hover:bg-secondary hover:text-primary font-semibold rounded-lg">Registrar</button>
            </form>
            
        </dialog>
        <button class="flex gap-3 items-center p-2 px-4 bg-primary  text-secondary hover:bg-secondary hover:text-primary font-semibold rounded-lg" onclick={OpenModalHandler}>
            <Fa icon={faPlus} />
            <span>Registrar Gasto</span>
        </button>
        </>
    );
}