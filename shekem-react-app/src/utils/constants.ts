export function insertValuesToConstantStr(configString: string, ...values: number[]): string {
    let argsIndex = 0;
    let result = '';
    for (let i = 0; i < configString.length; i++) {
        if (configString[i] === '{') {
            result += values[argsIndex];
            argsIndex++;
            while (i < configString.length && configString[i] !== '}') {
                i++;
            }
        } else {
            result += configString[i];
        }
    }
    return result;
}

