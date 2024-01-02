import SideBar from "../../sidebar/sidebar";
import PropertyAPI from "../../../API/property.api";
import { Show, createResource, createSignal } from "solid-js";
import { IncomingPropertyDto } from "../../../API/dto/property.dto";
import TransactionPropertyDisplay from "./transaction-property-display";
import { useParams } from "@solidjs/router";

export default function RegisterCharge() {


    
    const { type } = useParams<{type: "CHARGE" | "PAYMENT"}>();
    const [availableProperties, setAvailableProperties] = createSignal<IncomingPropertyDto[]>([]);
    const [selectedProperties, setSelectedProperties] = createSignal<IncomingPropertyDto[]>([]);

    const [properties] = createResource(
        () => [] as const,
        async () => {
            const prop = await PropertyAPI.getProperties()
            setAvailableProperties(prop);
            return prop;
        }
    );


    function onSelectHandler(property: IncomingPropertyDto) {
        setSelectedProperties((value) => [...value, property]);
        setAvailableProperties((value) => value.filter((current) => current.Id !== property.Id));
    }

    function onRemoveHandler(property: IncomingPropertyDto) {
        setSelectedProperties((value) => value.filter((current) => current.Id !== property.Id));
        setAvailableProperties((value) => [...value, property]);
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
        const date = form.elements.namedItem("date") as HTMLInputElement;
        const dollars = form.elements.namedItem("dollars") as HTMLInputElement;
        const bolivares = form.elements.namedItem("bolivares") as HTMLInputElement;
        const changeRate = form.elements.namedItem("change_rate") as HTMLInputElement;

        const selectedPropertiesIds = selectedProperties().map((property) => property.Id);
        
        const response = await PropertyAPI.RegisterTransaction(type, {
            Concept: concept.value,
            Date: date.value,
            Dollars: parseFloat(dollars.value) || 0,
            Bolivares: parseFloat(bolivares.value) || 0,
            ChangeRate: parseFloat(changeRate.value) || 0,
            Properties: selectedPropertiesIds
        })
        if (response.status === 201) {
            if (type === 'CHARGE') alert('Cargos registrados exitosamente');
            if (type === 'PAYMENT') alert('Pagos registrados exitosamente');
        }
        form.reset();
        setSelectedProperties([]);
        setAvailableProperties(properties);

    }

    return (
        <SideBar>
            <div class="p-4 h-full overflow-y-auto flex flex-col gap-3">
                <header class="font-bold text-2xl py-2">{ type === "CHARGE" ? "Registro de Cargos" : "Registro de Pagos" }</header>
                <form onsubmit={onSubmitHandler} method="get" class="flex flex-col gap-3 h-full">
                    <div class="flex flex-col gap-1">
                        <label for="concept">Concepto</label>
                        <input class="border p-2 rounded-lg outline-none" type="text" name="concept" id="concept" placeholder="Concepto" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="date">Fecha</label>
                        <input class="border p-2 rounded-lg outline-none" type="date" name="date" id="date" placeholder="Fecha" />
                    </div>
                    <div class="grid lg:grid-cols-2 gap-3">
                        <div class="flex flex-col gap-1">
                            <label for="dollars">Dolares</label>
                            <input class="border p-2 rounded-lg outline-none" type="number" step={`0.2`} name="dollars" id="dollars" placeholder="Dolares" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="dollars">Bolivares</label>
                            <input class="border p-2 rounded-lg outline-none" type="number" step={`0.2`} name="bolivares" id="bolivares" placeholder="Bolivares" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="change_rate">Tasa</label>
                        <input class="border p-2 rounded-lg outline-none" type="number" step={`0.2`} name="change_rate" id="change_rate" placeholder="Tasa" />
                    </div>
                    <div class="grid lg:grid-cols-2 gap-3 flex-1  h-full lg:overflow-y-auto">
                        <div class="border border-neutral-400 shadow-lg rounded-lg overflow-y-auto h-full">
                            <header class="text-center font-bold text-lg py-2">Inmuebles</header>
                            <Show  when={availableProperties()} fallback={<p>Loading...</p>}>
                                <div class="px-6 py-4">
                                    <TransactionPropertyDisplay type="ADD" onSelect={onSelectHandler} properties={availableProperties()}/>
                                </div>
                            </Show>
                        </div>
                        <div class="border border-neutral-400 shadow-lg rounded-lg lg:overflow-y-auto h-full">
                            <header class="text-center font-bold text-lg py-2">Inmuebles Seleccionados</header>
                            <Show  when={selectedProperties()} fallback={<p>Loading...</p>}>
                                <div class="px-6 py-4">
                                    <TransactionPropertyDisplay type="DELETE" onSelect={onRemoveHandler} properties={selectedProperties()}/>
                                </div>
                            </Show>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="bg-blue-400 w-full p-2 text-white rounded-lg shadow-lg">Registrar</button>
                    </div>
                </form>
                
            </div>
        </SideBar>
    );
}
