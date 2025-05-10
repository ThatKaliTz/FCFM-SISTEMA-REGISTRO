document.addEventListener("DOMContentLoaded", function () {
    function removeElement(elementRef) {
        const tabElement = document.querySelector(`div[slot="items"][ref="${elementRef}"]`);
        if (tabElement) {
            tabElement.remove();
        }
    }

    // Llama a la función para eliminar elementos con las referencias
    removeElement("Grupos");
    removeElement("AlumnoGrupos");

    // Elimina también los elementos con los ID "Grupos" y "AlumnoGrupos"
    const gruposElement = document.getElementById("Grupos");
    if (gruposElement) {
        gruposElement.remove();
    }

    const alumnoGruposElement = document.getElementById("AlumnoGrupos");
    if (alumnoGruposElement) {
        alumnoGruposElement.remove();
    }
});
