import { IncomingExpenseDto } from "../../API/dto/expense.dto"

export type ExpenseDisplayProps = {
    expense: IncomingExpenseDto
}
export default function ExpenseDisplay({ expense }: ExpenseDisplayProps) {
    const { Concept, Date, Type, Dollars } = expense;
    return (
        <div class="grid grid-cols-4 border-b py-2">
            <div>
                <header>{Concept}</header>
            </div>
            <div>
                <header>{Type}</header>
            </div>
            <div>
                <header>{Date.toString().split('T')[0]}</header>
            </div>
            <div>
                <header>{Dollars.toLocaleString()}</header>
            </div>
        </div>
    );
}