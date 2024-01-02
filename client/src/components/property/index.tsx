import { Show, createResource } from "solid-js";
import SideBar from "../sidebar/sidebar";
import { IncomingPropertyDto } from "../../API/dto/property.dto";
import PropertyAPI from "../../API/property.api";
import PropertiesDisplay from "./properties-display";

export default function PropertyIndex() {


    const [propertyList] = createResource<IncomingPropertyDto[]>(PropertyAPI.getProperties);
    return (
        <SideBar>
            <div class="p-12">
                <header class="font-bold text-4xl text-center py-6">Detalle de Inmuebles</header>
                <Show when={propertyList()} fallback={<p> loading...</p>} >
                    <div>
                        <PropertiesDisplay properties={propertyList()!} />
                    </div>
                </Show>
            </div>
        </SideBar>
    );
}