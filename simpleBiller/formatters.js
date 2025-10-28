function formatPrice(currency, price){
    let priceFormatted = `${currency} ${price.toFixed(2)}`;
    return priceFormatted;
}