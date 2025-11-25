import { Result, Api } from "./api.js";
import { YesNoModal } from "./modal.js";
export const inventorySlots = 30;
export const stackSize = 99;

export class Item {
    // from data.json
    name;
    id;
    itemType;
    buyPrice;
    sellPrice;
    growthTime;
    isSpecial;
    treeIcon;
    itemIcon;
    itemDescription;
    pestProtection;
    effects;
    label;

    constructor({ name, id, itemType, buyPrice, sellPrice, growthTime, isSpecial, treeIcon, itemIcon, itemDescription, pestProtection, effects, label }) {
        this.name = name;
        this.id = id;
        this.itemType = itemType;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
        this.growthTime = growthTime;
        this.isSpecial = isSpecial;
        this.treeIcon = treeIcon;
        this.itemIcon = itemIcon;
        this.itemDescription = itemDescription;
        this.pestProtection = pestProtection;
        this.effects = effects;
        this.label = label;
    }
}

export function createItemFromData(data) {
    return new Item({
        name: data.name,
        id: data.id,
        itemType: data.item_type,
        buyPrice: data.buy_price,
        sellPrice: data.sell_price,
        growthTime: data.growth_time,
        isSpecial: data.is_special,
        treeIcon: data.tree_icon,
        itemIcon: data.item_icon,
        itemDescription: data.description,
        pestProtection: data.pest_protection,
        effects: data.effects
    });
}

export class InventorySlot {
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
        // console.table does not work without the timeout

        setTimeout(() => {
            console.table(toShow);
        }, 1);

    }
    addItem(addedItem, toAdd = 1, index = null) {

        if (!(addedItem instanceof Item)) {
            return new Result(false, "Not an item");
        }
        if (toAdd < 1) {
            return new Result(false, "Count cannot be less than 1");
        }
        if (!this.willFit(addedItem, toAdd)) {
            return new Result(false, "Inventory is full");
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

        for (let i = 0; i < inventorySlots && toAdd > 0; i++) { // second pass - Ok we cant stack with anything, look for an empty slot
            const slot = this.slots[i];
            if (!slot.isEmpty()) {
                continue; // skip slots with items
            }
            const willAdd = Math.min(stackSize, toAdd) // add at most 1 stack
            slot.item = addedItem
            slot.count = willAdd;
            toAdd -= willAdd;
        }
        this.render();
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
        this.render();
        return new Result(true, "");
    }
    clearSlot(index) {
        let t = this
        if (index === undefined || index === null) {
            return new Result(false, "Index and count cannot be null");
        }
        if (index < 0 || index >= inventorySlots) {
            return new Result(false, "Index out of range");
        }
        new YesNoModal({
            title: "Delete " + this.slots[index].item.name + "?",
            closedCallback: function (value) {
                if (value == "Yes") {
                    t.slots[index].item = null;
                    t.slots[index].count = 0;
                    t.render();
                    return new Result(true, "");
                }
            }
        })

    }
    willFit(item, count) {
        let canFit = 0;
        for (let i = 0; i < inventorySlots; i++) {
            const slot = this.slots[i];
            if (slot.isEmpty()) {
                canFit += stackSize;
            } else if (slot.item.id == item.id) {
                canFit += stackSize - count;
            }
        }
        return canFit >= count;
    }
    swapSlots(a, b) {
        if (a < 0 || a > inventorySlots) {
            return new Result(false, "Cannot swap from slot " + a)
        }
        if (b < 0 || b > inventorySlots) {
            return new Result(false, "Cannot swap from slot " + b)
        }

        [this.slots[a], this.slots[b]] = [this.slots[b], this.slots[a]];
        this.render();
        return new Result(true, "");
    }
    async addItemById(id, count) {
        let items = await Api.getItems();
        items = await items.message.items;

        let foundElement = false;
        items.plants.forEach(element => {
            if (element.id == id) {
                foundElement = element;
            }
        });
        if (foundElement == false) {
            items.fertilizers.forEach(element => {
                if (element.id == id) {
                    foundElement = element;
                }
            });
        }

        let newbornItem = createItemFromData(foundElement)
        //console.log(id, newbornItem)
        if (this.willFit(newbornItem, count)) {
            return this.addItem(newbornItem, count);
        } else {
            return new Result(false, "Theres not enough space in the inventory")
        }
    }
    render() {
        $("#inventory").children().each((index, element) => {

            const newElement = element.cloneNode(false);
            element.parentNode.replaceChild(newElement, element);
            element = newElement;


            element.setAttribute("index", index)
            //console.log($(this))
            //console.log(this.slots);
            element.setAttribute("hasTooltip", false);
            element.innerHTML = "";

            element.addEventListener("dragover", (e) => {
                e.preventDefault();
                $(element).addClass("hover-target");
            })
            element.addEventListener("dragleave", (e) => {
                e.preventDefault();
                $(element).removeClass("hover-target");
            })
            element.addEventListener("drop", (e) => {
                e.preventDefault();
                $(element).removeClass("hover-target");
                if (e.dataTransfer.getData("type") === "item") {
                    console.log(index, parseInt(e.dataTransfer.getData("index")));
                    this.swapSlots(index, parseInt(e.dataTransfer.getData("index")));
                }
            })
            if (!this.slots[index].isEmpty()) {
                let iconFileName = this.slots[index].item.itemIcon || "placeholder.svg";
                let labelFileName = this.slots[index].item.labelIcon || "placeholder.svg";
                let itemDescription = this.slots[index].item.itemDescription || null;

                element.setAttribute("hasTooltip", true);
                element.setAttribute("item-description", itemDescription);
                element.setAttribute("item-name", this.slots[index].item.name);

                let image = $("<img>").attr("src", "/static/svg/" + iconFileName).addClass("slot-image").attr("draggable", true).attr("index", index);
                $(element).append(image);

                let countDiv = $("<div>").addClass("count").text(this.slots[index].count);
                $(element).append(countDiv);
                if (this.slots[index].item.label) {
                    let label = $("<img>").attr("src", "/static/svg/" + labelFileName).addClass("slot-label")
                    $(element).append(label);
                }

                image[0].addEventListener("dragstart", (e) => {
                    console.log("dragging");
                    e.dataTransfer.setData("index", index.toString());
                    e.dataTransfer.setData("type", "item");
                })
            }
        });
    }
}

export class Game {
    inventory; // class Inventory
    #balance;


    constructor() {
        this.inventory = new Inventory()
        this.#balance = 250;
    }

    #renderBalance() {
        $("#balance").text(this.#balance)
    }

    getBalance() {
        return this.#balance;
    }

    deltaBalance(amount) {
        const newBalance = this.#balance + amount;
        if (newBalance < 0) {
            return new Result(false, "Cannot afford this operation")
        } else {
            this.#balance = newBalance;
            this.#renderBalance();
            return new Result(true, newBalance);
        }
    }

    forceSetBalance(amount) {
        this.#balance = amount;
        this.#renderBalance();
    }
}



export function returnTestItem(name = "default") {
    return new Item({
        name: `Test item "${name}"`,
        id: `test_${name}`,
        itemType: "testing_item",
        buyPrice: 0,
        sellPrice: 0,
        growthTime: 0,
        isSpecial: false,
        itemDescription: "A debug item"
    })
}

