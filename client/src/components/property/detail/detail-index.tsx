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
                    <div class="border-2 border-neutral-300 shadow-lg p-4 rounded-lg">
                        <header class="font-bold text-lg">Detalles de Inmueble</header>
                        <p>Inmueble <strong>{property()?.Symbol}</strong></p>
                        <p class="text-lg font-bold">Balance: <strong>{property()?.Balance} $</strong></p>
                    </div>
                    <TransactionsDisplay property={property()!} />
                </Show>
            </div>
        </SideBar>
    );
}