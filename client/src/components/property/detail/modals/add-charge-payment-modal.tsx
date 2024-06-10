import { faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import Fa from "solid-fa";
import { IncomingChargeTransactionDto, IncomingPropertyDto } from "../../../../API/dto/property.dto";
import PropertyAPI from "../../../../API/property.api";
import flatpickr from "flatpickr";
import { onMount } from "solid-js";
import 'flatpickr/dist/themes/confetti.css'


export type AddChargePaymentModalProps = {
    charge: IncomingChargeTransactionDto;
    property: IncomingPropertyDto;
}
export default function AddChargePaymentModal({ charge, property }: AddChargePaymentModalProps) {

    const { Transaction } = charge;

    function OpenModalHandler() {

        const dialog = document.getElementById(`add-charge-payment-modal-${Transaction.Id}`) as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    function CloseModalHandler() {

        const dialog = document.getElementById(`add-charge-payment-modal-${Transaction.Id}`) as HTMLDialogElement
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


        const form = e.target as HTMLFormElement;


        const dollars  = form.elements.namedItem('dollars') as HTMLInputElement;
        const date  = form.elements.namedItem('date') as HTMLInputElement;

        if (parseFloat(dollars.value) > property.Balance) {

            alert('Saldo insuficiente');
            return;
        }

        const  result = await PropertyAPI.AddChargePayment(charge.Transaction.Id, { Dollars: parseFloat(dollars.value), Date: date.value })

        if (result.status === 201 || result.status === 200) {
            alert('Registro exitoso!')
            form.reset();
            return;
        }

        alert('Hubo un error al registrar el pago');

    }
    onMount(() => {
        flatpickr("#date", {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            static: true,
        });
    });

    return (
        <>
        <dialog id={`add-charge-payment-modal-${Transaction.Id}`} class="rounded-lg relative shadow-2xl">
            <button onclick={CloseModalHandler} class="absolute right-0 m-3 rounded-full p-1 border">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
                
            </button>
            <form onsubmit={onSubmitHandler} class="p-6 w-[200px] lg:w-[480px] flex flex-col gap-4">
                <div class="flex flex-col gap-1">
                    <label for="concept" class="font-semibold">Fecha</label>
                    <input required class="border-b border-neutral-400 outline-none py-1 w-full" type="date" name="date" id="date" placeholder="Fecha..." />
                </div>
                <div class="flex flex-col gap-1">
                    <label for="dollars" class="font-semibold">Dolares</label>
                    <input required class="border-b border-neutral-400 outline-none py-1" type="number" step={0.02} name="dollars" id="dollars" placeholder="Dolares" />
                </div>
                <button class="flex gap-3 items-center justify-center bg-primary p-2 px-4 text-secondary hover:bg-secondary hover:text-primary font-semibold rounded-lg">Abonar</button>
            </form>
            
        </dialog>
        <button onclick={OpenModalHandler} class="bg-primary text-secondary rounded flex items-center gap-2 p-1 px-2 hover:bg-secondary hover:text-primary font-bold tooltip">
            <Fa icon={faMoneyBill}/>
            {/* <span>Abonar</span> */}
        </button>
        </>
    );
}