import { JSXElement } from "solid-js";

export type SideBarProps = {
    children: JSXElement ;
}
export default function SideBar({ children }: SideBarProps) {
    return(
        <aside class="grid grid-cols-1 lg:grid-cols-5 h-screen overflow-y-auto">
            <div class="flex lg:hidden  items-center p-2 px-3">
                <button class="bg-neutral-300 p-3 rounded shadow shadowl-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 50 50">
                        <path d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
                    </svg>
                </button>
            </div>
            <nav class="col-span-1 bg-neutral-300 hidden lg:block">
                <ul class="flex flex-col gap-4 p-6">
                    <li>
                        <a 
                        class="text-lg font-bold block p-2 hover:bg-neutral-600 hover:text-white rounded transition ease-in-out delay-0 " 
                        href="/">Resumen
                        </a>
                    </li>
                    <li>
                        <a 
                        class="text-lg font-bold block p-2 hover:bg-neutral-600 hover:text-white rounded transition ease-in-out delay-0 " 
                        href="/expenses">Gastos
                        </a>
                    </li>
                    <li>
                        <a 
                        class="text-lg font-bold block p-2 hover:bg-neutral-600 hover:text-white rounded transition ease-in-out delay-0 " 
                        href="/properties">Inmuebles
                        </a>
                    </li>
                </ul>
            </nav>
            <div class="col-span-4 h-full  overflow-y-auto">
                {children}
            </div>
        </aside>
    );
}