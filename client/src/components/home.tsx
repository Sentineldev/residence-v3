import { createSignal } from "solid-js";

export default function Home() {

    const [name, setName] = createSignal("Jesus");



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