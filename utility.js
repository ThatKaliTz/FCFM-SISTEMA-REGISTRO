const delay = (milliseconds) => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, milliseconds);
});
///Verifica si un elemento es visible en la pantalla
const isVisible = (item) => {
    while (item.parentNode) {
        const type = item.getAttribute("type");
        if ((type && type == "hidden") || window.getComputedStyle(item).display == "none")
            return false;
        item = item.parentNode;
    }
    return true;
}
///Obtiene las clases de un elemento
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
///Verifica si un elemento contiene cierta clase
const hasClass = (item, itemClass) => getClass(item).findIndex(x => x === itemClass) > -1;
///Genera un efecto al dar click
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
///Genera un efecto al dar click sobre los elementos que contengan la clase wave
const initializeWave = () => {
    document.addEventListener("mousedown", (ev) => {
        const item = hasClass(ev.target, "wave") ? ev.target : ev.target.closest(".wave");
        if(item){
            waveEffect(item, ev);
        }
    });
}
///Agrega un efecto a un elemento
const addWave = (item) => {
    item.addEventListener("click", ev => waveEffect(item, ev))
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
    getAutoFocusable = () => this.querySelector("[autofocus]");
    getVisibleFocusable = () => {
        let visiblefocusable = null;
        const focusables = this.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if(focusables && focusables.length > 0){
            for(let i = 0; i < focusables.length; i++){
                const focusable = focusables[i];
                if(isVisible(focusable)){
                    visiblefocusable = focusable;
                    break;
                }
            }
        }
        return visiblefocusable;
    }
}
/// FUNCION QUE REGISTRA EL COMPONENTE MENU
const initializeMenu = () => {
    class MenuComponent extends BaseComponent{
        constructor(){
            super();
            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.innerHTML = this.template();
        }
        template = () => `${this.getStyle()}
            <div class="menu-container">
                <div class="menu-header">
                    <slot name="header"></slot>
                </div>
                <div class="menu-body">
                    <slot></slot>
                </div>
                <div class="menu-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        `;
        closeGroup = (group) => {
            document.addEventListener("click", (ev) => {
                const cls = group.getAttribute("class");
                if(ev.target != group && ev.target.closest(cls) != group && !group.contains(ev.target))
                    group.setAttribute("active", "false");
            });
        }
        openGroup = (group) => {
            const attr = group.getAttribute("active") == "true" ? "false" : "true";
            group.setAttribute("active", attr);
        }
        setGroupInteraction = (item) => {
            if(hasClass(item, "menu-group")){
                const it = item.querySelector(".menu-title");
                if(it){
                    const caret = document.createElement("span");
                    caret.className = "icon-keyboard_arrow_right";
                    it.appendChild(caret);
                    it.addEventListener("click", () => {
                        const disabled = it.getAttribute("disabled");
                        if(!disabled){
                            this.openGroup(item);
                        }
                    });
                    this.closeGroup(item);
                }
            }
            if(hasClass(item, "menu-option")){
                item.addEventListener("click", () => {
                    this.onMenuClick(item.getAttribute("id"));
                });
            }
            const groups = [...item.children];
            if(groups){
                groups.forEach(grp => this.setGroupInteraction(grp));
            }
        }
        connectedCallback(){
            this.container = this.shadowRoot.querySelector(".menu-container");
            this.header = this.container.querySelector(".menu-header");
            this.body = this.container.querySelector(".menu-body");
            this.footer = this.container.querySelector(".menu-footer");
            const items = this.body.querySelector("slot").assignedElements();
            if(items){
                items.forEach(item => this.setGroupInteraction(item));
            }
            const toggleMenu = document.getElementById("toggle-menu");
            if(toggleMenu){
                toggleMenu.addEventListener("click", () => {
                    const attr = this.getAttribute("active") == "true" ? "false" : "true";
                    this.setAttribute("active", attr);
                });
                document.addEventListener("click", (ev) => {
                    if(ev.target != this && ev.target != toggleMenu && ev.target.closest("x-menu") != this && !this.contains(ev.target))
                        this.setAttribute("active", "false");
                });
            }
        }
    }
    if(!customElements.get("x-menu")){
        customElements.define("x-menu", MenuComponent);
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
            const items = this.tabitems.querySelector("slot[name='items']").assignedElements();
            items.forEach(it => {
                it.setAttribute("active", false);
            });
            const tabs = this.body.querySelector("slot[name='tabs']").assignedElements();
            tabs.forEach(tb => {
                tb.setAttribute("active", false);
            });
        }
        getAvailable = () => {
            let available = null;
            const items = this.tabitems.querySelector("slot[name='items']").assignedElements();
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
        openItem = (item) => {
            this.closeAll();
            this.scrollToTab(item);
            const ref = item.getAttribute("ref");
            const tab = document.getElementById(ref);
            item.setAttribute("active", true);
            tab.setAttribute("active", true);
            const autofocusable = this.getAutoFocusable();
            if(autofocusable){
                autofocusable.focus();
            }
        }
        openTab = (item) => {
            let ref = item.getAttribute("ref");
            if(ref){
                let tab = document.getElementById(ref);
                if(tab){
                    this.openItem(item);
                }
                else{
                    const available = this.getAvailable();
                    if(available){
                        this.openItem(available);
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
            const items = this.tabitems.querySelector("slot[name='items']").assignedElements();
            if(items){
                let opened = null;
                items.forEach(item => {
                    const active = item.getAttribute("active");
                    if(active){
                        opened = item;
                    }
                    item.addEventListener("click", () => {
                        const disabled = item.getAttribute("disabled");
                        const active = item.getAttribute("active");
                        if(!disabled){
                            if(active == "false"){
                                this.openTab(item);
                            }
                        }
                    });
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
            <div class="modal-container">
                <div class="modal-header"><slot name="title"></slot>${this.canClose() ? `<span class="icon-clear text-danger close"></span>` : ""}</div>
                <div class="modal-body">
                    <slot class="main-slot"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        `;
        connectedCallback(){
            this.shadowRoot.innerHTML = this.template();
            this.modalcontainer = this.shadowRoot.querySelector(".modal-container");
            this.modalheader = this.modalcontainer.querySelector(".modal-header");
            this.modalbody = this.modalcontainer.querySelector(".modal-body");
            this.modalfooter = this.modalcontainer.querySelector(".modal-footer");
            const close = this.modalheader.querySelector(".close");
            if(close){
                close.addEventListener("click", () => {
                    this.open = false;
                });
            }
            if(this.canClose()){
                const footeritems = this.modalfooter.querySelector("slot[name='footer']").assignedElements();
                footeritems.forEach(item => {
                    if(hasClass(item, "close")){
                        item.addEventListener("click", () => {
                            const disabled = item.getAttribute("disabled");
                            if(!disabled){
                                this.open = false;
                            }
                        });
                    }
                });
            }
            document.addEventListener("keydown", (ev) => {
                if(ev.keyCode == 9 && this.isOpen() && isVisible(this)){
                    setTimeout(() => {
                        const items = this.modalbody.querySelector(".main-slot").assignedElements({ flatten: true });
                        const inside = document.activeElement.closest("X-MODAL") == this;
                        if(!inside){
                            const focusable = this.getVisibleFocusable();
                            if(focusable){
                                focusable.focus();
                            }
                        }
                    }, 1);
                }
            });
        }
        canClose = () => this.getAttribute("canclose") == true || this.getAttribute("canclose") == "true";
        isOpen = () => this.getAttribute("active") == true || this.getAttribute("active") == "true";
        set open(statusOpen){
            this.setAttribute("active", statusOpen);
            if(statusOpen){
                this.lastFocus = document.activeElement;
                const autofocusable = this.getAutoFocusable();
                if(autofocusable){
                    autofocusable.focus();
                }
            }
            else{
                this.lastFocus && this.lastFocus.focus && this.lastFocus.focus();
                if(this.onClose){
                    this.onClose();
                }
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
        initializeMenu();
        initializeTab();
        initializeModal();
        initializeTimer();
        initializeWave();
        document.querySelector("body").style.opacity = 1;
    });
}

const createModal = (ref, title, message, size, canclose) => {
    const container = document.getElementById(ref);
    if(container){
        const modal = document.createElement("x-modal");
        modal.setAttribute("size", size);
        modal.setAttribute("canclose", canclose);
        const header = document.createElement("h3");
        header.innerText = title.trim();
        header.setAttribute("slot", "title");
        const body = document.createElement("div");
        body.className = "padder";
        if(Array.isArray(message)){
            let html = "<ul>";
            message.forEach(msg => html += `<li>${msg}</li>`);
            html += "</ul>";
            body.innerHTML = html;
        }
        else{
            body.innerText = message;
        }
        const footer = document.createElement("button");
        footer.setAttribute("class", "close");
        footer.setAttribute("autofocus", "");
        footer.setAttribute("slot", "footer");
        footer.innerText = "Cerrar";
        modal.append(header);
        modal.append(body);
        if(canclose){
            modal.append(footer);
        }
        else{
            const focusable = document.createElement("div");
            focusable.setAttribute("tabindex", 999999);
            focusable.setAttribute("autofocus", "");
            body.append(focusable);
        }
        container.appendChild(modal);
        return modal;
    }
    return null;
}

const showMessage = (ref, title, message, canclose, size = "sm") => new Promise((resolve, reject) => {
    const modal = createModal(ref, title, message, size, canclose);
    if(modal){
        modal.onClose = () => {
            modal.remove();
            resolve();
        }
        setTimeout(() => {
            modal.open = true;
        }, 1);
    }
    else{
        resolve();
    }
});

const showYesNoMessage = (ref, title, message, size) => new Promise((resolve, reject) => {
    const container = document.getElementById(ref);
    let response = false;
    if(container){
        const modal = document.createElement("x-modal");
        modal.setAttribute("size", size);
        modal.setAttribute("canclose", true);
        const header = document.createElement("h3");
        header.innerText = title.trim();
        header.setAttribute("slot", "title");
        const body = document.createElement("div");
        body.className = "padder";
        if(Array.isArray(message)){
            let html = "<ul>";
            message.forEach(msg => html += `<li>${msg}</li>`);
            html += "</ul>";
            body.innerHTML = html;
        }
        else{
            body.innerText = message;
        }
        const yes = document.createElement("button");
        yes.setAttribute("slot", "footer");
        yes.innerText = "Si";
        const no = document.createElement("button");
        no.className = "close";
        no.setAttribute("autofocus", "");
        no.setAttribute("slot", "footer");
        no.innerText = "No";
        modal.append(header);
        modal.append(body);
        modal.append(yes);
        modal.append(no);
        container.appendChild(modal);
        setTimeout(() => {
            modal.open = true;
        }, 10);
        yes.addEventListener("click", () => {
            response = true;
            modal.open = false;
        })
        modal.onClose = () => {
            modal.remove();
            resolve(response);
        }
    }
    else{
        resolve(response);
    }
});

const makeRequest = (url, obj) => new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange=function() {
        if (xhr.readyState == 4) {
            resolve(JSON.parse(xhr.responseText || null));
        }
    }
    xhr.send("data=" + JSON.stringify(obj));
});

const inputFilter = (input, filter) => {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
        input.addEventListener(event, function() {
            if (filter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});
const getFiles = async (input) => {
    if (!input.files || input.files.length == 0) return null;
    const files = [];
    for (let i = 0; i < input.files.length; i++) {
        files.push(input.files[i]);
    }
    return files;
}
const loadFile = (multi, accept) => new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.style.position = 'absolute';
    input.style.top = "0";
    input.style.left = "0";
    input.style.width = "0";
    input.style.height = "0";
    input.style.display = "none";
    input.multiple = multi || false;
    input.accept = accept || "";
    document.body.appendChild(input);
    input.onchange = async (ev) => {
        const files = await getFiles(input);
        const ret = files && (multi ? files : files[0]);
        document.body.removeChild(input);
        resolve(ret);
    };
    let checkCancel = true;
    function onBodyFocus(ev) {
        if (!checkCancel)
            return;
        checkCancel = false;
        document.body.removeEventListener("focusin", onBodyFocus, true);
        document.body.removeEventListener("click", onBodyFocus, true);
        document.body.removeEventListener("keydown", onBodyFocus, true);
        document.body.removeEventListener("mousemove", onBodyFocus, true);
        setTimeout(() => {
            if (!input.value) {
                resolve(null);
            }
        }, 500);
    }
    function onInitBodyFocus() {
        window.removeEventListener("blur", onInitBodyFocus, true);
        document.body.addEventListener("focusin", onBodyFocus, true);
        document.body.addEventListener("click", onBodyFocus, true);
        document.body.addEventListener("keydown", onBodyFocus, true);
        document.body.addEventListener("mousemove", onBodyFocus, true);
    }
    window.addEventListener("blur", onInitBodyFocus, true);
    input.focus();
    input.click();
});

const showFormatMessage = (ref, size) => new Promise((resolve, reject) => {
    const container = document.getElementById(ref);
    let response = 0;
    if(container){
        let title="Formato Nombres"
        const modal = document.createElement("x-modal");
        modal.setAttribute("size", size);
        modal.setAttribute("canclose", true);
        const header = document.createElement("h3");
        header.innerText = title.trim();
        header.setAttribute("slot", "title");
        const body = document.createElement("div");
        body.className = "padder";

        let message = "Elija el formato que llevan los nombres en el archivo:";
        body.innerText = message;
        
        const yes = document.createElement("button");
        yes.setAttribute("slot", "footer");
        yes.innerText = "Apellidos Nombre";
        const no = document.createElement("button");
        no.setAttribute("autofocus", "");
        no.setAttribute("slot", "footer");
        no.innerText = "Nombre Apellidos";
        modal.append(header);
        modal.append(body);
        modal.append(yes);
        modal.append(no);
        container.appendChild(modal);
        setTimeout(() => {
            modal.open = true;
        }, 10);
        yes.addEventListener("click", () => {
            response = 1;
            modal.open = false;
        })
        no.addEventListener("click", () => {
            response = 2;
            modal.open = false;
        })
        modal.onClose = () => {
            modal.remove();
            resolve(response);
        }
    }
    else{
        resolve(response);
    }
});

export { initializeApp, inputFilter, isVisible, createModal, showMessage, showYesNoMessage, makeRequest, loadFile, toBase64, showFormatMessage };