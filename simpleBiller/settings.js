function loadCurrencies() {
    fetch('currencies.json')  // Replace with the correct path to your JSON file
        .then(response => response.json())
        .then(data => {
            const currencySelect = document.getElementById('currencySelect');
            const currencies = new Set();

            data.forEach(country => {
                if (country.currencies) {
                    Object.keys(country.currencies).forEach(currencyCode => {
                        const currencyName = country.currencies[currencyCode].name;
                        currencies.add({ code: currencyCode, name: currencyName });
                    });
                }
            });

            currencies.forEach(currency => {
                const option = document.createElement('option');
                option.value = currency.code;
                option.textContent = `${currency.name} (${currency.code})`;
                currencySelect.appendChild(option);
            });


            showConfigPopup();
        })
        .catch(error => console.error('Error loading currencies:', error));
}

function showConfigPopup() {
    const popup = document.getElementById('configPopup');
    popup.style.display = 'flex';

    // Set current values if available
    const businessName = localStorage.getItem('businessName');
    const businessAddress = localStorage.getItem('businessAddress');
    const currency = localStorage.getItem('currency');
    if (businessName) document.getElementById('businessName').value = businessName;
    if (businessAddress) document.getElementById('businessAddress').value = businessAddress;
    if (currency) document.getElementById('currencySelect').value = currency;
}

function saveConfig() {
    const businessName = document.getElementById('businessName').value;
    const businessAddress = document.getElementById('businessAddress').value;
    const currency = document.getElementById('currencySelect').value;

    if (businessName && currency && businessAddress) {
        localStorage.setItem('businessName', businessName);
        localStorage.setItem('businessAddress', businessAddress);
        localStorage.setItem('currency', currency);

        document.getElementById('businessNameHeading').textContent = businessName;
        document.getElementById('businessAddressHeading').textContent = businessAddress;
        document.getElementById('businessNamePrint').textContent = businessName;
        document.getElementById('businessAddressPrint').textContent = businessAddress;
        let elements = document.getElementsByClassName('currencySymbol');
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = currency;
        }
        document.getElementById('configPopup').style.display = 'none';
    } else {
        alert("Please provide a business name and currency.");
    }
}