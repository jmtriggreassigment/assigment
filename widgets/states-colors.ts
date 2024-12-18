import { ReactKillerWidget } from "../ReactKiller/Widget"

export const stateColors = {
    notInitialized: '#FFFFF',
    initializing: '#BFAE48',
    subTreeRendering: '#649e88',
    initialized: '#2D936C',
    failed: '#e60785',
    destroyed: '#391463',
}

export default class StatesColors extends ReactKillerWidget {
    init(target: HTMLElement, done: () => void) {
        target.classList.add('flex')
        target.classList.add('gap-4')


        const container = document.createElement('div');
        container.className = 'flex justify-center';

        Object.entries(stateColors).forEach(([state, color]) => {
            const stateContainer = document.createElement('div');
            stateContainer.className = 'border-2';

            const stateLabel = document.createElement('div');
            stateLabel.className = 'w-min-[100px] p-2 border-2 border-black';
            stateLabel.textContent = state;

            const colorBox = document.createElement('div');
            colorBox.className = 'w-min-[100px] h-[20px] border-2 border-black';
            colorBox.style.backgroundColor = color;

            stateContainer.appendChild(stateLabel);
            stateContainer.appendChild(colorBox);
            container.appendChild(stateContainer);
        });

        target.appendChild(container);

        done();
    }

    destroy() {
    }
}