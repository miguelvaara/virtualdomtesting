customElements.define( 'embedded-item', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow( { mode: 'open' } )
            .innerHTML = `
            <link rel="stylesheet" href="styles.css">
            <div class="button-area">
                <button id="repeater">Klikkaa mua!</button>
            </div>
            `             
    }  
} )

customElements.define( 'master-list', class extends HTMLElement {
    constructor() {
        super() 
        this.attachShadow( { mode: 'open' } )
            .innerHTML = `
                <embedded-item id=1 name="eka"></embedded-item>
                <embedded-item id=2 name="toka"></embedded-item>
                <embedded-item id=3 name="kolmas"></embedded-item>` 
        this.shadowRoot.addEventListener( 'click', this )
    }
    handleEvent(event) {
        numberarea.innerHTML = `Painikkeen järjestysnumero on ` + event.target.id;
    }
})