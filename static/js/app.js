
const inventorySlots = 30;
const stackSize = 99;

class Result {
    success;
    message;
    
    constructor(success, message) {
        this.success = success;
        this.message = message;
    }
}

class Item {
    // from data.json
    name;
    id;
    itemType;
    buyPrice;
    sellPrice;
    growthTime;
    isSpecial;

    constructor({name, id, itemType, buyPrice, sellPrice, growthTime, isSpecial}) {
        this.name = name;
        this.id = id;
        this.itemType = itemType;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.growthTime = growthTime;
        this.isSpecial = isSpecial;
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
        
        if (isSlotEmpty) { // automatically clears invalid items
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
    #validateItems() {
        for (let i = 0; i < inventorySlots; i++) {
            slots[i].isEmpty(); 
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
                toShow[row][column] = `${i}: ${slot.item.id}x${slot.count}`;
            }
            
        }
        console.table(toShow);
    }
    addItem(addedItem, count = 1, index = null) {
        if (!(addedItem instanceof Item)) {
            return new Result(false, "Not an item");
        }
        if (count < 1) {
            return new Result(false, "Count cannot be less than 1");
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
    console.log(`DOMContentLoaded`);
})