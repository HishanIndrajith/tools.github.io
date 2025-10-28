let total = 0;
let items = []; // <-- store receipt items here
let itemCounter = 0;
let businessInfo = {
    name: "Simple Biller",
    address: "",
    currency: ""
};

document.getElementById('price').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        addItem();
    }
});

// Check if settings are already stored
window.onload = function () {

    const businessName = localStorage.getItem('businessName');
    const businessAddress = localStorage.getItem('businessAddress');
    const businesscurrency = localStorage.getItem('currency');

    if (businessName && currency && businessAddress) {
         // Store into global object
        businessInfo.name = businessName;
        businessInfo.address = businessAddress;
        businessInfo.currency = businesscurrency;

        document.getElementById('businessNameHeading').textContent = businessName;
        document.getElementById('businessAddressHeading').textContent = businessAddress;
        let elements = document.getElementsByClassName('currencySymbol');
        for (let i = 0; i < elements.length; i++) {
            elements[i].textContent = businesscurrency;
        }
        document.getElementById('businessNamePrint').textContent = businessName;
        document.getElementById('businessAddressPrint').textContent = businessAddress;
    } else {
        loadCurrencies();
    }
};

function addItem() {
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);

    if (!description || isNaN(price)) {
        alert("Please enter valid item description and price");
        return;
    }

    // Create item object and store in array
    const item = {
        itemNumber: itemCounter,
        description: description,
        price: price
    };
    items.push(item);
    itemCounter++;

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


