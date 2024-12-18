export class WidgetDestroyedError extends Error {
    public target: Element;
    
    constructor(widgetName: string, target: Element) {
        super(`Widget "${widgetName}" was destroyed during initialization`);
        this.target = target;
        this.name = 'WidgetDestroyedError';
    }
} 