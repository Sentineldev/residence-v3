import { For } from "solid-js";
import { IncomingPropertyDto } from "../../API/dto/property.dto"
import PropertyDisplay from "./property-display";

export type PropertiesDisplayProps = {
    properties: IncomingPropertyDto[];
}
export default function PropertiesDisplay({ properties }: PropertiesDisplayProps) {

    return (
        <div class="flex flex-col gap-4 py-8">
            <div class="hidden lg:grid lg:grid-cols-5 gap-2 items-center">
                <div>
                    <header class="font-semibold text-xl text-secondary">Inmueble</header>
                </div>
                <div>
                    <header class="font-semibold text-xl text-secondary">Propietario</header>
                </div>
                <div>
                    <header class="font-semibold text-xl text-secondary">Piso</header>
                </div>
                <div>
                    <header class="font-semibold text-xl text-secondary">Balance</header>
                </div>
            </div>
            <div class="flex flex-col gap-4">
                <For each={properties}>
                    {(property) => (<PropertyDisplay  property={property} />)}
                </For>
            </div>
        </div>
    );
}