export class Tooltips {
    tooltipHtml;

    show() {
        this.tooltip.removeClass("tooltip-hidden");
        this.tooltip.addClass("tooltip-visible");
    }

    hide() {
        this.tooltip.removeClass("tooltip-visible");
        this.tooltip.addClass("tooltip-hidden");
    }
    setText(slot) {
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
        this.tooltip.css("display","none");

        document.body.addEventListener("mousemove", (event) => {
            this.tooltip.css("display","block");
            const slot = event.target.closest(".inventory-slot");
            if (!slot || slot.getAttribute("hastooltip") === "false") {
                this.hide();
                return;
            } 
            this.show();
            this.move(event);
            this.setText(slot);
        })
    }
    

}