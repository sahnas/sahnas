import { Configurations } from './models';

type MethodNames = 'init';
export const DEFAULT_NAME = 'sahnas';

/**
 * Represents a model that is created in embedded script
 * as part of script initialization.
 */
interface LoaderObject {
    /**
     * Queue that accumulates method calls during downloading
     * and loading of widget's script file.
     */
    q: Array<[MethodNames, {}]>;
}

/**
 * Loads widget instance.
 *
 * @param win Global window object which stores pre-loaded and post-loaded state of widget instance.
 * @param defaultConfig A configurations that are merged with user.
 * @param scriptElement The script tag that includes installation script and triggered loader.
 * @param render A method to be called once initialization done and DOM element for hosting widget is ready.
 */
export default (
    win: Window,
    defaultConfig: Configurations,
    scriptElement: Element | null,
    render: (element: HTMLElement, config: Configurations) => void) => {

    // get a hold of script tag instance, which has an
    // attribute `id` with unique identifier of the widget instance
    const instanceName = scriptElement?.attributes.getNamedItem('id')?.value ?? DEFAULT_NAME;
    const loaderObject: LoaderObject = win[instanceName];
    if (!loaderObject || !loaderObject.q) {
        throw new Error(`Le widget ne trouve pas de LoaderObject pour l\'instance ${instanceName}. ` +
            `Le script de chargement a été modifié ou n\' appelle pas la méthode 'init' ` +
            `ou bien il y a un conflit avec l\'objet \`window.${instanceName}\` .`);
    }

    // check that the widget is not loaded twice under the same name
    if (win[`loaded-${instanceName}`]) {
        throw new Error(`Le widget ${instanceName} est déjà chargé. `
            + `Il existe plusieurs instances avec le même nom (ex: '${DEFAULT_NAME}')`);
    }

    // iterate over all methods that were called up until now
    for (let i = 0; i < loaderObject.q.length; i++) {
        const item = loaderObject.q[i];
        const methodName = item[0];
        if (i === 0 && methodName !== 'init') {
            throw new Error(`Impossible de lancer le Widget ${instanceName}. La méthode 'init' doit être appelée en premier.`);
        } else if (i !== 0 && methodName === 'init') {
            continue;
        }
        switch (methodName) {
            case 'init':
                const loadedObject = Object.assign(defaultConfig, item[1]);
                if (loadedObject.debug) {
                    console.log(`Lancement du widget ${instanceName}`, loadedObject);
                }

                // the actual rendering of the widget
                const wrappingElement = loadedObject.element ?? win.document.body;
                const targetElement = wrappingElement.appendChild(win.document.createElement('div'));
                targetElement.setAttribute('id', `widget-${instanceName}`);
                render(targetElement, loadedObject);

                // store indication that widget instance was initialized
                win[`loaded-${instanceName}`] = true;
                break;
            // TODO: here you can handle additional async interactions
            // with the widget from page (e.q. `_hw('refreshStats')`)
            default:
                console.warn(`Méthode non supportee ${methodName}`, item[1]);
        }
    }

    // once finished processing all async calls, we going
    // to convert LoaderObject into sync calls to methods
    win[instanceName] = (method: MethodNames, ...args: any[]) => {
        switch (method) {
            // TODO: here you can handle additional sync interactions
            // with the widget from page
            default:
                console.warn(`Méthode non supportee ${method}`, args);
        }
    };
};
