export type WidgetsResolver = {
    import: (widgetName: string) => Promise<{ default: unknown }>
}