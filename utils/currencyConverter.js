const axios = require("axios");

// Load the API key from environment variables for security
const EXCHANGE_API_URL = `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/USD`;

// Function to convert currency
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
    try {
        // Request exchange rates from the API
        const response = await axios.get(EXCHANGE_API_URL);
        
        if (!response.data || !response.data.conversion_rates) {
            throw new Error("Error fetching conversion rates.");
        }

        const rates = response.data.conversion_rates;

        if (!rates[fromCurrency] || !rates[toCurrency]) {
            throw new Error("Invalid currency code.");
        }

        // Convert the amount to USD first, then to the target currency
        const amountInUSD = amount / rates[fromCurrency];  
        const convertedAmount = amountInUSD * rates[toCurrency];

        // Return the converted amount rounded to 2 decimal places
        return convertedAmount.toFixed(2);
    } catch (error) {
        console.error("Currency conversion error:", error.message);
        return null;
    }
};

module.exports = { convertCurrency };
