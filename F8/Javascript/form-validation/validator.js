//todo làm 1 cái form template hoàn chỉnh với tất cả cái input type

// Constructor function
function Validator(options) {
    function getParent(element, selector) {
        while(element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var selectorRules = {};

    // Perform data validation
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
        var errorMessage;

        // Lấy ra các rules của selector
        var  rules = selectorRules[rule.selector];

        //Lặp qua từng rule & kiểm tra
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        document.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value); // === rule.test(inputElement.value)
            }
            // Nếu có lỗi thì dừng việc kiếm tra
            if (errorMessage) break; 
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
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
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values
                                };

                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                } 
                                values[input.name].push(input.value)
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }
                        return  values;
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

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                // Handle case user blur out of input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // Handle case user enter input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerText = '';
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                }

                //todo sử dụng onchange để xử lý việc khi người dùng chọn option tỉnh thành default, nó sẽ báo lỗi ngay chứ k đợi đến khi blur ra ngoài.
            })
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
            return value ? undefined : message || "Vui lòng nhập trường này"
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