import Fa from "solid-fa";
import { IncomingPropertyDto } from "../../API/dto/property.dto"
import { faHouseChimneyUser } from "@fortawesome/free-solid-svg-icons";

export type PropertyDisplayProps = {
    property: IncomingPropertyDto;
}
export default function PropertyDisplay({ property }: PropertyDisplayProps) {

    const { Balance, Debt, Floor, Symbol, Owner: { Name } } = property;
    return (
        <div class="grid grid-cols-1 lg:grid-cols-6 py-4 gap-4 items-center">
            <div>
                <div class="flex items-center gap-2">
                    <a class="hover:text-primary"  href={`/properties/${Symbol}`}>
                        <Fa icon={faHouseChimneyUser} size="2x" />
                    </a>
                    <p>
                        <span class="lg:hidden"><strong>Inmueble</strong>: </span>
                        <span>{Symbol}</span>
                    </p>
                </div>
            </div>
            <div>
                <p>
                    <span class="lg:hidden"><strong>Propietario</strong>: </span>
                    <span class="text-secondary">{Name}</span>
                </p>
            </div>
            
            <div>
                <header>
                    <span class="lg:hidden"><strong>Piso</strong>: </span>
                    <span class="text-secondary">{Floor}</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden"><strong>Balance</strong>: </span>
                    <span class={`${Balance  >= 0 ? `bg-green-400` : `bg-red-400`} text-secondary px-4 py-2 rounded-lg`}>{Balance.toLocaleString()} $</span>
                </header>
            </div>
            <div>
                <header>
                    <span class="lg:hidden"><strong>Deuda</strong>: </span>
                    <span class={`${Debt  === 0 ? `bg-green-400` : `bg-red-400`} text-secondary px-4 py-2 rounded-lg`}>{Debt.toLocaleString()} $</span>
                </header>
            </div>
            <div class="flex gap-4">
                {/* <button onclick={() => onSelectHandler('UPDATE')} class="bg-blue-400 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                        <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M43.125,2c-1.24609,0 -2.48828,0.48828 -3.4375,1.4375l-0.8125,0.8125l6.875,6.875c-0.00391,0.00391 0.8125,-0.8125 0.8125,-0.8125c1.90234,-1.90234 1.89844,-4.97656 0,-6.875c-0.95312,-0.94922 -2.19141,-1.4375 -3.4375,-1.4375zM37.34375,6.03125c-0.22656,0.03125 -0.4375,0.14453 -0.59375,0.3125l-32.4375,32.46875c-0.12891,0.11719 -0.22656,0.26953 -0.28125,0.4375l-2,7.5c-0.08984,0.34375 0.01172,0.70703 0.26172,0.95703c0.25,0.25 0.61328,0.35156 0.95703,0.26172l7.5,-2c0.16797,-0.05469 0.32031,-0.15234 0.4375,-0.28125l32.46875,-32.4375c0.39844,-0.38672 0.40234,-1.02344 0.01563,-1.42187c-0.38672,-0.39844 -1.02344,-0.40234 -1.42187,-0.01562l-32.28125,32.28125l-4.0625,-4.0625l32.28125,-32.28125c0.30078,-0.28906 0.39063,-0.73828 0.22266,-1.12109c-0.16797,-0.38281 -0.55469,-0.62109 -0.97266,-0.59766c-0.03125,0 -0.0625,0 -0.09375,0z"></path></g></g>
                    </svg>
                </button>
                <button onclick={() => onSelectHandler('DELETE')} class="bg-red-500 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0,0,256,256">
                        <g fill="#fdfdfd" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M14.98438,2.48633c-0.55152,0.00862 -0.99193,0.46214 -0.98437,1.01367v0.5h-5.5c-0.26757,-0.00363 -0.52543,0.10012 -0.71593,0.28805c-0.1905,0.18793 -0.29774,0.44436 -0.29774,0.71195h-1.48633c-0.36064,-0.0051 -0.69608,0.18438 -0.87789,0.49587c-0.18181,0.3115 -0.18181,0.69676 0,1.00825c0.18181,0.3115 0.51725,0.50097 0.87789,0.49587h18c0.36064,0.0051 0.69608,-0.18438 0.87789,-0.49587c0.18181,-0.3115 0.18181,-0.69676 0,-1.00825c-0.18181,-0.3115 -0.51725,-0.50097 -0.87789,-0.49587h-1.48633c0,-0.26759 -0.10724,-0.52403 -0.29774,-0.71195c-0.1905,-0.18793 -0.44836,-0.29168 -0.71593,-0.28805h-5.5v-0.5c0.0037,-0.2703 -0.10218,-0.53059 -0.29351,-0.72155c-0.19133,-0.19097 -0.45182,-0.29634 -0.72212,-0.29212zM6,9l1.79297,15.23438c0.118,1.007 0.97037,1.76563 1.98438,1.76563h10.44531c1.014,0 1.86538,-0.75862 1.98438,-1.76562l1.79297,-15.23437z"></path></g></g>
                    </svg>
                </button> */}
            </div>
        </div>
    );
}