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
                        <p class="text-lg font-semibold text-secondary flex items-center gap-2">
                            <span class={`${property()?.Balance!  >= 0 ? `bg-green-400` : `bg-red-400`} px-6  py-1 rounded-lg`}>{property()?.Balance.toLocaleString()} $</span>
                        </p>
                    </div>
                    <TransactionsDisplay property={property()!} />
                </Show>
            </div>
        </SideBar>
    );
}