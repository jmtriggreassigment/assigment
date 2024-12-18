import { WidgetsResolver } from "./WidgetsResolver";
import { ReactKillerWidget } from "./Widget";
import { IncorrectWidgetComponentError } from "./errors/IncorectWidgetComponent";

type Constructor<T> = new (...args: unknown[]) => T;
export type WidgetConstructor = Constructor<ReactKillerWidget>;

function isConstructor(value: unknown): boolean {
    return (
        typeof value === 'function' &&
        value.prototype &&
        Object.prototype.toString.call(value.prototype) === '[object Object]'
    );
}

export class WidgetsConstructorsImporter {
    private widgetsResolver: WidgetsResolver;
    private widgetsConstructors: Map<string, WidgetConstructor> = new Map();

    constructor(widgetsResolver: WidgetsResolver) {
        this.widgetsResolver = widgetsResolver;
    }

    public async import(widgetName: string): Promise<WidgetConstructor> {
        const alreadyImportedConstructor = this.widgetsConstructors.get(widgetName);
        if (alreadyImportedConstructor) return alreadyImportedConstructor;

        const importResult = await this.widgetsResolver.import(widgetName);

        if (!importResult.default) throw new IncorrectWidgetComponentError(widgetName);

        if (!isConstructor(importResult.default))
            throw new IncorrectWidgetComponentError(widgetName);

        const widgetConstructor = importResult.default as Constructor<unknown>;

        if (widgetConstructor.prototype && !ReactKillerWidget.prototype.isPrototypeOf(widgetConstructor.prototype))
            throw new IncorrectWidgetComponentError(widgetName + " not instance of ReactKillerWidget");

        this.widgetsConstructors.set(widgetName, widgetConstructor as WidgetConstructor);

        return widgetConstructor as WidgetConstructor;
    }
}