/* jshint esversion: 6 */
'use strict';

// Wait until HTML loads to begin program
document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    //       Initial focus
    // ===========================
    // Set focus to first input on page
    const nameInput = document.getElementById('name');
    nameInput.focus();

    // ===========================
    //       Job Role
    // ===========================

    const otherTitle = document.getElementById('other-title');

    /**
     * Hide an element
     * @param {object} element  The element to hide
     */
     const hideElement = (element) => {
       element.classList.add("hide");
    };

    /**
     * Show an element
     * @param {object} element  The element to show
     */
    const showElement = (element) => {
        element.classList.remove("hide");
     };

    // initially hide the other title input
    hideElement(otherTitle);

    // Reveal other job role input when "other" is selected in Job Role
    document.getElementById('title').onchange =  (e) => {
        (e.target.value === "other") ? showElement(otherTitle) : hideElement(otherTitle);
    };

    // ===========================
    //       T-shirt Info section
    // ===========================

    const designSelect = document.getElementById('design');
    // get the collection of color values
    const colorSelect = document.getElementById('color');
    const colors = colorSelect.querySelectorAll('option');
    const colorSection = document.getElementById("colors-js-puns");
    // Dynamically add colors to color select based on design
    function addColors(colorArr) {
        colorSelect.innerHTML = "";
        colorArr.forEach(colorsIndex => {
            colorSelect.appendChild(colors[colorsIndex]);
        });
        showElement(colorSection);
    }

    // hide color select initially until user selects a design
    hideElement(colorSection);


    designSelect.onchange = (e) => {
        if (designSelect.value === "js puns") {
            addColors([0, 1, 2]);
        } else if (designSelect.value === "heart js") {
            addColors([3, 4, 5]);
        } else {
            hideElement(colorSection);
        }
    };

    // =============================
    //       Register for activities
    // =============================

    const activities = document.querySelector(".activities");
    const totalDisplay = document.createElement('p');
    activities.appendChild(totalDisplay);

    // Hold the running total in a global variable
    let total = 0;

    // Display the total price under the checkboxes
    function displayTotal() {
        totalDisplay.innerHTML = `Total price: $${total}.00`;
    }
    // Use event bubbling on fieldset to listen for checkbox changes
    activities.onchange = (e) => {
        const labelText =  e.target.parentElement.innerText;
        // find the workshop cost in the text
        let cost = parseInt(labelText.substring(labelText.indexOf("$") + 1));

        if (!e.target.checked) {
            cost = cost * -1;
        }
        total += cost;
        displayTotal();

        // find the time of the workshop
        let time = labelText.substring(labelText.indexOf("—") + 2, labelText.indexOf(",") );
        const labels = activities.querySelectorAll("label");

        // check to see if each label is same time as selected workshop
        labels.forEach( (label) => {
            if (e.target.checked) {
                if (label != e.target.parentElement && label.innerText.includes(time)) {
                    label.classList.add("disabled");
                    label.firstElementChild.setAttribute("disabled", "");
                }
            } else {
                if (label != e.target.parentElement && label.innerText.includes(time)) {
                    label.classList.remove("disabled");
                    label.firstElementChild.removeAttribute("disabled");
                }
            }
        });
    };
    displayTotal();

    // =============================
    //       Payment Info
    // =============================
    const payment = document.getElementById("payment");
    const creditSection = document.getElementById("credit-card");
    const paypalSection = creditSection.nextElementSibling;
    const bitcoinSection = paypalSection.nextElementSibling;

    // Show only the section that relates to selected payment method
    function showPayment(paymentType) {
        (paymentType === "credit card")  ? showElement(creditSection)    : hideElement(creditSection);
        (paymentType === "paypal")       ? showElement(paypalSection)    : hideElement(paypalSection);
        (paymentType === "bitcoin")      ? showElement(bitcoinSection)   : hideElement(bitcoinSection);
    }

    // Initially set payment type as credit card
    payment.value = "credit card";
    showPayment("credit card");

    // payment type event listener
    payment.onchange = () => showPayment(payment.value);

    // =============================
    //       Validation
    // =============================

    // ----------- globals
    // Form controls that need validation
    const name = document.getElementById("name");
    const email = document.getElementById("mail");
    const ccNumber = document.getElementById("cc-num");
    const zip = document.getElementById("zip");
    const cvv = document.getElementById("cvv");




    // ------------ functions
    // add validity message span skeleton to labels
    function addSpan(input) {
      input.previousElementSibling.appendChild(document.createElement("span"));
    }


    function isNameInvalid() {
        if (!name.value) return "Name field must not be empty";
        if (!name.value.includes(" ")) return "Please enter a first and last name";
        return false;
    }

    function isEmailInvalid() {
        if (email.value === "") return "Email field must not be empty";
        if (!/@/.test(email.value)) return "Email must contain a @ symbol";
        if (!/\./.test(email.value)) return "Email must contain a . period";
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email.value)) return "Email must be in valid format";
        return false;
    }

    function isNotRegistered() {
        const checkboxes = document.querySelectorAll(".activities input[type='checkbox']");
        let isNotReg = true;
        checkboxes.forEach( (checkbox) => {
            if (checkbox.checked) {
                isNotReg = false;
            }
        });
        return (isNotReg) ? "Please select at least one activity": isNotReg;
    }

    function isCreditInvalid() {
        return isNumberInvalid("Credit card", ccNumber.value, 13, 16);
    }

    function isZipInvalid() {
        return isNumberInvalid("Zipcode", zip.value, 5);
    }

    function isCvvInvalid() {
        return isNumberInvalid("CVV", cvv.value, 3);
    }

    /**
     *
     * @param {string} name
     * @param {string|number} value
     * @param {number} startLength
     * @param {number} endlength
     */
    function isNumberInvalid(name, value, startLength, endlength = undefined) {
        let lengthMsg;
        if (endlength) {
            lengthMsg = `${name} must be between ${startLength} and ${endlength} digits only`;
        } else {
            endlength = startLength;
            lengthMsg = `${name} must be ${startLength} digits only`;
        }


        if (!value) return `${name} field must not be empty`;
        if (/[^0-9]/.test(value)) return `${name} must be numbers only`;
        if (value.length < startLength || value.length > endlength) return lengthMsg;
        return false;
    }
    /**
     * Give a form field the "valid" or "invalid" class based on boolean
     * @param {element} input the form field to apply class styles to
     * @param {boolean} invalid true means field is not valid
     */
    function setInvalid(input, invalid) {
      const span = input.previousElementSibling.querySelector("span");
      let msg;

      if (!invalid) {
        input.classList.remove("invalid");
        input.classList.add("valid");
        span.classList.remove("invalid");
        span.classList.add("valid");
        msg = " OK!";
      } else {
        input.classList.remove("valid");
        input.classList.add("invalid");
        span.classList.remove("valid");
        span.classList.add("invalid");
        msg = " Invalid";
      }
      span.innerText = msg;

    }

    // ------------- Event listeners

    // listen for the inputs to be typed in, then perform real-time Validation
    name.onkeyup = () => setInvalid(name, isNameInvalid());
    email.onkeyup = () => setInvalid(email, isEmailInvalid());
    ccNumber.onkeyup = () => setInvalid(ccNumber, isCreditInvalid());
    zip.onkeyup = () => setInvalid(zip, isZipInvalid());
    cvv.onkeyup = () => setInvalid(cvv, isCvvInvalid());

    // listen for the inputs to lose focus in case info is copy pasted, then perform real-time Validation
    name.onblur = () => setInvalid(name, isNameInvalid());
    email.onblur = () => setInvalid(email, isEmailInvalid());
    ccNumber.onblur = () => setInvalid(ccNumber, isCreditInvalid());
    zip.onblur = () => setInvalid(zip, isZipInvalid());
    cvv.onblur = () => setInvalid(cvv, isCvvInvalid());
    

    // Listen for the register button to be clicked
    document.querySelector("button[type='submit']").onclick = (e) => {
        // prevent form submittal before validation
        e.preventDefault();

        let msg = "";
        if (isNameInvalid())  msg += isNameInvalid() + "<br>";
        if (isEmailInvalid())  msg += isEmailInvalid() + "<br>";
        if (isNotRegistered())  msg += isNotRegistered() + "<br>";
        if (payment.value === "credit card") {
            if (isCreditInvalid())  msg += isCreditInvalid() + "<br>";
            if (isZipInvalid())  msg += isZipInvalid() + "<br>";
            if (isCvvInvalid())  msg += isCvvInvalid() + "<br>";
        }
        if (msg) {
            displayModal(msg, "warning"); 
        }else{ 
            displayModal("Registration info sent", "success"); 
        };

    };

    // ------------- Initialization
    addSpan(name);
    addSpan(email);
    addSpan(ccNumber);
    addSpan(zip);
    addSpan(cvv);

    // =============================
    //       Alert Modal
    // =============================
    // Implement a nicer looking modal than the alert box
    function createModal() {
        // use shortened o variable for overlay to avoid variable name conflicts
        const o = document.createElement("div");
        o.className = "mdl-overlay hide";
        o.innerHTML = `        
                <div class="mdl-modal">
                    <div class="mdl-modal__content">
                    </div>
                    <button class="mdl-button">Close</button>                   
                </div>
        `;
        document.querySelector("body").appendChild(o);
        return o;
    }
    /**
     * 
     * @param {string} msg  Message for modal to display 
     * @param {string} type  Type of modal, accepts "Success" or "Warning"
     */
    function displayModal(msg, type) {
        showElement(overlay);
        modal.innerHTML = `
            <h2 class=${type}>${type}!<h2>
            <p>${msg}<p>
        `;
    }

    const overlay = createModal();
    const modal = overlay.querySelector(".mdl-modal__content");
    overlay.querySelector("button").onclick = () => {
        hideElement(overlay);
        if (overlay.querySelector("h2").classList.contains("success")) {
            document.querySelector("form").submit();
        }
    }
});
