import { initializeApp, inputFilter, showMessage, showYesNoMessage, makeRequest, createModal } from "./utility.js";

initializeApp();

const menu = document.getElementById("menu");

// load
const init = () => {

    menu.onMenuClick = item => {
      
        switch(item) {
            case "logout":
                logout();
                break;        
        }
    }

    $('.btn-export').on('click', function () {

        var btn = $(this);
        var table = $('#' + btn.attr('table'));

        if (table) {
            var csv = table.tableToCSV();
            console.log(csv);
            // console.log(table.tableToCSV());
        }
    });
}

window.addEventListener("load", init, true);

const logout = async () => {

    const res = await makeRequest("logout.php", {});

    if(res.error) {
        showMessage("wrapper", "Error", res.data, true);
    }
    else {

        showMessage("wrapper", "Redirigiendo", "Cerrando sesión...", false);
        setTimeout(() => {
            window.location.replace("index.php");
        }, 1000);
    }
}

export const fillMaterias =  async (item, hasAll) => {
    const nombre = "";
    const response = await makeRequest("materiascontroller.php", 
    { 
        type: "Query", 
        ...{
            nombre,
        }
    });
    if(response.data.length > 0){
        let html = hasAll ? "<option value='T' selected>TODAS</option>" : "";
        response.data.forEach(x => html += `<option value='${x.Id}'>${x.Nombre}</option>`);
        item.innerHTML = html;
    }
}



export const fillUsuariosEncargados =  async (item, hasAll = false) => {
  const response = await makeRequest("alumnoscontroller.php", 
  { 
      type: "QueryUsuariosEncargados"
  });
  if(response.data.length > 0){
     
    
      let html = hasAll ? "<option value='T' selected>TODOS</option>" : "<option value='0'>Seleccione al encargado...</option>";
      response.data.forEach(x => html += `<option value='${x.Id}'>${x.NombreCompleto}</option>`);
      item.innerHTML = html;
  
    }
}