import { ReactKillerWidget } from "../ReactKiller/Widget";
import { stateColors } from "./states-colors";

export default class App extends ReactKillerWidget {
    selectedWidget: HTMLElement | null = null;

    init(target: HTMLElement, done: () => void) {

        if (this.alreadyHasContent(target)) return done();

        target.classList.add('container');

        const container = document.createElement('div');

        const showcaseContainer = document.createElement('div');
        showcaseContainer.setAttribute('data-app', '');
        showcaseContainer.setAttribute('widget', 'widgets/showcase-element');
        showcaseContainer.setAttribute('clickHandler', 'selectWidget');
        showcaseContainer.style.color = stateColors.notInitialized;

        const innerBranch1 = document.createElement('div');
        innerBranch1.setAttribute('widget', 'widgets/showcase-element');
        innerBranch1.setAttribute('clickHandler', 'selectWidget');
        innerBranch1.style.color = stateColors.notInitialized;

        const innerLeaf1 = document.createElement('div');
        innerLeaf1.setAttribute('widget', 'widgets/showcase-element');
        innerLeaf1.setAttribute('clickHandler', 'selectWidget');
        innerLeaf1.style.color = stateColors.notInitialized;

        const innerBranch2 = document.createElement('div');
        innerBranch2.setAttribute('widget', 'widgets/showcase-element');
        innerBranch2.setAttribute('clickHandler', 'selectWidget');
        innerBranch2.style.color = stateColors.notInitialized;

        const innerLeaf2 = document.createElement('div');
        innerLeaf2.setAttribute('widget', 'widgets/showcase-element');
        innerLeaf2.setAttribute('clickHandler', 'selectWidget');
        innerLeaf2.style.color = stateColors.notInitialized;

        innerBranch1.appendChild(innerLeaf1);
        innerBranch2.appendChild(innerLeaf2);
        showcaseContainer.appendChild(innerBranch1);
        showcaseContainer.appendChild(innerBranch2);

        const statesColors = document.createElement('div');
        statesColors.setAttribute('widget', 'widgets/states-colors');
        statesColors.style.color = stateColors.notInitialized;

        const widgetsControls = document.createElement('div');
        widgetsControls.setAttribute('widget', 'widgets/widgets-controls-section');
        widgetsControls.setAttribute('initHandler', 'initSelectedWidget');
        widgetsControls.setAttribute('destroyHandler', 'destroySelectedWidget');
        widgetsControls.setAttribute('doneHandler', 'doneSelectedWidget');
        widgetsControls.setAttribute('failHandler', 'failSelectedWidget');

        const selectedWidgetSelector = document.createElement('div');
        selectedWidgetSelector.className = 'p-4 m-4 border-2 border-black';
        selectedWidgetSelector.id = 'selected-widget-selector';
        selectedWidgetSelector.textContent = this.selectedWidget ? this.getSelector(this.selectedWidget) : '';

        container.appendChild(showcaseContainer);
        container.appendChild(statesColors);
        container.appendChild(widgetsControls);
        container.appendChild(selectedWidgetSelector);


        target.appendChild(container);

        done();
    }

    initSelectedWidget() {
        if (!this.selectedWidget) return;
        const selector = this.getSelector(this.selectedWidget);

        window.ReactKiller.getInstance().init(this.selectedWidget, (errors) => {
            console.log(`${selector} /n Widget init errors: `, errors);
        });
    }

    destroySelectedWidget() {
        if (!this.selectedWidget) return;

        window.ReactKiller.getInstance().destroy(this.selectedWidget);
    }

    doneSelectedWidget() {
        if (!this.selectedWidget) return;

        this.selectedWidget.dispatchEvent(new CustomEvent('done'));
    }

    failSelectedWidget() {
        if (!this.selectedWidget) return;

        this.selectedWidget.dispatchEvent(new CustomEvent('fail'));
    }

    alreadyHasContent(target: HTMLElement) {
        return target.querySelector(':scope > div[data-app]');
    }

    selectWidget(e: MouseEvent) {
        this.selectedWidget = e.target as HTMLElement;
        const widgetSelectorContainer = this.target.querySelector('#selected-widget-selector')

        if (widgetSelectorContainer) {
            widgetSelectorContainer.textContent = this.getSelector(this.selectedWidget);
        }
    }

    destroy() {
        console.log('App destroy');
    }

    getSelector = (el: Element): string => {
        if (!el.parentElement || el.parentElement === this.target) return el.tagName.toLowerCase();
        const siblings = Array.from(el.parentElement.children);
        const index = siblings.indexOf(el);
        const sameTagSiblings = siblings.filter(sibling =>
            sibling.tagName === el.tagName
        );
        const tagName = el.tagName.toLowerCase();
        const nth = sameTagSiblings.length > 1
            ? `:nth-of-type(${index + 1})`
            : '';
        return `${this.getSelector(el.parentElement)} > ${tagName}${nth}`;
    };
}