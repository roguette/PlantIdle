export class Tooltips {
    tooltipHtml;
    showTimeout = null;
    currentSlot = null;

    show() {
        this.tooltip.removeClass("tooltip-hidden");
        this.tooltip.addClass("tooltip-visible");
    }

    hide() {
        this.tooltip.removeClass("tooltip-visible");
        this.tooltip.addClass("tooltip-hidden");
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }

    setText(slot) {
        this.hr.show();
        this.h2.show();
        let name = slot.getAttribute("item-name");
        let description = slot.getAttribute("item-description");

        if (!name) {
            this.hr.hide();
            this.h2.hide()
        }

        this.h2.text(slot.getAttribute("item-name"));
        this.p.text(slot.getAttribute("item-description"));
    }

    move(event) {
        this.tooltip.css("left", `${event.x + 10}px`); 
        this.tooltip.css("top", `${event.y}px`);
    }

    constructor() {
        this.tooltip = $("<div>").addClass("tooltip");
        this.h2 = $("<h2>");
        this.hr = $("<hr>");
        this.p = $("<p>");

        this.tooltip.append(this.h2);
        this.tooltip.append(this.hr);
        this.tooltip.append(this.p);

        $('body').prepend(this.tooltip);
        this.hide();  

        document.body.addEventListener("mousemove", (event) => {
            const slot = event.target.closest(".inventory-slot") || event.target.closest("[hastooltip=true]");
            
            if (!slot || slot.getAttribute("hastooltip") === "false") {
                this.hide();
                this.currentSlot = null;
                return;
            }

            if (slot !== this.currentSlot) {
                this.hide();
                this.currentSlot = slot;

                this.showTimeout = setTimeout(() => {
                    this.show();
                    this.setText(slot);
                }, 250);
            }
            this.move(event);
        });
    }
}