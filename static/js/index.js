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

    // Changing tabs 
    $("#tabs button").on("click", function(e){
        const idClicked = '#' + e.target.id;
        const idToShow = idClicked.replace("tab", "card");
        
        $("#cards").children().css("display", "none");
        $(idToShow).css("display", "flex");

        $("#tabs").children().css("margin-left", "-30px");
        $(idClicked).css("margin-left", "0");
    });

    // Shop filters
    $("#shop-filters button").on("click", function(e){
        const clickedEle = e.target;
        const buttonType = $(clickedEle).attr("button-type");

        if($(clickedEle).hasClass("chosen-filter")) {
            $(clickedEle).removeClass("chosen-filter");

            // mechanizm ukrywania/pokazania okienek
            $("#shop-items").children().show();
        } else {
            $("#shop-filters").children().removeClass("chosen-filter");
            $(clickedEle).addClass("chosen-filter");

            // mechanizm ukrywania/pokazania okienek
            $("#shop-items").children().hide();
            $("div[type=" + buttonType +"]").show();
        }
    });

    // Shop search
    $("#shop-search").on("input", function(e){
        const searchInput = this.value.toLowerCase();
        
        $("#shop-items").children().each(function() {
            $(this).show();
            if(!$(this).attr("name").includes(searchInput)) $(this).hide();
        });
    });
})