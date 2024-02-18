export const calculateVat = (totalPrice: number, percentage: number) => {
    let price: number = parseFloat((totalPrice / (1 + percentage)).toFixed(2))
    let vat: number = parseFloat((totalPrice - price).toFixed(2))

    return {
        price,
        vat
    }
}