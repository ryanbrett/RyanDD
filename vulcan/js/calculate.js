// Constants for the calculations
const aluminumDensity = 0.097;
const coroplastDensity = 0.0066522;
const coroplastThickness = 0.15748;
const acmDensity = 0.0526093;
const acmThickness = 0.118;
const hdpeDensity = 0.0344855;
const OPUS_CUT_DECAL_MULTIPLIER = 0.75;
const BANNER_MULTIPLIER = 1.25;

// Function to calculate the number of decals that fit
function calculateNumberUp(decalSize, rollWidth) {
    return Math.floor((rollWidth) / decalSize);
}

// Function to calculate the square footage for a digital print
function calculateSquareFootage(decalSize, numUp, rollWidth) {
//    return Math.round(((decalSize + 1) * rollWidth) / 144 / numUp);
    return Math.floor((((decalSize + 1) * rollWidth) / 144 / numUp) * 1000) / 1000;    
}

// Function to calculate the weight
function calculateWeight(length, width, thickness, density) {
    const volume = length * width * thickness;
    const weight = volume * density;
    return weight;
}

// Function to calculate the results based on the selected product type
function calculate() {
    const sheetWidth = 96;
    const sheetHeight = 48;
    const itemWidth = parseFloat(document.getElementById('itemWidth').value);
    const itemHeight = parseFloat(document.getElementById('itemHeight').value);
    const aluminumGauge = parseFloat(document.getElementById('alGauge_options').value);
    const hdpeGauge = parseFloat(document.getElementById('hdpe_options').value);
    const productType = document.getElementById('product').value;
    const rollWidth = parseFloat(document.getElementById('digital_print_options').value) - 1.5;

    const numUp1 = Math.floor(sheetWidth / itemWidth);
    const numUp2 = Math.floor(sheetHeight / itemHeight);
    const numUp3 = Math.floor(sheetWidth / itemHeight);
    const numUp4 = Math.floor(sheetHeight / itemWidth);

    const numUpOnSheet1 = numUp1 * numUp2;
    const numUpOnSheet2 = numUp3 * numUp4;

    const maxNumUpOnSheet = Math.max(numUpOnSheet1, numUpOnSheet2);

    let result = 0;
    let result2 = 0;
    let result3 = 0;
    let resultLabel = "";
    let resultLabel2 = "";
    let resultLabel3 = "";

    if (productType === "aluminum_sign") {
        const thickness = aluminumGauge;
        const density = aluminumDensity;
        result = maxNumUpOnSheet;
        result2 = 1 / maxNumUpOnSheet;
        result3 = calculateWeight(itemWidth, itemHeight, thickness, density);
        resultLabel = "# Up / Inverse Qty:";
        resultLabel2 = "% Out of Material:";
        resultLabel3 = "Aluminum Weight:";
    } else if (productType === "acm_sign") {
        const thickness = acmThickness;
        const density = acmDensity;
        result = maxNumUpOnSheet;
        result2 = 1 / maxNumUpOnSheet;
        result3 = calculateWeight(itemWidth, itemHeight, thickness, density);
        resultLabel = "# Up / Inverse Qty:";
        resultLabel2 = "% Out of Material:";
        resultLabel3 = "ACM Weight:";
    } else if (productType === "hdpe_sign") {
        const thickness = hdpeGauge;
        const density = hdpeDensity;
        result = maxNumUpOnSheet;
        result2 = 1 / maxNumUpOnSheet;
        result3 = calculateWeight(itemWidth, itemHeight, thickness, density);
        resultLabel = "# Up / Inverse Qty:";
        resultLabel2 = "% Out of Material:";
        resultLabel3 = "HDPE Weight:";
    } else if (productType === "coroplast") {
        const thickness = coroplastThickness;
        const density = coroplastDensity;
        result = maxNumUpOnSheet;
        result2 = 1 / maxNumUpOnSheet;
        result3 = calculateWeight(itemWidth, itemHeight, thickness, density);
        resultLabel = "# Up / Inverse Qty:";
        resultLabel2 = "% Out of Material:";
        resultLabel3 = "Coroplast Weight:";
    } else if (productType === "opus_cut_decal") {
        result = sheetWidth * sheetHeight * itemWidth * itemHeight * OPUS_CUT_DECAL_MULTIPLIER;
        resultLabel = "Sq Ft:";
        resultLabel2 = "Pre-Mask Sq Ft:";
    } else if (productType === "digital_print") {
        rollWidthEdge = rollWidth - 1.5;
        itemWidthBleed = itemWidth + 0.5;
        itemHeightBleed = itemHeight + 0.5;
        const numUp1 = calculateNumberUp(itemWidth, rollWidthEdge);
        const numUp2 = calculateNumberUp(itemHeight, rollWidthEdge);
        const sqFt1 = calculateSquareFootage(itemWidthBleed, numUp1, rollWidth);
        const sqFt2 = calculateSquareFootage(itemHeightBleed, numUp2, rollWidth);
        result = (sqFt1 + sqFt2) / 2;
        result2 = result * 1.05;
        result3 = Math.max(numUp1, numUp2);
        resultLabel = "Material Sq. ft.:";
        resultLabel2 = "Laminate Sq. ft.:";
        resultLabel3 = "Max # Up per Row:";
    } else if (productType === "banner") {
        resultLabel = "Banner Sq. ft.:";
        resultLabel2 = "Banner Tape:";
        resultLabel3 = "Grommets:";
        result = ((itemHeight + 3) * 2) < 52.5 ? ((itemWidth + 3) * (itemHeight + 3)) / 144 : ((itemWidth + 3) * 54) / 144;
        result2 = ((itemWidth + itemHeight) * 2) / 12;
        result3 = Math.round(((itemWidth - 2) / 30) * 2 < 4 ? 4 : ((itemWidth - 2) / 30) * 2);
    }

    updateResultsUI(resultLabel, resultLabel2, resultLabel3, result, result2, result3);
}

// Function to update UI elements with the results
function updateResultsUI(label1, label2, label3, res1, res2, res3) {
    document.getElementById('resultLabel').textContent = label1;
    document.getElementById('resultLabel').style.display = 'inline-block';
    document.getElementById('resultLabel2').textContent = label2;
    document.getElementById('resultLabel2').style.display = 'inline-block';
    document.getElementById('resultLabel3').textContent = label3;
    document.getElementById('resultLabel3').style.display = 'inline-block';
    document.getElementById('result').textContent = res1;
    document.getElementById('result2').textContent = res2;
    document.getElementById('result3').textContent = res3;
}

// Function to update visibility of options based on product type
function updateOptions() {
    const productType = document.getElementById('product').value;
    if (productType === "digital_print") {
        document.getElementById('digitalPrintOptions').style.display = 'block';
        document.getElementById('alGaugeOptions').style.display = 'none';
        document.getElementById('hdpeOptions').style.display = 'none';
    } else if (productType === "aluminum_sign") {
        document.getElementById('alGaugeOptions').style.display = 'block';
        document.getElementById('digitalPrintOptions').style.display = 'none';
        document.getElementById('hdpeOptions').style.display = 'none';
    } else if (productType === "hdpe_sign") {
        document.getElementById('hdpeOptions').style.display = 'block';
        document.getElementById('digitalPrintOptions').style.display = 'none';
        document.getElementById('alGaugeOptions').style.display = 'none';
    } else {
        document.getElementById('alGaugeOptions').style.display = 'none';
        document.getElementById('hdpeOptions').style.display = 'none';
        document.getElementById('digitalPrintOptions').style.display = 'none';
    }
}

// Event listener for roll width change
document.getElementById('digital_print_options').addEventListener('change', calculate);
