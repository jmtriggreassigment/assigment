export const createElement = (html: string) => {
    const element = new window.DOMParser().parseFromString(html, 'text/html').body.firstChild;

    if (!element) throw new Error(`Something went wrong while creating element: \n ${html}`);

    return element;
}