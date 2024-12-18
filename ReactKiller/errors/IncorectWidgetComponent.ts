export class IncorrectWidgetComponentError extends Error {

    constructor(widgetName: string) {
        super(`Widget '${widgetName}' has no default export of ReactKillerWidget`);
    }
}