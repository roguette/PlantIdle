import { Inventory, returnTestItem, inventorySlots } from "./game.js";
import { Api, lastItemData } from "./api.js";

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

    for (let i = 0; i < inventorySlots; i++) {
        let newSlot = $("<div>").addClass("kafelek").css("animation-delay",`${Math.sqrt(i)/25}s`)
        $("#inventory").append(newSlot);
    }

    for (let i = 0; i < lastItemData.items.fertilizers.length; i++) {
        let newSlot = $("<div>").addClass("fart").css("animation-delay",`${i/7}s`)
        $("#fertilizers").append(newSlot);
    }




    // Changing tabs mechanism
    $("#tabs button").on("click", function(e){
        const idClicked = '#' + e.target.id;
        const idToShow = idClicked.replace("tab", "card");
        
        $("#cards").children().css("display", "none");
        $(idToShow).css("display", "flex");

        $("#tabs").children().css("margin-left", "-30px");
        $(idClicked).css("margin-left", "0");
    })
})