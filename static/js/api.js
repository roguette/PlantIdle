
export class Result {
    success;
    message;

    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}

export class Api {
    static async getItems() {
        const response = await fetch("/api/get_items", {
            method: "GET"
        });
        if (!response.ok) {
            return new Result(false, `getItems failed: ${response.status}`);
        } else {
            return new Result(true, await response.json());
        }
    }
}