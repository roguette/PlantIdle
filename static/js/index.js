import { Inventory, returnTestItem } from "./game.js";
import { Api } from "./api.js";

let inv = new Inventory();
inv.addItem(returnTestItem(), 100);
inv.printItems();



$(async ()=>{
    console.log(`DOMContentLoaded`);
    console.log(await Api.getItems());
})