import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Fa from "solid-fa";
import { IncomingTransactionDto } from "../../../../API/dto/property.dto";
import PropertyAPI from "../../../../API/property.api";

export type DeleteTransactionModalProps = {
    transaction: IncomingTransactionDto
}
export default function DeleteTransactionModal({ transaction } : DeleteTransactionModalProps) {
    
    function OpenModalHandler() {

        const dialog = document.getElementById(`delete-transaction-modal-${transaction.Id}`) as HTMLDialogElement
        if (dialog) {
            dialog.showModal();
        }
    }

    function CloseModalHandler() {

        const dialog = document.getElementById(`delete-transaction-modal-${transaction.Id}`) as HTMLDialogElement
        if (dialog) {
            dialog.close();
        }
    }

    async function onDeleteHandler() {
        const result = await PropertyAPI.DeleteTransaction(transaction.Id, transaction.Type)

        if (result.status === 200) {
            alert('Eliminacion completa!')

            window.location.reload()

            return;
        }
        alert('Ocurrio un error al intentar eliminar el registro');
    }
    return (
        <>
        <dialog id={`delete-transaction-modal-${transaction.Id}`} class="rounded-lg relative shadow-2xl">
            <button onclick={CloseModalHandler} class="absolute right-0 m-3 rounded-full p-1 border">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 50 50">
                    <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
                </svg>
                
            </button>
            <div class="p-8 pt-12 flex flex-col gap-4">
                <p>Estas seguro de eliminar el registro?</p>
                <button onclick={onDeleteHandler} class="p-2 bg-red-600 text-white rounded hover:opacity-75">Eliminar</button>
            </div>
        </dialog>
        <button onclick={OpenModalHandler} class="p-2 bg-red-600 text-white rounded hover:opacity-75">
            <Fa icon={faTrash} />
        </button>
        </>
    );
}