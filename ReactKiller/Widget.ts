import { NoMethodDefinedError } from "./errors/NoMethodDefinedError";

export abstract class ReactKillerWidget {
    protected target: HTMLElement;
    private _definitionContext: any; // it is the context of the widget definition, to know where are attached handlers defined
    public state: 'notInitialized' | 'initializing' | 'subTreeRendering' | 'initialized' | 'failed' | 'destroyed' = 'notInitialized';
    beforeInit?(): void;
    beforeSubTreeRender?(): void;
    abstract init(target: Element, done: () => void, fail: (error: Error) => void): void;
    afterInit?(): void;

    beforeDestroy?(): void;
    abstract destroy(target: Element): void;
    afterDestroy?(): void;

    constructor(target: HTMLElement, context: any) {
        this.target = target;
        this._definitionContext = context;
        this._attachHandlers();
    }

    public _init(done: () => void, fail: (error: Error) => void) {
        this.state = 'initializing'
        this.init(this.target, done, (error: Error) => {
            this.state = 'failed'
            fail(error)
        });
    }

    public _destroy() {
        if (this.state === 'destroyed') return
        this.state = 'destroyed'
        this.destroy(this.target);
    }

    private _getDefinedHandlers() {
        const attributes = this.target.getAttributeNames().filter(attr => attr.endsWith('handler'));

        return attributes.reduce<Record<string, string[]>>((acc, attr) => {
            const handler = this.target.getAttribute(attr)

            if (!handler) return acc;
            acc[attr] = [...(acc[attr] || []), handler]
            return acc;
        }, {})
    }

    private _attachHandlers() {
        const handlers = this._getDefinedHandlers();

        const proto = Object.getPrototypeOf(this);
        const props = Object.getOwnPropertyNames(proto);

        props.forEach(prop => {
            if (!prop.endsWith('Handler')) return;

            // @ts-ignore
            const originalMethod = this[prop];

            if (!originalMethod) return;

            // @ts-ignore
            this[prop] = function (...args: unknown[]) {
                const htmlAttributeName = prop.toLowerCase()

                const definitionHandlers = handlers[htmlAttributeName]

                const result = originalMethod.apply(this, args);

                if (definitionHandlers) definitionHandlers.forEach(handler => {
                    if (!this._definitionContext[handler]) throw new NoMethodDefinedError(this._definitionContext.constructor.name, handler, this.target)
                    this._definitionContext[handler](...args)
                });

                return result;
            };

        })
    }
}
