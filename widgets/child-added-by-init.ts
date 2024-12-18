import { ReactKillerWidget } from "../ReactKiller/Widget";
import { stateColors } from "./states-colors";

export default class ChildAddedByInit extends ReactKillerWidget {
    beforeInit() {
        this.setState('initializing');
    }

    init(target: HTMLElement, done: () => void) {
        this.addContainerStyling(target);
        done();

    }

    addContainerStyling(target: HTMLElement) {
        target.classList.add('shadow-lg')
        target.classList.add('rounded-md')
        target.classList.add('p-4')
        target.classList.add('m-4')
        target.classList.add('flex')
        target.classList.add('flex-col')
        target.classList.add('gap-4')
    }

    afterInit() {
        this.setState('initialized');
    }

    setState(state: keyof typeof stateColors) {
        this.target.style.backgroundColor = stateColors[state];
    }

    destroy(): void {
        this.setState('destroyed');
    }
}