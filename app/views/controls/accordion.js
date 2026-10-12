export default class Accordion {
    constructor(panels) {
        this._panels = panels;
        this._panels.forEach(item => item.toggleEvent.on(() => this._onPanelToggle(item)));
    }

    get panels() {
        return this._panels;
    }

    getOpenPanelIndex() {
        return this._panels.findIndex(panel => panel.isOpen);
    }

    async openPanel(panelIndex) {
        if (panelIndex >= this._panels.length && panelIndex < 0) {
            return;
        }

        await this._panels[panelIndex].open();
    }

    async closePanel(panelIndex) {
        if (panelIndex >= this._panels.length && panelIndex < 0) {
            return;
        }

        await this._panels[panelIndex].close();
    }

    _onPanelToggle(currentPanel) {
        if (!currentPanel.isOpen) {
            return;
        }

        this._panels.forEach(panel => {
            if (currentPanel !== panel) {
                panel.close();
            }
        });
    }
}
