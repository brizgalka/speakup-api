import path from 'path'
import fs from 'fs'

const file_path = path.join(__dirname,"/userAgree.txt")

class userAgree {

    getUserAgree(): string|undefined {
        try {
            const data = fs.readFileSync(file_path, 'utf8');
            return data
        } catch (err) {
            console.error(err);
        }
    }

    editUserAgree(newText: string):void {
        try {
            fs.writeFileSync(file_path,newText,'utf8')
        } catch (err) {
            console.error(err);
        }
    }

}