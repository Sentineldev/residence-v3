import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IncomingChargePaymentDto, IncomingChargeTransactionDto } from "../../../../API/dto/property.dto";
import Fa from "solid-fa";
import { For, Show, createResource } from "solid-js";
import PropertyAPI from "../../../../API/property.api";
export type ShowChargeTransactionPaymentsProps = {
    charge: IncomingChargeTransactionDto;
}
export default function ShowChargeTransactionPayments({ charge }: ShowChargeTransactionPaymentsProps) {


    const transaction = charge.Transaction;
    function OpenModalHandler() {

        const dialog = document.getElementById(`show-transaction-payments-modal-${transaction.Id}`) as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    function CloseModalHandler() {

        const dialog = document.getElementById(`show-transaction-payments-modal-${transaction.Id}`) as HTMLDialogElement
        if (dialog) {
            dialog.close();
        }
    }

    async function OnClickHandler(paymentId: string) {
        const result = await PropertyAPI.DeleteChargePayment(paymentId)

        if (result.status === 200) {
            alert('Eliminacion completa!')

            window.location.reload()

            return;
        }
        alert('Ocurrio un error al intentar eliminar el registro');
    }
    


    const [payments] = createResource<IncomingChargePaymentDto[]>(() => PropertyAPI.getChargeTransactionPayments(transaction.Id));

    return (


        <>
        <dialog id={`show-transaction-payments-modal-${transaction.Id}`} class="rounded-lg relative shadow-2xl">
            <div>
                <button onclick={CloseModalHandler} class="absolute right-0 m-3 rounded-full p-1 border">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                        <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                    </svg>
                </button>
                <div class="p-8 pt-12 flex flex-col gap-4 min-w-[450px]">
                    <h1 class="font-bold text-lg text-secondary">Abonos realizados</h1>
                    
                    <Show when={payments()}>
                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <h1 class="text-secondary">Fecha</h1>
                            </div>
                            <div>
                                <h1 class="text-secondary">Abonado</h1>
                            </div>
                        </div>
                        <For each={payments()}>
                            {(payment) => (
                                <div class="grid grid-cols-3 gap-4 items-center">
                                    <div>
                                        <p>{payment.Date.split("T")[0]}</p>
                                    </div>
                                    <div>
                                        <p>{payment.Dollars}</p>
                                    </div>
                                    <div>
                                        <button onclick={() => { OnClickHandler(payment.Id) }} class="bg-red-500 text-white p-2 rounded">
                                            <Fa icon={faTrash} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </For>
                    </Show>
                </div>
            </div>
            
        </dialog>
        <button onclick={OpenModalHandler} class="bg-primary text-secondary rounded flex items-center gap-2 p-1 px-2 hover:bg-secondary hover:text-primary font-bold">
            <Fa icon={faEye}/>
        </button>
        </>
    );
}   