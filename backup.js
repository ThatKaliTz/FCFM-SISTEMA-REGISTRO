const delay = (milliseconds) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, milliseconds);
});

const isVisible = (item) => {
    while (item.parentNode) {
        if (window.getComputedStyle(item).display == "none")
            return false;
        item = item.parentNode;
    }
    return true;
}

const getClass = (item) => {
    let ret = [];
    if(item){
        const itemClass = item.getAttribute("class");
        if(itemClass){
            const itemClassSplit = itemClass.split(" ");
            if(itemClassSplit && itemClassSplit.length > 0){
                ret = itemClassSplit;
            }
            else{
                ret = [itemClass];
            }
        }
    }
    return ret;
}

const hasClass = (item, itemClass) => getClass(item).findIndex(x => x === itemClass) > -1;

const waveEffect = (item, ev) => {
    const disabled = item.getAttribute("disabled");
    if(disabled) return;
    const rect = item.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const waveWrapper = document.createElement("div");
    waveWrapper.className = "wave-wrapper";
    const waveContainer = document.createElement("div");
    waveContainer.className = "wave-container";
    waveContainer.style.top = `${y}px`;
    waveContainer.style.left = `${x}px`;
    waveWrapper.append(waveContainer);
    item.append(waveWrapper);
    const time = getComputedStyle(document.documentElement).getPropertyValue('--wave-transition');
    const delay = parseFloat(time.replace("s", "")) * 1000;
    setTimeout(() => { waveWrapper.remove() }, delay)
}

const initializeWave = () => {
    document.addEventListener("mousedown", (ev) => {
        const item = hasClass(ev.target, "wave") ? ev.target : ev.target.closest(".wave");
        if(item){
            waveEffect(item, ev);
        }
    });
}

const addWave = (item) => {
    item.addEventListener("mousedown", ev => waveEffect(item, ev))
}

const initializeModals = () => {
    document.addEventListener("click", (ev) => {
        const item = ev.target.hasAttribute("modalref") ? ev.target : ev.target.closest("[modalref]");
        if(item){
            const disabled = item.getAttribute("disabled");
            if(disabled) return;
            const modalref = item.getAttribute("modalref");
            if(modalref){
                const modal = document.getElementById(modalref);
                if(modal && hasClass(modal, "modal-wrapper")){
                    modal.setAttribute("active", true);
                }
            }
        }
    });
    document.addEventListener("click", (ev) => {
        const item = hasClass(ev.target, "close") ? ev.target.closest(".modal-wrapper") : null;
        if(item){
            item.setAttribute("active", false);
        }
    });
}
/// CLASE BASE PARA LOS COMPONENTES
class BaseComponent extends HTMLElement{
    constructor(){
        super();
    }
    getStyle = () => {
        let linksheader = "";
        const links = document.querySelectorAll("link[rel='stylesheet']");
        if(links && links.length > 0){
            links.forEach(link => linksheader += link.outerHTML);
        }
        return linksheader;
    }
}
/// FUNCION QUE REGISTRA EL COMPONENTE TAB
const initializeTab = () => {
    class TabComponent extends BaseComponent{
        constructor(){
            super();
            this.velocity = 2;
            this.direction = 0;
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = this.template();
        }
        template = () => `${this.getStyle()}
            <div class="tab-wrapper">
                <div class="tab-container">
                    <div class="tab-header">
                        <div class="tab-control wave"><span class="icon-keyboard_arrow_left"></span></div>
                        <div class="tab-items">
                            <slot name="items"></slot>
                        </div>
                        <div class="tab-control wave"><span class="icon-keyboard_arrow_right"></span></div>
                    </div>
                    <div class="tab-body">
                        <slot name="tabs"></slot>
                    </div>
                    <div class="tab-footer"></div>
                </div>
            </div>
        `;
        scrollItems = () => {
            if(this.direction != 0){
                this.tabitems.scrollLeft = this.tabitems.scrollLeft + (this.velocity * this.direction);
                setTimeout(() => { this.scrollItems() }, this.velocity);
            }
        }
        scrollToTab = (item) => {
            const limitStart = parseInt(this.tabitems.scrollLeft);
            const limitEnd = parseInt(this.tabitems.scrollLeft) + parseInt(this.tabitems.clientWidth);
            const itemStart = parseInt(item.offsetLeft);
            const itemEnd = parseInt(itemStart) + parseInt(item.clientWidth);
            const width = parseInt(item.clientWidth);
            // console.log(`${limitStart} ${limitEnd} ${itemStart} ${itemEnd} ${itemEnd - limitEnd}`)
            if(itemStart < limitStart){
                this.tabitems.scrollLeft = itemStart
            }
            else if(itemEnd > limitEnd){
                if(this.tabitems.clientWidth <= item.clientWidth){
                    this.tabitems.scrollLeft = itemStart;
                }
                else{
                    const diff = (itemEnd - limitEnd);
                    this.tabitems.scrollLeft = this.tabitems.scrollLeft + (diff < 0 ? 0 : diff);
                }
            }
        }
        closeAll = () => {
            const items = this.tabitems.querySelector("slot[name='items']").assignedNodes();
            items.forEach(it => {
                it.setAttribute("active", false);
            });
            const tabs = this.body.querySelector("slot[name='tabs']").assignedNodes();
            tabs.forEach(tb => {
                tb.setAttribute("active", false);
            });
        }
        getAvailable = () => {
            let available = null;
            const items = this.tabitems.querySelector("slot[name='items']").assignedNodes();
            for(let i = 0; i < items.length; i++){
                const ref = items[i].getAttribute("ref");
                if(ref){
                    const tab = document.getElementById(ref);
                    if(tab){
                        available = items[i];
                        break;
                    }
                }
            }
            return available;
        }
        openTab(item){
            let ref = item.getAttribute("ref");
            if(ref){
                let tab = document.getElementById(ref);
                if(tab){
                    this.closeAll();
                    this.scrollToTab(item);
                    item.setAttribute("active", true);
                    tab.setAttribute("active", true);
                }
                else{
                    const available = this.getAvailable();
                    if(available){
                        this.closeAll();
                        this.scrollToTab(available);
                        available.setAttribute("active", true);
                        ref = available.getAttribute("ref");
                        tab = document.getElementById(ref);
                        tab.setAttribute("active", true);
                    }
                }
            }
        }
        connectedCallback(){
            this.container = this.shadowRoot.querySelector(".tab-container");
            this.header = this.container.querySelector(".tab-header");
            this.body = this.container.querySelector(".tab-body");
            const controls = this.header.querySelectorAll(".tab-control");
            if(controls){
                controls.forEach((control, index) => {
                    addWave(control);
                    control.addEventListener("mousedown", () => {
                        const disabled = control.getAttribute("disabled");
                        if(!disabled){
                            this.direction = index == 0 ? -1 : 1;
                            this.scrollItems();
                        }
                    });
                    control.addEventListener("mouseup", () => {
                        this.direction = 0;
                    });
                });
            }
            this.tabitems = this.header.querySelector(".tab-items");
            const items = this.tabitems.querySelector("slot[name='items']").assignedNodes();
            if(items){
                let opened = null;
                items.forEach(item => {
                    const disabled = item.getAttribute("disabled");
                    const active = item.getAttribute("active");
                    if(!disabled){
                        if(active){
                            opened = item;
                        }
                        item.addEventListener("click", () => {
                            this.openTab(item);
                        });
                    }
                });
                this.openTab(opened ?? items[0]);
            }
        }
    }
    if(!customElements.get("x-tab")){
        customElements.define("x-tab", TabComponent);
    }
}
/// FUNCION QUE REGISTRA EL COMPONENTE MODAL
const initializeModal = () => {
    class ModalComponent extends BaseComponent{
        constructor(){
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = this.template();
        }
        template = () => `${this.getStyle()}
            <div class="modal-wrapper" active="false">
                <div class="modal-container">
                    <div class="modal-header"><slot name="title"></slot><span class="icon-clear close"></span></div>
                    <div class="modal-body">
                        <slot class="main-slot"></slot>
                    </div>
                    <div class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        `;
        connectedCallback(){
            this.modalwrapper = this.shadowRoot.querySelector(".modal-wrapper");
            this.modalcontainer = this.modalwrapper.querySelector(".modal-container");
            this.modalheader = this.modalcontainer.querySelector(".modal-header");
            this.modalbody = this.modalcontainer.querySelector(".modal-body");
            this.modalfooter = this.modalcontainer.querySelector(".modal-footer");
            const close = this.modalheader.querySelector(".close");
            if(close){
                close.addEventListener("click", () => {
                    this.open = false;
                });
            }
            const footeritems = this.modalfooter.querySelector("slot[name='footer']").assignedNodes();
            footeritems.forEach(item => {
                if(hasClass(item, "close")){
                    const disabled = item.getAttribute("disabled");
                    if(!disabled){
                        this.open = false;
                    }
                }
            });
            document.addEventListener("keydown", (ev) => {
                if(ev.keyCode == 9){
                    setTimeout(() => {
                        const items = this.modalbody.querySelector(".main-slot").assignedElements({ flatten: true });
                        console.log(items);
                        const footeritems = this.modalfooter.querySelector("slot[name='footer']").assignedElements();
                        const inside = items.includes(document.activeElement) || footeritems.includes(document.activeElement);
                            if(!inside){
                            for(let i = 0; i < items.length; i++){
                                const item = items[i];
                                const disabled = item.getAttribute("disabled");
                                if(!disabled){
                                    const focusable = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(item.tagName);
                                    if(focusable){
                                        item.focus();
                                        break;
                                    }
                                }
                            }
                        }
                        // const focusableitems = items.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    }, 1);
                }
            });
        }
        get isOpen(){
            this.modalwrapper.getAttribute("active");
        }
        set open(isOpen){
            this.modalwrapper.setAttribute("active", isOpen);
            if(isOpen){
                this.lastFocus = document.activeElement;
            }
            else{
                this.lastFocus && this.lastFocus.focus && this.lastFocus.focus();
            }
        }
    }
    if(!customElements.get("x-modal")){
        customElements.define("x-modal", ModalComponent);
    }
}
/// FUNCION QUE REGISTRA EL COMPONENTE TIMER (ES DE PRUEBA)
const initializeTimer = () => {
    class TimerComponent extends HTMLElement{
        constructor(){
            super();
            this.date = new Date();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = this.template();
        }
        formatNumber = (number) => number < 10 ? `0${number}` : number;
        formatDate = (date) => {
            const year = date.getFullYear();
            const month = this.formatNumber(date.getMonth() + 1);
            const day = this.formatNumber(date.getDate());
            const h = date.getHours();
            const hour = this.formatNumber(h > 12 ? h - 12 : h);
            const minutes = this.formatNumber(date.getMinutes());
            const seconds = this.formatNumber(date.getSeconds());
            const ampm = h > 12 ? "pm" : "am";
            return `${day}/${month}/${year} ${hour}:${minutes}:${seconds} ${ampm}`;
        }
        template = () => `
            <div class="time">${this.formatDate(this.date)}</div>
        `;
        tick = () => {
            this.date = new Date();
            this.shadowRoot.innerHTML = this.template();
            setTimeout(() => {
                this.tick();
            }, 1000);
        }
        connectedCallback(){
            this.shadowRoot.addEventListener("click", () => {
                const time = this.shadowRoot.querySelector(".time");
                if(time){
                    const text = time.innerHTML;
                    const inpt = document.createElement("input");
                    inpt.style.height = 0;
                    inpt.style.position = "fixed";
                    inpt.style.top = -10;
                    inpt.style.left = 0;
                    inpt.value = text;
                    document.body.appendChild(inpt);
                    inpt.select();
                    inpt.setSelectionRange(0, 99999);
                    document.execCommand("copy");
                    inpt.remove();
                }
            });
            this.tick();
        }
    }
    if(!customElements.get("x-timer")){
        customElements.define("x-timer", TimerComponent);
    }
}

const initializeApp = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeTab();
        initializeModal();
        initializeTimer();
        initializeWave();
        initializeModals();
        document.querySelector("body").style.opacity = 1;
    });
}

export { initializeApp, isVisible };