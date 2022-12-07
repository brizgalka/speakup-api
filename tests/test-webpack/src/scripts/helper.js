function square(a,b) {
    if(b == 0) {
        return 1
    } else {
        return a ** b
    }
}
function sum(a,b) {
    function dot_number(num) {
        const num1 = String(num)
        const split = num1.split("")
        if(split.includes(".")) {
            const dot_index = split.indexOf(".")
            return split.length - dot_index - 1
        } else {
            return 0
        }
    }
    var a1 = a;
    var b1 = b;
    const a_dots = dot_number(a)
    const b_dots = dot_number(b)
    const scope = dot_number(a) + dot_number(b)
    a1 = a * square(10,a_dots) * square(10,b_dots)
    b1 = b * square(10,b_dots) * square(10,a_dots)
    const sum = a1 + b1
    return sum / (10 ** scope)
}
function min(a,b) {
    function dot_number(num) {
        const num1 = String(num)
        const split = num1.split("")
        if(split.includes(".")) {
            const dot_index = split.indexOf(".")
            return split.length - dot_index - 1
        } else {
            return 0
        }
    }
    var a1 = a;
    var b1 = b;
    const a_dots = dot_number(a)
    const b_dots = dot_number(b)
    const scope = dot_number(a) + dot_number(b)
    a1 = a * square(10,a_dots) * square(10,b_dots)
    b1 = b * square(10,b_dots) * square(10,a_dots)
    const sum = a1 - b1
    return sum / (10 ** scope)
}