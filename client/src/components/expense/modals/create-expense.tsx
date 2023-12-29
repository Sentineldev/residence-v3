export default function CreateExpenseModal() {


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
    
    return (
        <>
        
        <dialog id="create-expense-modal">
            <form>
                
            </form>
            <button onclick={CloseModalHandler}>Cerrar</button>
        </dialog>
        <button onclick={OpenModalHandler}>Registrar Gasto</button>
        </>
    );
}