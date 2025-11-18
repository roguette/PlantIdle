import { Game, returnTestItem } from "./game.js";
import { Api } from "./api.js";
import { InfoModal, NumberModal, YesNoModal } from "./modal.js";
import { Tooltips } from "./tooltips.js";

const inventorySlots = 30 // deleted intentionally or moved elsewhere without appropriate changes
let getBalance = null;
async function loadInventoryHTML(game) {
    for (let i = 0; i < inventorySlots; i++) {
        let newSlot = $("<div>").addClass("inventory-slot").css("animation-delay", `${Math.sqrt(i) / 25}s`)
        $("#inventory").append(newSlot);
    }
    const items = await Api.getItems();

    for (let i = 0; i < await items.message.items.fertilizers.length; i++) {
        let fertilizer = items.message.items.fertilizers[i];
        console.log(fertilizer)

        let newSlot = $("<div>").addClass("fertilizer").css("animation-delay", `${i / 7}s`);
        let img = $("<img>").attr("src", `static/svg/${fertilizer.item_icon || "placeholder.svg"}`).addClass("fertilizer-icon");
        let textDiv = $("<div>").addClass("fertilizer-text");
        let title = $("<h3>").text(fertilizer.name || "Title");
        let hr = $("<hr>");
        let desc = $("<p>").addClass("fertilizer-description").text(fertilizer.description || "Description");
        let actions = $("<div>").addClass("fertilizer-actions");
        let price = $("<div>").addClass("fertilizer-price").text(`$ ${fertilizer.buy_price || "???"}`);
        let button = $("<button>").addClass("button-primary").text("Buy");

        button.click(function () {
            if (game.getBalance() < fertilizer.buy_price) {
                new InfoModal({
                    title: "Too Poor!",
                    message: "You cannot afford this",
                    buttonText: "Ok :("
                })
            } else {
                new NumberModal({
                    title: `Buy ${fertilizer.name}??`,
                    message: "Make sure you are buying the right fertilizer",
                    minAmount: 0,
                    maxAmount: Math.round(game.getBalance() / fertilizer.buy_price),
                    buttonText: "Buy",
                    onValueChosenCallback: async (value) => {
                        if (game.getBalance() >= value * fertilizer.buy_price) {
                            let result = await game.inventory.addItemById(fertilizer.id, value);
                            if (!result.success) {
                                new InfoModal({
                                    title: "Umm",
                                    message: result.message,
                                    buttonText: "Ok."
                                })
                            } else {
                                game.deltaBalance(value * fertilizer.buy_price * -1)

                            }
                        } else {
                            new InfoModal({
                                title: "Too Poor!",
                                message: "You cannot afford this",
                                buttonText: "Ok :("
                            })
                        }
                    }
                })
            }

        })

        actions.append(price, button);
        textDiv.append(title, hr, desc, actions);
        newSlot.append(img, textDiv);

        $("#fertilizers").append(newSlot);

    }

}

async function loadShopHTML() {
    const items = await Api.getItems();

    $("#shop-items").html("");
    console.log(items.message.items)
    items.message.items.plants.forEach((plant, i) => {
        // <div class="shop-item" type="fruit" name="winogrono">1. Owoc - winogrono</div>
        let container = $("<div>").addClass("shop-item").attr("type", plant.item_type).attr("name", plant.id).text(plant.name).css("animation-delay", `${i / 50}s`)
        $("#shop-items").append(container)
    });


}




$(async () => {
    console.log(`DOMContentLoaded`);
    // new InfoModal({
    //     title: "Warning: Bugs ahead",
    //     message: "Lorem Ipsum"
    // });

    // new YesNoModal({
    //     title: "Choose yes or no",
    //     message: "Example question",
    //     closedCallback: (value) => {
    //         new InfoModal({
    //             title: "You made a choice",
    //             message: `You chose ${value}`
    //         })
    //     }
    // })

    // new NumberModal({
    //     title: "Shop",
    //     message: "How much do you want to buy",
    //     minAmount: 0,
    //     maxAmount: 100,
    //     buttonText: "Buy",
    //     onValueChosenCallback: (value) => {
    //         new InfoModal({
    //             title: "You made a choice",
    //             message: `You chose ${value}`
    //         })
    //     }

    // })




    let game = new Game();
    loadInventoryHTML(game);
    game.inventory.addItem(returnTestItem(), 1);
    game.inventory.printItems();
    game.forceSetBalance(2000);
    loadShopHTML(game);
    // setInterval(function(){
    //     game.deltaBalance(100);
    // }, 1000)

    let tooltips = new Tooltips();

    // Changing tabs mechanism
    $("#tabs button").on("click", function (e) {
        const idClicked = '#' + e.target.id;
        const idToShow = idClicked.replace("tab", "card");

        $("#cards").children().css("display", "none");
        $(idToShow).css("display", "flex");

        $("#tabs").children().css("margin-left", "-30px");
        $(idClicked).css("margin-left", "0");
    });

    // Shop filters
    $("#shop-filter-select").on("input", function (e) {
        const clickedElement = e.target;
        //const buttonType = $(clickedEle).attr("button-type");
        const filterValue = $("#shop-filter-select").val()

        if (!filterValue || filterValue === "everything") {
            $("#shop-items").children().hide();
            $("#shop-items").children().show();
        } else {
            // mechanizm ukrywania/pokazania okienek
            $("#shop-items").children().hide();
            $("#shop-items div[type=" + filterValue + "]").show();
        }
    });

    // Shop search
    $("#shop-search").on("input", function (e) {
        const searchInput = this.value.toLowerCase();

        $("#shop-items").children().each(function () {
            $(this).show();
            if (!$(this).attr("name").includes(searchInput)) $(this).hide();
        });
    });

    // Merchant 
    // localStorage.clear();   //DELETE/COMMENT WHEN NOT TESTING
    if (localStorage.getItem("merchantStart") == null) {
        localStorage.setItem("merchantStart", Date.now());
    }
    let merchantStart = localStorage.getItem("merchantStart");
    setInterval(function () {
        const timeDiff = Date.now() - merchantStart;
        const counter = 600 - Math.floor(timeDiff / 1000);
        const minutes = Math.floor(counter / 60);
        const seconds = counter - minutes * 60;
        //console.log(`${minutes}:${seconds <= 9 ? "0" : ""}${seconds}`);

        if (timeDiff >= 600000) { //600000
            localStorage.setItem("merchantStart", Date.now());
            merchantStart = localStorage.getItem("merchantStart");

            //refresh
        }
    }, 1000)
})