export default class OpenAssistService {
    constructor(endpoint) {
        this._endpoint = endpoint;
        this._abortController = null;
    }

    cancel() {
        if (this._abortController) {
            this._abortController.abort();
            this._abortController = null;
        }
    }

    async ask(questionAnswer, metadata) {
        this.cancel();

        this._abortController = new AbortController();

        const response = await fetch(this._endpoint, {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questionAnswer, metadata }),
            signal: this._abortController.signal,
        });

        this._abortController = null;

        if (response.status !== 200) {
            throw new Error(`Request to OpenAssistService is failed. Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
            throw new Error(`Request to OpenAssistService is failed. Error: ${result.error}`);
        }

        return result.response;
    }
}
