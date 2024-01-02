import { IncomingExpenseStatsDto } from "../../API/dto/expense.dto";

export type ExpenseStatsProps = {
    stats: IncomingExpenseStatsDto;
}
export default function ExpenseStats({ stats }: ExpenseStatsProps) {




    return (
        <div class="grid lg:grid-cols-2 gap-4 h-full">
            <div class="shadow-2xl border border-green-300 h-full p-4 px-8 flex gap-4 rounded-lg">
                <div class="flex flex-col flex-1 gap-2">
                    <header class="font-bold text-lg lg:text-2xl flex-1 opacity-80">Total Gasto Real</header>
                    <p class="flex-1 text-lg lg:text-2xl font-bold">{stats.Real.toLocaleString()} $</p>
                    {/* <footer class="text-lg">Promedio 30.50</footer> */}
                </div>
                <div class="self-center px-4">
                    <svg xmlns="http://www.w3.org/2000/svg"  width={64} height={64} viewBox="0 0 48 48"><g fill="green" id="Layer_2" data-name="Layer 2"><g id="layer_1-2" data-name="layer 1">
                        <path class="cls-1" d="M41 48a1 1 0 0 1-.55-.17L31.7 42H19a3 3 0 0 1-3-3v-5h2v5a1 1 0 0 0 1 1h13a1 1 0 0 1 .55.17l7.45 5V41a1 1 0 0 1 1-1h4a1 1 0 0 0 1-1V13a1 1 0 0 0-1-1H34v-2h11a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3h-3v5a1 1 0 0 1-.53.88A1 1 0 0 1 41 48z"/><path class="cls-1" d="M7 38a1 1 0 0 1-.47-.12A1 1 0 0 1 6 37v-5H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H16.3l-8.75 5.83A1 1 0 0 1 7 38zM3 2a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1h4a1 1 0 0 1 1 1v4.13l7.45-5A1 1 0 0 1 16 30h13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM34 20h10v2H34zM34 15h10v2H34zM34 25h6v2h-6zM34 30h10v2H34zM20 35h20v2H20z"/>
                        <path class="cls-1" d="M16 25a5 5 0 0 1-5-5h2a3 3 0 1 0 3-3 5 5 0 1 1 5-5h-2a3 3 0 1 0-3 3 5 5 0 0 1 0 10z"/>
                        <path class="cls-1" d="M15 24h2v4h-2zM15 4h2v4h-2zM24 15h2v2h-2zM6 15h2v2H6z"/>
                        </g></g></svg>
                </div>
            </div>
            <div class="shadow-2xl border border-orange-300 h-full p-4 px-8 gap-4 flex rounded-lg">
                <div class="flex flex-col flex-1 gap-2">
                    <header class="font-bold text-lg lg:text-2xl flex-1 opacity-80">Total Gasto Estimado</header>
                    <p class="flex-1 text-lg lg:text-2xl font-bold">{stats.Estimated.toLocaleString()} $</p>
                    {/* <footer class="text-lg">Promedio 30.50</footer> */}
                </div>
                <div class="self-center px-4">
                    <svg xmlns="http://www.w3.org/2000/svg"  width={64} height={64} viewBox="0 0 48 48"><g fill="orange" id="Layer_2" data-name="Layer 2"><g id="layer_1-2" data-name="layer 1">
                        <path class="cls-1" d="M41 48a1 1 0 0 1-.55-.17L31.7 42H19a3 3 0 0 1-3-3v-5h2v5a1 1 0 0 0 1 1h13a1 1 0 0 1 .55.17l7.45 5V41a1 1 0 0 1 1-1h4a1 1 0 0 0 1-1V13a1 1 0 0 0-1-1H34v-2h11a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3h-3v5a1 1 0 0 1-.53.88A1 1 0 0 1 41 48z"/><path class="cls-1" d="M7 38a1 1 0 0 1-.47-.12A1 1 0 0 1 6 37v-5H3a3 3 0 0 1-3-3V3a3 3 0 0 1 3-3h26a3 3 0 0 1 3 3v26a3 3 0 0 1-3 3H16.3l-8.75 5.83A1 1 0 0 1 7 38zM3 2a1 1 0 0 0-1 1v26a1 1 0 0 0 1 1h4a1 1 0 0 1 1 1v4.13l7.45-5A1 1 0 0 1 16 30h13a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM34 20h10v2H34zM34 15h10v2H34zM34 25h6v2h-6zM34 30h10v2H34zM20 35h20v2H20z"/>
                        <path class="cls-1" d="M16 25a5 5 0 0 1-5-5h2a3 3 0 1 0 3-3 5 5 0 1 1 5-5h-2a3 3 0 1 0-3 3 5 5 0 0 1 0 10z"/>
                        <path class="cls-1" d="M15 24h2v4h-2zM15 4h2v4h-2zM24 15h2v2h-2zM6 15h2v2H6z"/>
                        </g></g></svg>
                </div>
            </div>
        </div>
    );
}
