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
        const isSlotEmpty = this.item === null || this.count <= 0;
        
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

    printItems(columns = 5) {
        //console.log(this.slots);
        let toShow = [];
        for (let i = 0; i < inventorySlots; i++) {
            const row = Math.floor(i / columns);
            const column = i % columns

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
    addItem(addedItem, toAdd = 1, index = null) {
        if (this.isFull()) {
            return new Result(false, "Inventory is full");
        }

        if (!(addedItem instanceof Item)) {
            return new Result(false, "Not an item");
        }
        if (toAdd < 1) {
            return new Result(false, "Count cannot be less than 1");
        }
        if (index !== null) { // allows inserting in specific slots
            index = ((index % inventorySlots) + inventorySlots) % inventorySlots; 
            const slot = this.slots[index];
            if (!slot.isEmpty() && slot.item.id === addedItem.id) {
                // can stack
                const space = stackSize - slot.count; // 10 (space left) = 99 (stack size) - 80 (items in slot) 
                const willAdd = Math.min(space, toAdd); // 10 = min(10, 80 (items to add to the inventory))
                if (add > 0) {
                    slot.count += willAdd;
                    toAdd -= willAdd;
                }
            } else if (slot.isEmpty()) {
                // cannot stack
                // no need to calculate space because the slot is empty, just add stack size
                const willAdd = Math.min(stackSize, toAdd) // add at most 1 stack
                slot.item = addedItem
                slot.count = willAdd;
                toAdd -= willAdd;
            }
        }

        for (let i = 0; i < inventorySlots && toAdd > 0; i++) { // first pass - find if theres a slot the item can stack with
            const slot = this.slots[i];

            if (slot.isEmpty()) {
                continue; // ignore empty slots
            }

            if (slot.item.id == addedItem.id) {
                // add to existing stack, do not exceed stackSize
                const space = stackSize - slot.count;
                const ableToAdd = Math.min(space, toAdd);
                if (ableToAdd > 0) {
                    slot.count += ableToAdd;
                    toAdd -= ableToAdd;
                }

            }   
        }

        for (let i = 0; i < inventorySlots && toAdd > 0 ; i++) { // second pass - Ok we cant stack with anything, look for an empty slot
            const slot = this.slots[i];
            if (!slot.isEmpty()) {
                continue; // skip slots with items
            }   
            const willAdd = Math.min(stackSize, toAdd) // add at most 1 stack
            slot.item = addedItem
            slot.count = willAdd;
            toAdd -= willAdd;
        }
        if (toAdd > 0) {
            return new Result(false, "Not all items could be added");
        } else if (toAdd === 0) {
            return new Result(true, "");
        }


    }
    setItemCount(index, count) {
        if (index === undefined || index === null || count === undefined || count === null) {
            return new Result(false, "Index and count cannot be null");
        }
        if (index < 0 || index >= inventorySlots) {
            return new Result(false, "Index out of range");
        }
        if (this.slots[index].isEmpty()) {
            return new Result(false, "Cannot set count of item which doesn't exist");
        }
        this.slots[index].count = count;
        return new Result(true, "");
    }
    isFull() {
        for (let i = 0; i < inventorySlots; i++) {
            const slot = this.slots[i];
            if (slot.isEmpty()) {
                return false;
            }
        }
        return true;
    }
}


$(()=>{
    console.log(`DOMContentLoaded`);
})