let calculate = document.getElementById("calculate");

let firstValue = document.getElementById("first-value");
let secondValue = document.getElementById("second-value");
let firstLabel = document.querySelector(".container .content .form-control label[for='first-value']");
let secondLabel = document.querySelector(".container .content .form-control label[for='second-value']");
let result = document.getElementsByClassName("result");

// Show Label Based On Calculate Value
const showLabel = (first, second) => {
    firstLabel.childNodes[0].nodeValue = first;
    secondLabel.childNodes[0].nodeValue = second;
}

// Show Placeholder Based On Calculate Value 
const placeholder = (first, second) => {
    firstValue.setAttribute("placeholder", first);
    secondValue.setAttribute("placeholder", second);
}

// Reset Border Bottom Color 
const resetBorder = () => {
    let resetInput = document.querySelectorAll("input[type='number']");
    for (let i = 0; i < resetInput.length; i++) {
        resetInput[i].style.borderBottomColor = "inherit";
    }
}

// Show Warning Label
const showWarningLabel = (label, input, message) => {
    result[0].innerHTML = label.childNodes[0].nodeValue + message;
    document.querySelector(".bg-loader").style.display = "none";

    // Reset Border Bottom Color 
    resetBorder();

    input.style.borderBottomColor = "#ff4f4b";
    return;
}

// Input Cannot Be Null
const checkNull = (label, input) => {
    for (let i = 0; i < input.length; i++) {
        if (input[i].value.trim() == "") {
            return showWarningLabel(label[i], input[i], " Is Empty");
        }
    }
    return true;
}

// Number Cannot Be NaN
const checkNumber = (label, input) => {
    for (let i = 0; i < input.length; i++) {
        if (Number.isNaN(input[i].value / 1)) {
            return showWarningLabel(label[i], input[i], " Must Be Number");
        }
    }
    return true;
}

// Discount 0%-100%
const checkDiscount = (label, input) => {
    for (let i = 0; i < input.length; i++) {
        if (input[i].getAttribute("placeholder") == "Percentage") {
            if (!((input[i].value > 0) && (input[i].value < 100))) {
                return showWarningLabel(label[i], input[i], " Must Between 0% - 100%");
            }
        }
    }
    return true;
}

// Calculation
const calculation = (calculate, first, second) => {
    let value;

    if (calculate == 1) {
        value = ((second) / (1 - (first / 100))).toFixed(2).split(".");
    }
    if (calculate == 2) {
        return (((first - second) / first) * 100).toFixed(2) + "%";
    }
    if (calculate == 3) {
        value = (first - ((second / 100) * first)).toFixed(2).split(".");
    }

    if (calculate == 1 || calculate == 3) {
        value[0] = formatRupiah(value[0], "Rp ");
        return value.join(",");
    }
}

/* Fungsi formatRupiah */
function formatRupiah(angka, prefix) {
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
        split = number_string.split(','),
        sisa = split[0].length % 3,
        rupiah = split[0].substr(0, sisa),
        ribuan = split[0].substr(sisa).match(/\d{3}/gi);
    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }
    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp ' + rupiah : '');
}

const calculateResult = () => {
    document.querySelector(".bg-loader").style.display = "flex";

    let input = document.querySelectorAll("input[type='number']");
    let label = Array.prototype.slice.call(document.querySelectorAll("label[class='form-label']"));
    label.shift();

    resetBorder();
    // Input Cannot Be Null
    if (!checkNull(label, input)) {
        return;
    }

    // Input Cannot Be NaN
    if (!checkNumber(label, input)) {
        return;
    }

    // Discount 0%-100%
    if (!checkDiscount(label, input)) {
        return;
    }

    result[0].innerHTML = calculation(calculate.value, firstValue.value, secondValue.value);
    document.querySelector(".bg-loader").style.display = "none";
}

// Reset Value 
const reset = () => {
    document.querySelector(".bg-loader").style.display = "flex";
    firstValue.value = ""; calculate.value = 1;
    showLabel("Discount (%)", "Sale Price ($)");
    secondValue.value = "";
    result[0].innerHTML = "The Result Is Here";
    firstValue.focus();
    document.querySelector(".bg-loader").style.display = "none";
    placeholder("Percentage", "Amount");

}

window.addEventListener("load", () => {
    document.querySelector(".bg-loader").style.display = "none";
    placeholder("Percentage", "Amount");
    // if(document.cookie) {
    //     document.querySelector("body").classList.add("dark-mode");
    //     return;
    // }

    // document.querySelector("body").classList.remove("dark-mode");
})

calculate.addEventListener("change", () => {
    if (calculate.value == 1) {
        showLabel("Discount (%)", "Sale Price ($)");
        placeholder("Percentage", "Amount");
    }
    if (calculate.value == 2) {
        showLabel("List Price ($)", "Sale Price ($)");
        placeholder("Amount", "Amount");
    }
    if (calculate.value == 3) {
        showLabel("List Price ($)", "Discount (%)");
        placeholder("Amount", "Percentage");
    }
    calculateResult();
})

document.querySelector("button.button.reset").addEventListener("click", reset);
firstValue.addEventListener("keyup", calculateResult);
secondValue.addEventListener("keyup", calculateResult);

document.querySelectorAll(".content .form-label .input button.button").forEach(element => {
    element.addEventListener("click",function() {
        this.parentNode.firstChild.nextSibling.value = "";
        calculateResult();
        this.parentNode.firstChild.nextSibling.focus();
    })
})

// Dark Mode Toggle 
document.querySelector(".screen-mode").addEventListener("click", () => {
    document.querySelector("body").classList.toggle("dark-mode");
    // if(!document.cookie) {
    //     document.cookie = "mode=dark-mode";
    //     return;
    // }

    // document.cookie = "mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
})