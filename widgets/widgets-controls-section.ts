import { ReactKillerWidget } from "../ReactKiller/Widget"

export default class WidgetsControlsSection extends ReactKillerWidget {
    init(target: HTMLElement, done: () => void) {
        target.classList.add('flex')
        target.classList.add('gap-4')
        target.classList.add('p-4')
        const buttons = this.createButtonsContainer()

        buttons.appendChild(this.createButton('init', () => this.initHandler()));
        buttons.appendChild(this.createButton('destroy', () => this.destroyHandler()));
        buttons.appendChild(this.createButton('done', () => this.doneHandler()));
        buttons.appendChild(this.createButton('fail', () => this.failHandler()));

        if (!buttons) throw new Error('WidgetsControlsSection content not created');

        target.appendChild(buttons);

        done();
    }

    createButtonsContainer() {
        const container = document.createElement('div');
        container.classList.add('flex')
        container.classList.add('gap-4')
        return container;
    }

    createButton(text: string, handler: () => void) {
        const button = document.createElement('button');
        button.textContent = text;

        button.classList.add('p-2')
        button.classList.add('bg-black')
        button.classList.add('rounded-md')
        button.classList.add('border-black')
        button.classList.add('text-white')

        button.addEventListener('click', handler);
        return button;
    }

    initHandler() {
    }

    destroyHandler() {
    }

    doneHandler() {
    }

    failHandler() {
    }

    destroy() {
    }
}