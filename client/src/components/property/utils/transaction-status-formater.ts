import { ChargeTransactionStatus } from "../../../API/dto/property.dto"

export default (transactionType: ChargeTransactionStatus): string => {

    if (transactionType === "PAYED") {
        return "Pagado";''
    }

    return "Pendiente";
}