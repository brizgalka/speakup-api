import libxml from "libxmljs2"
import path from 'path'
import fs from "fs"

const file = path.join(__dirname,"/userViews.xml")
const xmlString = fs.readFileSync(file,"utf-8").toString()

const xmlDoc = libxml.parseXmlString(xmlString);

const gchild = xmlDoc.get('//HelloText');

class TelegramView {

    static sendHelloText(tgId: number) {
        console.log(xmlString);
        console.log(xmlDoc);
    }

}

export default TelegramView