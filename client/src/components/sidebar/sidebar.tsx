import { JSXElement } from "solid-js";
import Fa from "solid-fa";
import { faFlag, faHouseChimney, faMoneyBill } from "@fortawesome/free-solid-svg-icons";
import { faHouseChimneyUser } from "@fortawesome/free-solid-svg-icons/faHouseChimneyUser";

export type SideBarProps = {
    children: JSXElement ;
}
export default function SideBar({ children }: SideBarProps) {
    return(
        <div class="grid grid-cols-1 lg:grid-cols-5 h-screen overflow-y-auto">
            <div class="flex lg:hidden  items-center p-2 px-3">
                <button class="bg-neutral-300 p-3 rounded shadow shadowl-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                        <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                    </svg>
                </button>
            </div>
            <aside>
                <nav class="col-span-1 h-full bg-primary hidden lg:block">
                    <ul class="flex flex-col gap-4 p-6">
                        <li>
                            <a href="/expenses" class="flex items-center text-2xl font-semibold gap-3 text-secondary hover:bg-secondary p-2 px-4 hover:text-primary rounded-lg">
                                <Fa icon={faMoneyBill} />
                                <span>Gastos</span>
                            </a>
                        </li>
                        <li>
                            <a href="/properties" class="flex items-center text-2xl font-semibold gap-3 text-secondary hover:bg-secondary p-2 px-4 hover:text-primary rounded-lg">
                                <Fa icon={faHouseChimneyUser} />
                                <span>Inmuebles</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <div class="col-span-4 h-full  overflow-y-auto bg-gray">
                {children}
            </div>
        </div>
    );
}