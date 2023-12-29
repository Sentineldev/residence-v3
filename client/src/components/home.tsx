import { createResource, createSignal } from "solid-js";
import ExpenseAPI from "../API/expense.api";

export default function Home() {

    const [name, setName] = createSignal("Jesus");

    const [expenseList] = createResource<any[]>(ExpenseAPI.getExpenses)


    function onClickHandler() {
        setName((previous) => previous.concat(name()))
    }
    return (
        <>
            <h1 class="">Hola mundo {name()}</h1>
            <button  onclick={onClickHandler}>Concatenar nombre</button>
        </>
    );
}