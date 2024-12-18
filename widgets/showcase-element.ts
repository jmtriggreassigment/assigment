import { ReactKillerWidget } from "../ReactKiller/Widget";
import "../ReactKiller";
import { stateColors } from "./states-colors";

export default class ShowcaseElement extends ReactKillerWidget {
    addContainerStyling() {
        this.target.classList.add('rounded-md')
        this.target.classList.add('p-4')
        this.target.classList.add('m-4')

        this.target.classList.add('hover:border-black')
        this.target.classList.add('border-2')
        this.target.classList.add('border-transparent')
        this.target.classList.add('shadow-xl')

        this.target.classList.add('cursor-pointer')
    }

    // @ts-ignore
    async init(target: HTMLElement, done: () => void, fail: (error: Error) => void) {
        this.addContainerStyling();
        this.setState('initializing');

        this.target.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clickHandler(e)
        });

        const failHandler = () => {
            this.target.removeEventListener('fail', failHandler);
            this.target.removeEventListener('done', doneHandler);
            this.setState('failed');
            fail(new Error('ShowcaseElement fail'));
        }

        const doneHandler = () => {
            this.target.removeEventListener('fail', failHandler);
            this.target.removeEventListener('done', doneHandler);
            done();
        }

        this.target.addEventListener('done', doneHandler);

        this.target.addEventListener('fail', failHandler);
    }

    beforeSubTreeRender(): void {
        this.setState('subTreeRendering');
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

    // @ts-ignore
    clickHandler(e: MouseEvent) {
    }
}