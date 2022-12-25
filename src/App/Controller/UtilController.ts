

class UtilController {

    generatePassword(length: number) {
        let result = ""
        const AllChars = [];
        for (let i=32; i<127; i++) AllChars.push(String.fromCharCode(i));
        for (let i=0;i<length;i++) result += AllChars[Math.floor(Math.random() * (AllChars.length + 1))]
        return result
    }

}

export default UtilController