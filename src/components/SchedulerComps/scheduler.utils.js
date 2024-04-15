export function dateFormat(format='',dateString=''){
    let date = (dateString != '') ? new Date(dateString) : new Date();
    if(format=='') {
        console.error('%cFunction.js[dateformat()]:%c format parameter is empty','font-weight:700','font-weight:400');
        return;
    }
    const options = {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    const options2 = {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };

    const dateTime = date.toLocaleString('en-US', options);
    const [m2, D, y, H, M, S] = dateTime.split(/[/:,\s]/).filter(el=>el != "" && el != null);
    const dateTime2 = date.toLocaleString('en-US', options2);
    const [m_, d, y_, h, m, s,a] = dateTime2.split(/[/:,\s]/).filter(el=>el != "" && el != null);

    let lm = date.toLocaleString('en-US',{timeZone:'UTC',month:'long'});
    let sm = lm.substring(0,3);

    const replacements = [
        { pattern: /%m2/g, value: m2 },
        { pattern: /%lm/g, value: lm },
        { pattern: /%sm/g, value: sm },
        { pattern: /%d/g, value: d },
        { pattern: /%D/g, value: D },
        { pattern: /%y/g, value: y },
        { pattern: /%h/g, value: h },
        { pattern: /%H/g, value: H },
        { pattern: /%m/g, value: m },
        { pattern: /%M/g, value: M },
        { pattern: /%s/g, value: s },
        { pattern: /%S/g, value: S },
        { pattern: /%a/g, value: a }
    ];
    
    for (const { pattern, value } of replacements) {
        format = format.replace(pattern, value);
    }
      
    return format;
}

export function validateForm(obj,rules) {
    let validated = {
        allValid: true
    };
    
    for (let r in rules) {
        if ((rules[r] == "required" || rules[r].isRequired ) &&
            obj[r] == undefined || obj[r] == '' ) {
                validated[r] = 'empty';
        } else if ((rules[r] != "required" || rules[r].isRequired ) &&
            obj[r] == undefined || obj[r] == '' ) {
                validated[r] = true;  
        } else if (r != 'callback') {
            let emailregex = /[a-z0-9._]+@[a-z]+\.[a-z]{2,3}/i;
            let intregex = /[0-9]+/;
            let floatregex = /[0-9]+.[0-9]+/;

            validated[r] = true;

            if (rules[r].isEmail &&  obj[r].toLowerCase().match(emailregex))
                validated[r] = true;
            else if (rules[r].isEmail ) {
                validated[r] = 'invalid_email';
                continue;
            }

            if (rules[r].isInteger && obj[r].match(intregex))
                validated[r] = true;
            else if (rules[r].isInteger) {
                validated[r] = 'invalid_number';
                continue;
            }

            if (rules[r].isFloat && (obj[r].match(floatregex) || obj[r].match(intregex)))
                validated[r] = true;
            else if (rules[r].isFloat) {
                validated[r] = 'invalid_number';
                continue;
            }

            if (rules[r].regexMatch != null && obj[r].match(rules[r].regexMatch))
                validated[r] = true;
            else if (rules[r].regexMatch != null) {
                validated[r] = 'value_and_regex_not_match';
                continue;
            }

            if (rules[r].equalTo != null &&  obj[r] == rules[r].equalTo)
                validated[r] = true;
            else if (rules[r].equalTo != null) {
                validated[r] = 'values_not_match';
                continue;
            }

            if (typeof rules[r].maxChars == 'number' && rules[r].maxChars >= obj[r].length)
                validated[r] = true;
            else if (typeof rules[r].maxChars == 'number') {
                validated[r] = 'invalid_length_max';
                continue;
            }

            if (typeof rules[r].minChars == 'number' && rules[r].minChars <= obj[r].length)
                validated[r] = true;
            else if (typeof rules[r].minChars == 'number') {
                validated[r] = 'invalid_length_min';
                continue;
            }

            
        }
    }

    let someEmpty = false;

    if (rules.callback != null) {
        for (let v in validated) {
            if (validated[v] === 'empty') {
                validated.allValid = false;
                rules.callback(v);
                someEmpty = true;
                continue;
            }
        }
    }

    if (!someEmpty) {
        for (let v in validated) {
            if (validated[v] != true) {
                validated.allValid = false;
                if (rules[v].callback != null) {
                    rules[v].callback(validated[v]);
                    continue;
                }
            }
        }
    }

    return validated;
}