export class NoMethodDefinedError extends Error {
    public target: Element;

    constructor(context: any, method: string, target: Element) {
        super(`Method ${method} is not defined in ${context}`);
        this.target = target;
    }
}