import { For } from "solid-js";
import { IncomingPropertyDto } from "../../../API/dto/property.dto";

export type TransactionPropertyDisplayProps = {
    properties: IncomingPropertyDto[];
    onSelect: (property: IncomingPropertyDto) => void;
    type: 'DELETE' | 'ADD';
}
export default function TransactionPropertyDisplay(props: TransactionPropertyDisplayProps) {


    return (
        <div class="flex flex-col gap-2">
            <div class="hidden lg:grid grid-cols-4 gap-3 items-center">
                <div>
                    <header>Inmueble</header>
                </div>
                <div>
                    <header>Piso</header>
                </div>
                <div>
                    <header>Balance</header>
                </div>
            </div>
            <For each={props.properties}>
                {(property) => (
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-3 border-b border-b-neutral-400 py-2 items-center">
                        <div>
                            <header>
                                <span class="lg:hidden"><strong>Inmueble</strong>: </span>
                                <span>{ property.Symbol }</span>
                            </header>
                        </div>
                        <div>
                            <header>
                                <span class="lg:hidden"><strong>Piso</strong>: </span>
                                <span>{ property.Floor }</span>
                            </header>
                        </div>
                        <div>
                            <header>
                                <span class="lg:hidden"><strong>Balance</strong>: </span>
                                <span>{ property.Balance }</span>
                            </header>
                        </div>
                        <div>
                            {
                                props.type === "ADD" ?
                                <button onclick={() => props.onSelect(property)} class="bg-primary text-secondary p-1 rounded text-sm  shado-lg">
                                    Seleccionar
                                </button>
                                :
                                <button onclick={() => props.onSelect(property)} class="bg-red-500 p-1 rounded text-sm text-white shado-lg">
                                    Remover
                                </button>
                            }
                        </div>
                    </div>
                )}
            </For>
        </div>
    );
}
