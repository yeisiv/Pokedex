const botonesControl = document.querySelectorAll('.icon-btn');
const todosPaneles = document.querySelectorAll('.panel');

function abrirPanel(btn, panel) {

    if (!panel.hidden) {
        panel.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
        return;
    }

    cerrarPaneles();

    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
}


function cerrarPaneles() {
    todosPaneles.forEach(p => p.hidden = true);
    botonesControl.forEach(b => b.setAttribute('aria-expanded', 'false'));
}

export function initFiltros() {

    botonesControl.forEach(boton => {
        const id = boton.getAttribute('aria-controls');
        const panel = document.getElementById(id);
        boton.addEventListener('click', () => abrirPanel(boton, panel));
    });

    document.addEventListener('click', (event) => {
        const dentroControles = event.target.closest('.controls');

        if (!dentroControles) {
            cerrarPaneles();
        }
    })

    const searchInput = document.getElementById('search-input');
    const btnClean = document.getElementById('btn-limpiar');

    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            btnClean.hidden = false;
        } else {
            btnClean.hidden = true;
        }
    });

    btnClean.addEventListener('click', () => {
        searchInput.value = '';
        btnClean.hidden = true;
        searchInput.focus();
    });

    const filtroTipos = document.querySelector('.tipo-opciones');

    filtroTipos.addEventListener('change', (event) => {
        const seleccionados = filtroTipos.querySelectorAll('input:checked');
        if (seleccionados.length > 2) {
            event.target.checked = false;

        }
    });

}