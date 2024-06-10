import { useParams } from "@solidjs/router";
import SideBar from "../../sidebar/sidebar";
import PropertyAPI from "../../../API/property.api";
import { Show, createResource } from "solid-js";
import { IncomingPropertyDto } from "../../../API/dto/property.dto";
import TransactionsDisplay from "./transactions-display";
export default function DetailPropertyIndex() {

    const { symbol } = useParams<{symbol: string}>();

    const [property] = createResource<IncomingPropertyDto, string>(symbol, PropertyAPI.getProperty);

    return (    
        <SideBar>
            <div class="p-6">
                <Show when={property()} fallback={<p> loading...</p>} >
                    <div class="border border-neutral-400 shadow-lg p-4 rounded-lg flex flex-col gap-2">
                        {/* <header class="font-bold text-2xl">Detalles de Inmueble</header> */}
                        <p class="text-2xl font-semibold text-secondary">Inmueble <strong>{property()?.Symbol}</strong></p>
                        <p class="text-secondary">Propietario <strong>{property()?.Owner.Name}</strong></p>
                        <div class="grid grid-rows-2 gap-4 max-w-64">
                            <div class="w-full">
                                <p class="text-lg font-semibold text-secondary flex items-center gap-2 w-full ">
                                    <span class={`${property()?.Debt!  <= 0 ? `bg-green-400` : `bg-red-400`} px-6  py-1 rounded-lg w-full`}>Deuda: {property()?.Debt.toLocaleString()} $</span>
                                </p>
                            </div>
                            <div>
                                <p class="text-lg font-semibold text-secondary flex items-center gap-2">
                                    <span class={`${property()?.Balance!  >= 0 ? `bg-green-400` : `bg-red-400`} px-6  py-1 rounded-lg w-full`}>Balance: {property()?.Balance.toLocaleString()} $</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <TransactionsDisplay property={property()!} />
                </Show>
            </div>
        </SideBar>
    );
}