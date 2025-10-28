const RECEIPT_WIDTH = 40;

let receiptText = "";
let receiptHeight = 0

/////// Receipt Main Format Function ///////////

function populateReceipt() {

    const businessName = businessInfo.name || "Smart Biller";
    const businessAddress = businessInfo.address || "";
    const businessCurrency = businessInfo.currency || "USD";

    const receiptDiv = document.getElementById('printReceipt');
    const dateStr = new Date().toLocaleString(); // format: "28/10/2025, 4:21 PM"

    // Initialise to empty Receipt
    receiptText = "";
    receiptHeight = 0;

    /////////////////////////////// RECEIPT FORMAT START ////////////////////////////////////

    // Title
    titleText("SALE RECEIPT");
    
    // Header
    centeredText(businessName);
    if (businessAddress.trim() !== "") {
        centeredText(businessAddress);
    }
    separator();

    simpleText(dateStr);

    separator();

    // Items list
    items.forEach(item => {
        twoColumnLine(item.description, formatPrice(businessCurrency, item.price));
    });

    separator();

    // Total Section
    rightAllignedText("TOTAL: " + formatPrice(businessCurrency, total));
    lineBreak();
    
    // Footer
    centeredText("Thank You Come Again!");

    separator();

    /////////////////////////////// RECEIPT FORMAT END ////////////////////////////////////

    // Put inside pre block for monospace rendering
    receiptDiv.innerHTML = `<pre style="font-family: monospace; white-space: pre;">${receiptText}</pre>`;

    return receiptHeight;
}

//////// Receipt Element Functions /////////

function separator(){
    receiptText += "-".repeat(RECEIPT_WIDTH);
    lineBreak();
}

function lineBreak(){
    receiptText += "\n";
    receiptHeight++;
}

function simpleText(text) {
    receiptText += text;
    lineBreak();
}

function centeredText(text) {
    receiptText += centerText(text);
    lineBreak();
}

function rightAllignedText(text) {
    receiptText += padLeft(text, RECEIPT_WIDTH);
    lineBreak();
}

function titleText(text) {
    let titleSeperatorLine = "=".repeat(RECEIPT_WIDTH);
    receiptText += titleSeperatorLine;
    lineBreak();
    receiptText += centerText(text);
    lineBreak();
    receiptText += titleSeperatorLine;
    lineBreak();
}

/* 
Two column justified line

Ex: 
|text1                text2|
|textabcdefghijkmn... text2|

Text 1 will be trimed and ... will be added if going to clash with text 2
*/
function twoColumnLine(text1, text2) {
    text1 = text1.trim();
    text2 = text2.trim();

    // Calculate max width for text1
    const maxText1Width = RECEIPT_WIDTH - text2.length - 1; // 1 space between text1 and text2

    // Trim text1 if too long
    if (text1.length > maxText1Width) {
        text1 = text1.substring(0, maxText1Width - 3) + "...";
    }

    // Pad text1 right to align with text2
    const paddedText1 = padRight(text1, maxText1Width);

    const fullLine = paddedText1 + " " + text2;
    receiptText += fullLine;
    lineBreak();
}

//////// Format Format Utility Functions ////////

function padRight(text, length) {
    return text + " ".repeat(Math.max(0, length - text.length));
}

function padLeft(text, length) {
    return " ".repeat(Math.max(0, length - text.length)) + text;
}

function centerText(text) {
    text = text.trim();
    if (text.length >= RECEIPT_WIDTH) return text; // Too long → return as-is
    const leftPadding = Math.floor((RECEIPT_WIDTH - text.length) / 2);
    const rightPadding = RECEIPT_WIDTH - text.length - leftPadding;
    return " ".repeat(leftPadding) + text + " ".repeat(rightPadding);
}


