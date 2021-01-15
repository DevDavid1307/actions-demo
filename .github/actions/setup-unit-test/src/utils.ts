import * as fs from 'fs'
import * as path from "path";

export async function readScript(filename:string): Promise<string> {
   return fs.readFileSync(
       path.join(__dirname, "../src/scripts/"+filename),
       "utf8"
   )
}
