// Constructor function
function Validator(options) {

    var selectorRules = {};

    // Perform data validation
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var  rules = selectorRules[rule.selector];

        //Lặp qua từng rule & kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value); // === rule.test(inputElement.value)
            // Nếu có lỗi thì dừng việc kiếm tra
            if (errorMessage) break; 
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid');
        }
    }

    //* progress: 19.34
    // Get element of form that need validate
    var formElement = document.querySelector(options.form);

    if (formElement) {
        options.rules.forEach(function (rule) {

            //Save rules for each input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // Handle case user blur out of input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Handle case user enter input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        })
    }
}


// Define rules
// Rule:
//1. Invalid input => return invalid message
//2. Valid input => return nothing (undefined)
Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này"
        }
    };
}

//? trim() loại bỏ dấu cách ở 2 bên string

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    };
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    };
}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}