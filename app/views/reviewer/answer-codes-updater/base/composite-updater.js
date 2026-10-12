import IUpdater from './updater-interface';

export default class CompositeUpdater extends IUpdater {
    constructor(updaters = []) {
        super();
        this._updaters = updaters;
    }

    add(updater) {
        if (!updater) {
            return;
        }

        this._updaters.push(updater);
    }

    update(display) {
        this._updaters.forEach(updater => {
            updater.update(display);
        });
    }
}
