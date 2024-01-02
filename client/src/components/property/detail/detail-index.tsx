import { useParams } from "@solidjs/router";
import SideBar from "../../sidebar/sidebar";
import PropertyAPI from "../../../API/property.api";
import { Show, createResource, createSignal } from "solid-js";
import { IncomingPropertyDto, IncomingTransactionDto } from "../../../API/dto/property.dto";
export default function DetailPropertyIndex() {

    const { symbol } = useParams<{symbol: string}>();

    const [property] = createResource<IncomingPropertyDto, string>(symbol, PropertyAPI.getProperty);



    const [currentProperty, setCurrentProperty] = createSignal<IncomingPropertyDto>();

    const [transactions] = createResource(
        () => [currentProperty()?.Id, "CHARGE"] as const,
        ([propertyId, transactionType]) => propertyId ? PropertyAPI.getTransactions(propertyId, transactionType) : false
    );
    return (    
        <SideBar>
            
            <div class="p-6">
                <Show when={property} fallback={<p> loading...</p>} >
                    <div class="border-2 border-neutral-300 shadow-lg p-4 rounded-lg">
                        <header class="font-bold text-lg">Detalles de Inmueble</header>
                        <p>Inmueble <strong>{property()?.Symbol}</strong></p>
                        <p class="text-lg font-bold">Balance: <strong>{property()?.Balance} $</strong></p>
                    </div>
                </Show>
                <Show when={transactions} fallback={<p> loading...</p>} >
                    <h1>transactions: {JSON.stringify(transactions())}</h1>
                </Show>
            </div>
        </SideBar>
    );
}