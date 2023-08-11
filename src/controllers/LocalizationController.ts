import { configuration } from "../configuration";

export type LocalizationTable = {
    [key: string]: string | LocalizationTable | string[] | number | undefined;
};

export default class LocalizationController {
    static mapString = (str: string, dict: LocalizationTable = configuration.strings.en): string => {
        return str.replace(/%([a-zA-Z0-9_.]+)%/g, (match, key) => {
            let val = key.split('.').reduce((acc: LocalizationTable, part: string) => {
                if (acc instanceof Array) {
                    throw Error(`Target for ${str} is an Array; Unknown injection solution.`);
                } else if (acc instanceof Object) {
                    return acc[part];
                } else {
                    return undefined;
                }
            }, dict);
    
            if (val instanceof Array) {
                throw Error(`Target for ${str} is an Array; Unknown injection solution.`);
            } else {
                return val ?? match;
            }
        });
    };
}
