export class Result {
    success;
    message;

    constructor(success, message) {
        this.success = success;
        this.message = message;
    }

    getMessage() {
        return this.message;
    }
}
let lastItemData = null;
let lastFetchTimeSeconds = 0;
export class Api {
    static async getItems() {
        if (lastItemData !== null) { // Fixed condition
            return lastItemData;
        }
        const response = await fetch("/api/get_items", {
            method: "GET"
        });
        if (!response.ok) {
            return new Result(false, `getItems failed: ${response.status}`);
        } else {
            let json = await response.json();
            lastItemData = new Result(true, json); // Cache the result
            lastFetchTimeSeconds = new Date().getSeconds();
            return lastItemData; // Return cached result
        }
    }
}