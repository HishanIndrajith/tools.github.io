let total = 0;

document.getElementById('price').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Check if settings are already stored
window.onload = function () {

    const businessName = localStorage.getItem('businessName');
    const businessAddress = localStorage.getItem('businessAddress');
    const currency = localStorage.getItem('currency');

    if (businessName && currency && businessAddress) {
        document.getElementById('businessNameHeading').textContent = businessName;
        document.getElementById('businessAddressHeading').textContent = businessAddress;
        let elements = document.getElementsByClassName('currencySymbol');
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = currency;
        }
        document.getElementById('businessNamePrint').textContent = businessName;
        document.getElementById('businessAddressPrint').textContent = businessAddress;
    } else {
        loadCurrencies();
    }
};

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

function addItem() {
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);

    if (!description || isNaN(price)) {
        alert("Please enter valid item description and price");
        return;
    }

    const tableBody = document.querySelector('#billTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
                <td>${description}</td>
                <td><span class="currencySymbol"></span> ${price.toFixed(2)}</td>
            `;

    tableBody.appendChild(row);

    total += price;
    document.getElementById('totalAmount').textContent = total.toFixed(2);

    // Clear input fields
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('description').focus();
}

function generatePDF() {
    const pdfButton = document.getElementById('pdfButton');
    pdfButton.style.display = 'none'; // Hide the button

    const expandLink = document.getElementById('expand-link');
    expandLink.style.display = 'none';
    expandPanel();
    const customerName = document.getElementById('customerName');
    hideIfEmpty(customerName);
    const customerContact = document.getElementById('customerContact');
    hideIfEmpty(customerContact);
    const panel = document.getElementById('expandablePanel');
    if (customerName.value == "" && customerContact.value == "") {
        panel.style.display = 'none';
    }

    const businessNamePrint = document.getElementById('businessNamePrint');
    businessNamePrint.style.display = 'inherit'; // show the title

    const businessAddressPrint = document.getElementById('businessAddressPrint');
    businessAddressPrint.style.display = 'inherit'; // show the title

    const receiptLabel = document.getElementById('receiptLabel');
    receiptLabel.style.display = 'inherit';

    const billElement = document.getElementById('bill');
    const opt = {
        margin: 0.5,
        filename: 'bill.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(billElement).set(opt).save().then(() => {
        pdfButton.style.display = 'inline'; // Show the button again after saving
        businessNamePrint.style.display = 'none'; // Hide the title
        businessAddressPrint.style.display = 'none';
        receiptLabel.style.display = 'none';
        customerName.style.display = 'inline';
        customerContact.style.display = 'inline';
        expandLink.style.display = 'inline';
        panel.style.display = 'block';
    });
}

// Function to toggle the expandable panel
function togglePanel() {
    const panel = document.getElementById('expandablePanel');
    const expandLink = document.getElementById('expand-link');
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';  // Show panel
        expandLink.textContent = "Hide customer details";
    } else {
        panel.style.display = 'none';  // Hide panel
        expandLink.textContent = "Expand to add customer details";
    }
}

// Function to toggle the expandable panel
function expandPanel() {
    const panel = document.getElementById('expandablePanel');
    const expandLink = document.getElementById('expand-link');
    panel.style.display = 'block';  // Show panel
    expandLink.textContent = "Hide customer details";
}

function hideIfEmpty(dom) {
    if (dom.value == "") {
        dom.style.display = 'none';
    }
}