
class Subscription<T extends (...args: any) => any> {
    private handlers: T[] = [];

    public subscribe(handler: T): () => void {
        this.handlers.push(handler);
        return () => this.unsubscribe(handler);
    }

    public unsubscribe(handler: T): void {
        const index = this.handlers.indexOf(handler);
        if (index !== -1) {
            this.handlers = this.handlers.filter(h => h !== handler);
        }
    }

    public emit(...args: Parameters<T>): void {
        this.handlers.forEach(handler => handler(...args));
    }
}

type DestroyHandler = (target: Element) => void

export class WidgetsDestroyManager {
    private subscriptions: WeakMap<Element, Subscription<DestroyHandler>> = new WeakMap();

    public subscribe(target: Element, handler: DestroyHandler): () => void {
        const subscription = this.subscriptions.get(target) || new Subscription<DestroyHandler>();
        this.subscriptions.set(target, subscription);
        return subscription.subscribe(handler);
    }

    public unsubscribe(target: Element): void {
        this.subscriptions.delete(target);
    }

    public emit(target: Element): void {
        const subscription = this.subscriptions.get(target);
        if (subscription) {
            subscription.emit(target);
            this.subscriptions.delete(target);
        }
    }
}