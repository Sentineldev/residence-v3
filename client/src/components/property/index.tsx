import { Show, createResource } from "solid-js";
import SideBar from "../sidebar/sidebar";
import { IncomingPropertyDto } from "../../API/dto/property.dto";
import PropertyAPI from "../../API/property.api";
import PropertiesDisplay from "./properties-display";
import Fa from "solid-fa";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function PropertyIndex() {


    const [propertyList] = createResource<IncomingPropertyDto[]>(PropertyAPI.getProperties);
    return (
        <SideBar>
            <div class="p-12">
                <div class="flex gap-4 py-2">
                    <a href="/properties/transaction/CHARGE" class="flex  items-center  gap-2 bg-primary  text-secondary font-semibold hover:bg-secondary hover:text-primary p-3 px-4 rounded-lg shadow-xl">
                        <Fa icon={faPlus} />
                        <span>Registrar Cargo</span>
                    </a>
                    <a href="/properties/transaction/PAYMENT" class="flex  items-center  gap-2 bg-primary text-secondary font-semibold hover:bg-secondary hover:text-primary p-3 px-4 rounded-lg shadow-xl">
                        <Fa icon={faPlus} />
                        <span>Registrar Pago</span>
                    </a>
                </div>
                <Show when={propertyList()} fallback={<p> loading...</p>} >
                    <div>
                        <PropertiesDisplay properties={propertyList()!} />
                    </div>
                </Show>
            </div>
        </SideBar>
    );
}