/*
* Base modal with no buttons
*/
class Modal {
    #modal;
    title; 
    message;
    canCancel;
    buttonContainer;

    constructor(title, message, canCancel) {
        this.title = title;
        this.message = message;
        this.canCancel = canCancel;

        let container = $("<div>").addClass("modal-container"); // <div class="modal-container">
        let modal = $("<div>").addClass("modal-box"); // <div class="modal-box"></div>
        container.append(modal);
        
        this.#modal = container;

        let modalInfo = $("<div>").addClass("modal-info"); // <div class="modal-info">
        let textContainer = $("<div>").addClass("modal-text-container"); // <div class="modal-text-container">
        textContainer.append($("<h1>").text(this.title)); // <h1>Sample Text</h1>
        textContainer.append($("<p>").addClass("modal-subtitle").text(this.message)); // <p class="modal-subtitle">...</p>
        modalInfo.append(textContainer);

        if (this.canCancel) {
            let closeButton = $("<span>").addClass("material-symbols-outlined").text("close").css("margin-left","auto"); 
            closeButton.on("click", () => this.closeModal());
            modalInfo.append(closeButton);
        }

        modal.append(modalInfo);
        modal.append($("<div>").addClass("modal-buttons")); // <div class="modal-buttons"></div>
        this.buttonContainer = modal.find(".modal-buttons");
        $("body").append(container); // append to body
    }

    closeModal() {
        this.#modal.remove();
    }
}

/*
* Modal used for information with one primary button
*/
export class InfoModal extends Modal {
    buttonText;

    closedCallback;

    constructor({title, message, canCancel = true, buttonText = "Got it", closedCallback}) {
        super(title, message, canCancel);
        this.buttonText = buttonText;
        this.closedCallback = closedCallback;


        let closeButton = $("<button>").addClass("modal-button button-primary").text(this.buttonText);
        this.buttonContainer.append(closeButton);

        closeButton.on("click", () => {
            this.closeModal();
            if (this.closedCallback) {
                this.closedCallback();
            }
        });
    }

}

/*
* Modal used for yes/no or a/b choices
*/
export class YesNoModal extends Modal {
    suggestedText;
    neutralText;

    closedCallback;

    constructor({title, message, canCancel = true, suggestedText = "Yes", neutralText = "No", closedCallback}) {
        super(title, message, canCancel);
        this.suggestedText = suggestedText;
        this.neutralText = neutralText;
        this.closedCallback = closedCallback;

        let neutralButton = $("<button>").addClass("modal-button button-neutral").text(this.neutralText);
        this.buttonContainer.append(neutralButton);

        neutralButton.on("click", () => {
            this.closeModal();
            if (this.closedCallback) {
                this.closedCallback(this.neutralText);
            }
        });

        let suggestedButton = $("<button>").addClass("modal-button button-primary").text(this.suggestedText);
        this.buttonContainer.append(suggestedButton);

        suggestedButton.on("click", () => {
            this.closeModal();
            if (this.closedCallback) {
                this.closedCallback(this.suggestedText);
            }
        });



    }
}

/*
* Modal used for choosing numbers, for example in a show when asked how much of something the user wants to buy
*/
export class NumberModal extends Modal {
    minAmount;
    maxAmount;
    buttonText;

    onValueChosenCallback;

    constructor({title, message, canCancel = true, minAmount = 0, maxAmount = 100, buttonText, onValueChosenCallback}) {
        super(title, message, canCancel);
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.buttonText = buttonText;
        this.onValueChosenCallback = onValueChosenCallback;

        let minButton = $("<button>").addClass("modal-button button-neutral")
            .append($("<span>").addClass("material-symbols-outlined").text("keyboard_double_arrow_left"));
        this.buttonContainer.append(minButton);

        let decrementButton = $("<button>").addClass("modal-button button-neutral")
            .append($("<span>").addClass("material-symbols-outlined").text("keyboard_arrow_left"));
        this.buttonContainer.append(decrementButton);

        let editableDiv = $("<div>").attr("contenteditable", "true").addClass("force-input").text("0");
        this.buttonContainer.append(editableDiv);

        let incrementButton = $("<button>").addClass("modal-button button-neutral")
            .append($("<span>").addClass("material-symbols-outlined").text("keyboard_arrow_right"));
        this.buttonContainer.append(incrementButton);

        let maxButton = $("<button>").addClass("modal-button button-neutral")
            .append($("<span>").addClass("material-symbols-outlined").text("keyboard_double_arrow_right"));
        this.buttonContainer.append(maxButton);

        let suggestedButton = $("<button>").addClass("modal-button button-primary").text(this.buttonText);
        this.buttonContainer.append(suggestedButton);

        // actual logic

        let current = 0;

        function renderInput() {
            if (current < minAmount) current = minAmount;
            if (current > maxAmount) current = maxAmount;

            editableDiv.text(current)
        }
        editableDiv.on("input", () => {
            let rawText = editableDiv.text(); 
            let contentWithNumbers = rawText.replace(/[^0-9]/g, "");

            current = parseInt(contentWithNumbers);
            renderInput();
        })

        minButton.on("click", ()=>{
            current = this.minAmount;
            renderInput();
        })

        decrementButton.on("click", ()=>{
            current--;
            renderInput();
        })

        incrementButton.on("click", ()=>{
            current++;
            renderInput();
        })

        maxButton.on("click", ()=>{
            current = this.maxAmount;
            renderInput();
        })


        suggestedButton.on("click", () => {
            this.closeModal();
            if (this.onValueChosenCallback) {
                this.onValueChosenCallback(current);
            }
        });

    }
}
