
import { WidgetsConstructorsImporter } from "./WidgetsConstructorsImporter";
import { ReactKillerWidget } from "./Widget";

export class WidgetsFactory {
    private widgetsConstructorsImporter: WidgetsConstructorsImporter;

    private widgetsInstances: WeakMap<Element, ReactKillerWidget> = new WeakMap();

    public constructor(widgetsResolver: WidgetsConstructorsImporter) {
        this.widgetsConstructorsImporter = widgetsResolver;
    }

    public async createWidget(widgetName: string, target: Element, context: any) {
        const widget = this.widgetsInstances.get(target)
        if (widget) return widget

        const constructor = await this.widgetsConstructorsImporter.import(widgetName);


        const newInstance = new constructor(target, context);
        this.widgetsInstances.set(target, newInstance);

        return newInstance;
    }
}