import { WidgetDestroyedError } from "./errors/WidgetDestroyed";
import { WidgetsDestroyManager } from "./WidgetsDestroyManager";
import { ReactKillerWidget } from "./Widget";
import { WidgetsFactory } from "./WidgetsFactory";


type RenderingOptions = {
    onError: (error: Error) => void
}


export class WidgetsManager {
    private widgetsFactory: WidgetsFactory;
    private renderingProcesses: WeakMap<Element, Promise<void>> = new WeakMap();
    private widgets: WeakMap<Element, ReactKillerWidget> = new WeakMap();
    private widgetsDestroyManager: WidgetsDestroyManager = new WidgetsDestroyManager();


    public constructor(widgetsFactory: WidgetsFactory) {
        this.widgetsFactory = widgetsFactory
    }

    private getWidgetName(target: Element) {
        return target.getAttribute("widget");
    }

    private async createWidgetInstancesForAlreadyDefinedWidgets(widgetName: string, target: Element, context: any) {
        await Promise.all(Array.from(target.children).map(child => this.createWidgetInstancesForAlreadyDefinedWidgets(widgetName, child, context)))
        await this.widgetsFactory.createWidget(widgetName, target, context);
    }

    public async render(target: Element, context: ReactKillerWidget | Window, options: RenderingOptions): Promise<void> {
        const widgetName = this.getWidgetName(target);
        if (!widgetName) { await this.renderChildren(target, context, options); return; }

        const alreadyStartedRendering = this.renderingProcesses.has(target);
        if (alreadyStartedRendering) return this.renderingProcesses.get(target);

        const alreadyRendered = this.widgets.get(target);
        if (alreadyRendered && alreadyRendered.state !== 'destroyed' && alreadyRendered.state !== 'failed') { await this.renderChildren(target, context, options); return; }

        // Start rendering children, thats are already defined to speed up the process, and attach proper definition context to them
        // this.renderChildren(target, context, options);

        try {
            // create widget instances for children, defined in different context than parent node
            await this.createWidgetInstancesForAlreadyDefinedWidgets(widgetName, target, context);

            const destroyEventPromise = new Promise<never>((_, reject) => this.widgetsDestroyManager.subscribe(target, () => reject(new WidgetDestroyedError(widgetName, target))));

            const renderingProcess = this.initWidgetLifecycle(widgetName, target, context, options);
            this.renderingProcesses.set(target, renderingProcess);

            await Promise.race([destroyEventPromise, renderingProcess]);
        } catch (error) {
            if (error instanceof Error) {
                return options.onError(error);
            }
            options.onError(new Error(String(error)));
        } finally {
            this.renderingProcesses.delete(target);
            this.widgetsDestroyManager.unsubscribe(target);
        }
    }

    private async initWidgetLifecycle(widgetName: string, target: Element, context: any, options: RenderingOptions) {
        const widget = await this.widgetsFactory.createWidget(widgetName, target, context);
        this.widgets.set(target, widget);

        if (widget.beforeInit) widget.beforeInit();

        const initPromise = new Promise<void>((resolve, reject) => {
            this.widgetsDestroyManager.subscribe(target, () => reject(new WidgetDestroyedError(widgetName, target)));

            widget._init(() => resolve(), (e) => reject(e));
        });

        await initPromise;

        widget._beforeSubTreeRender();

        await this.renderChildren(target, widget, options);

        widget._afterInit();
    }

    private async renderChildren(target: Element, context: any, options: RenderingOptions) {
        return Promise.allSettled(Array.from(target.children).map(async node => {
            return this.render(node, context, options)
        }));
    }

    public async destroy(target: Element) {
        this.widgetsDestroyManager.emit(target);

        this.destroyChildren(target);
        const widget = this.widgets.get(target);
        if (widget) {
            widget._destroy()
        };

        this.renderingProcesses.delete(target)
    }

    private destroyChildren(target: Element) {
        const children = Array.from(target.children);
        children.forEach(child => this.destroy(child));
    }
}