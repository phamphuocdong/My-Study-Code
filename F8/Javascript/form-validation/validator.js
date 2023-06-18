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
        return !errorMessage;
        //? ! convert value to boolean type and reverse value of it
    }

    // Get element of form that need validate
    var formElement = document.querySelector(options.form);

    if (formElement) {
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // Lặp qua từng rule và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            

            if (isFormValid) {
                // Trường hợp handle submit bằng Js
                if (typeof options.onSubmit === 'function') {
                    
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])'); //? Select tất cả những field có attribute là name và k có attribute là disable
                    //? log(enableInputs) sẽ nhận dc 1 NodeList, nên ta cần chuyển nó thành array trước khi dùng reduce()

                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});

                    options.onSubmit(formValues);
                } else { // Trường hợp submit với hành vi mặc định của html
                    formElement.submit();
                }
            } 
        }

        // Lặp qua mỗi rule và xử lý (lắng nghe sự kiện: blur, input, ...)
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