
const NEWLINE_HEIGHT_MM = 3.8; // Height of monospace font new line in mm

function generatePDF() {
    let height = populateReceipt();
    let heightInMm = NEWLINE_HEIGHT_MM * height;
    console.log('Height of the Receipt = ' + heightInMm + 'mm');

    const billElement = document.getElementById('printReceipt');
    
    const opt = {
        margin: [0.1, 0.1, 0.1, 0.1],
        filename: 'bill.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'mm', format: [80, Math.max(110, height)], orientation: 'portrait' }
    };

    html2pdf().from(billElement).set(opt).save();
}