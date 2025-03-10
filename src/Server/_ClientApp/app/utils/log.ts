import { inspect } from "util";


export const log = (obj: any) => {
    console.log(inspect(obj, {showHidden: false, depth: null, colors: true}))
}
