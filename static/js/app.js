
const inventorySlots = 30;


let loadBenchmarkStart = Date.now();

class Result {
    success;
    message;
    
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}

class Item {
    static nextId = 0;
    id;
    itemName;
    price;
    itemType;
    itemData;

    constructor(itemName, price, itemType, itemData) {
        if (!itemName || !price || !itemType || !itemData ) {
            throw new Error("One or more item parameters are null");
        }


        this.id = Item.nextId++;
        this.itemName = itemName;
        this.price = price;
        this.itemType = itemType;
        this.itemData = itemData;
    }
}
class InventorySlot {
    count;
    item;

    constructor(item = null, count = 0) {
        this.item = item;
        this.count = count;
    }

    isEmpty() {
        let isSlotEmpty = this.item === null || this.count <= 0;
        
        if (isSlotEmpty) {
            this.item = null;
            this.count = 0;
        }

        return isSlotEmpty;
    }
}
class Inventory {
    slots = [];

    constructor() {
        for (let i = 0; i < inventorySlots; i++) {
            this.slots.push(new InventorySlot());
        }
    }

    printItems(columns = 5) {
        console.log(this.slots);
        let toShow = [];
        for (let i = 0; i < inventorySlots; i++) {
            let row = Math.floor(i / columns);
            let column = i % columns

            if (toShow[row] === undefined) {
                toShow[row] = [];
            }

            let slot = this.slots[i];
            if (slot.isEmpty()) {
                toShow[row][column] = "None";
            } else {
                toShow[row][column] = `${i}: ${slot.item.itemName}x${slot.count}`;
            }
            
        }
        console.table(toShow);
    }
    addItem(addedItem, count = 1, index = null) {
        if (!(addedItem instanceof Item)) {
            return new Result(false, "Not an item");
        }

        if (index !== null) { // allows inserting in specific slots
            index = index % inventorySlots;
            if (this.slots[index].isEmpty()) {
                this.slots[index].item = addedItem;
                return new Result(true, "");
            }
        }

        for (let i = 0; i < inventorySlots; i++) { // check the first slot, then the second ...
            if (this.slots[i].isEmpty()) {
                this.slots[i].item = addedItem;
                this.slots[i].count = count;
                return new Result(true, "");
            }   
        }
        return new Result(false, "Inventory is full");
    }
    setItemCount(index, count) {
        if (!index || !count) {
            return new Result(false, "Index and count cannot be null");
        }
        if (this.slots[index] === null) {
            return new Result(false, "Cannot set count of item which doesnt exist");
        }
        
        this.slots[index].count = count
    }
    
}



$(()=>{
    console.log(`Loaded in ${Date.now() - loadBenchmarkStart} ms`);
})