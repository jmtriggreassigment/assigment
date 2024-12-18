import { WidgetsManager } from "./WidgetsManager";
import { WidgetsFactory } from "./WidgetsFactory";
import { NoWidgetResolverProvidedError } from "./errors/NoWidgetResolverProvided";
import { WidgetsResolver } from "./WidgetsResolver";
import { WidgetsConstructorsImporter } from "./WidgetsConstructorsImporter";
import { ReactKillerWidget } from "./Widget";

interface IReactKiller {
  init: (target: Element, callback: (data: { errors: Error[] }) => void) => void
  destroy: (target: Element) => void
}

class ReactKiller implements IReactKiller {
  private readonly widgetsManager: WidgetsManager;
  static _instance: ReactKiller;

  private constructor(options: { widgetsResolver: WidgetsResolver }) {
    const widgetsConstructorsImporter = new WidgetsConstructorsImporter(options.widgetsResolver);
    const widgetsFactory = new WidgetsFactory(widgetsConstructorsImporter);
    this.widgetsManager = new WidgetsManager(widgetsFactory);
  }

  public static getInstance(options?: { widgetsResolver: WidgetsResolver }): ReactKiller {
    if (!ReactKiller._instance) {
      if (!options?.widgetsResolver) throw new NoWidgetResolverProvidedError();
      ReactKiller._instance = new ReactKiller(options);
    }
    return ReactKiller._instance;
  }

  public async init(target: Element, callback: (data: { errors: Error[] }) => void) {
    const errors: Error[] = [];

    const onError = (error: Error) => {
      errors.push(error);
    }

    await this.widgetsManager.render(target, window, { onError });
    callback({ errors });
  }

  public destroy(target: Element) {
    this.widgetsManager.destroy(target);
  }
}

declare global {

  interface Window {
    ReactKiller: typeof ReactKiller;
    ReactKillerWidget: typeof ReactKillerWidget;
  }
}

if (typeof window !== 'undefined') {
  window.ReactKiller = window.ReactKiller || ReactKiller;
  window.ReactKillerWidget = window.ReactKillerWidget || ReactKillerWidget;
}

if (typeof global !== 'undefined') {
  // @ts-ignore
  global.ReactKiller = global.ReactKiller || ReactKiller;
  // @ts-ignore
  global.ReactKillerWidget = global.ReactKillerWidget || ReactKillerWidget;
}
