/**
 * If package can be sent, the response will contain
 * the arrival date to customer's house, and the price
 * for him to pay. If package is goint to late more than
 * it should; the response will contain the arrival date 
 * plus the penalty por late delivery amount.
 */
export interface PackageResponseDTO {
}

export class PackageOnTimeSent implements PackageResponseDTO {
    constructor(private delivered_date: Date, private price: number) {
        this.delivered_date = delivered_date;
        this.price = price;
    }
    
    get arrival_date(): Date{
        return this.delivered_date;
    }

    get sending_price(): number {
        return this.price;
    }
}

export class PackageDelayedSent implements PackageResponseDTO {
    constructor(private delivered_date: Date, private penalty: number) {
        this.delivered_date = delivered_date;
        this.penalty = penalty;
    }
    
    get arrival_date(): Date{
        return this.delivered_date;
    }

    get penalty_price(): number {
        return this.penalty;
    }    
}