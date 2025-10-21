import { Inventory, returnTestItem } from "./game.js";
import { Api } from "./api.js";

let inv = new Inventory();
inv.addItem(returnTestItem("A"), 76*29);
inv.printItems();
inv.addItem(returnTestItem("A"), 99);
inv.printItems();
inv.addItem(returnTestItem("B"), 399);
inv.printItems();
inv.addItem(returnTestItem("B"), 99);
inv.printItems();



$(async ()=>{
    console.log(`DOMContentLoaded`);
    console.log(await Api.getItems());
})