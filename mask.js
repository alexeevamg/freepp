function initializePhoneInput(inputPhone, clearNumberId) {
  var iti_phone = intlTelInput(inputPhone, {
    preferredCountries: ["ru", "by", "kz"],
    customPlaceholder: function (
      selectedCountryPlaceholder,
      selectedCountryData
    ) {
      return selectedCountryData.iso2 === "ru"
        ? "телефон"
        : selectedCountryPlaceholder;
    },
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (
        resp
      ) {
        var countryCode = resp && resp.country ? resp.country : "ru";
        callback(countryCode);
      });
    },
    utilsScript: "../../build/js/utils.js?1613236686837"
  });

  var mask;

  function maskAdd(event, el) {
    var updateOptions = { mask: region.find((r) => r.cc === event).mask };
    if (mask) {
      mask.destroy();
      mask = IMask(el, updateOptions);
    } else {
      mask = IMask(el, updateOptions);
    }

    inputPhone.addEventListener("input", function () {
      var maskedNumber = inputPhone.value;
      var clearNumber = maskedNumber.replace(/\D/g, "");
      document.getElementById(clearNumberId).value = "+" + clearNumber;
    });
  }

  inputPhone.onfocus = function () {
    var code = iti_phone.getSelectedCountryData().iso2.toUpperCase();
    maskAdd(code, inputPhone);
  };

  inputPhone.addEventListener("blur", function () {
    inputPhone.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");

    if (inputPhone.value.trim()) {
      if (iti_phone.isValidNumber()) {
        validMsg.classList.remove("hide");
      } else {
        inputPhone.classList.add("error");
        var errorCode = iti_phone.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
      }
    }
  });

  inputPhone.addEventListener("change", function () {
    inputPhone.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
  });

  inputPhone.addEventListener("keyup", function () {
    inputPhone.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
  });
}

function checkPhoneLength(phoneInput) {
  if (phoneInput.value.replace(/\D/g, "").length < 11) {
    phoneInput.setCustomValidity("Заполните это поле");
    return false;
  } else {
    phoneInput.setCustomValidity("");
  }
  return true;
}

function mask1() {
  var phoneInputs = document.querySelectorAll(".phone-input");

  phoneInputs.forEach(function (inputPhone) {
    var clearNumberId = inputPhone.getAttribute("data-clear-number-id");
    initializePhoneInput(inputPhone, clearNumberId);

    inputPhone.addEventListener("blur", function () {
      checkPhoneLength(inputPhone);
    });

    $(inputPhone.form).submit(function (event) {
      if (!checkPhoneLength(inputPhone)) {
        event.preventDefault();
      }
    });
  });
}

function launch() {
  mask1();
}

launch();
