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
            let closeButton = $("<span>").addClass("material-symbols-outlined").text("close"); 
            closeButton.on("click", () => this.closeModal()); // Add event listener to close the modal
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


        let closeBtn = $("<button>").addClass("modal-button button-primary").text(this.buttonText);
        console.log(this.buttonContainer)
        this.buttonContainer.append(closeBtn);

        closeBtn.on("click", () => {
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

    constructor({title, message, canCancel = true, minAmount = 0, maxAmount, buttonText, onValueChosenCallback}) {
        super(title, message, canCancel);
        this.minAmount = minAmount;
        this.maxAmount = maxAmount;
        this.buttonText = buttonText;
        this.onValueChosenCallback = onValueChosenCallback;
    }
}
