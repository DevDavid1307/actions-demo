import * as fs from 'fs'
import * as path from "path";

export async function readScript(filename:string): Promise<string> {
   return fs.readFileSync(
       path.join(__dirname, "../src/scripts/"+filename),
       "utf8"
   )
}

/**
 * 解析php版本
 *
 * @param version
 */
export async function parseVersion(version: string): Promise<string> {
    switch (version) {
        case "latest":
            return "8.0";
        default:
            switch (true) {
                case version.length > 1:
                    return version.slice(0, 3);
                default:
                    return version + ".0";
            }
    }
}
