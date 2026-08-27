import { renderGrid, ponerMayusculaPrimeraLetra } from "./render.js";

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

export function initFiltros(listaPoke, tiposPoke, tema) {
    const filtroActivo = { region: null, tipos: [], busqueda: "" };
    let pokemonsFiltrados = [];

    botonesControl.forEach(boton => {
        const id = boton.getAttribute('aria-controls');
        const panel = document.getElementById(id);
        boton.addEventListener('click', () => abrirPanel(boton, panel));
    });

    document.addEventListener('click', (event) => {
        const dentroControles = event.target.closest('.controls');
        const dentroPaneles = event.target.closest('.paneles');

        if (!dentroControles && !dentroPaneles) {
            cerrarPaneles();
        }
    })

    const searchInput = document.getElementById('search-input');
    const btnClean = document.getElementById('btn-limpiar');

    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            btnClean.hidden = false;
            filtroActivo.busqueda = searchInput.value;
        } else {
            btnClean.hidden = true;
        }

        aplicarfiltros();
        renderChips();
    });

    btnClean.addEventListener('click', () => {
        searchInput.value = '';
        btnClean.hidden = true;
        searchInput.focus();
    });

    const filtroTipos = document.querySelector('.tipo-opciones');

    filtroTipos.addEventListener('change', (event) => {
        const seleccionados = Array.from(filtroTipos.querySelectorAll('input:checked'));
        console.log(seleccionados);
        if (seleccionados.length > 2) {
            event.target.checked = false;
        } else {
            filtroActivo.tipos = (seleccionados.map(input => ponerMayusculaPrimeraLetra(input.value)));

            aplicarfiltros();
            renderChips();
        }
        console.log(filtroActivo);

    });

    const regiones = document.querySelector('.region-opciones');

    regiones.addEventListener('change', (event) => {
        const seleccionado = regiones.querySelector('input[name="region"]:checked');

        filtroActivo.region = ponerMayusculaPrimeraLetra(seleccionado.value);

        aplicarfiltros();
        renderChips();
    });

    function aplicarfiltros() {
        pokemonsFiltrados = listaPoke.filter(pokemon => {
            let pasaRegion = true;
            let pasaTipo = true;
            let pasaBusqueda = true;
            if (filtroActivo.region != null) {
                pasaRegion = pokemon.region === filtroActivo.region;
            }
            if (filtroActivo.tipos.length > 0) {
                pasaTipo = filtroActivo.tipos.every(tipo => pokemon.tipos.includes(tipo));
            }
            if (filtroActivo.busqueda.trim() != "") {
                pasaBusqueda = pokemon.nombre.toLowerCase().startsWith(searchInput.value.toLowerCase()) || String(pokemon.numero).startsWith((searchInput.value));
            }
            return pasaBusqueda && pasaRegion && pasaTipo;
        })
        renderGrid(pokemonsFiltrados, tiposPoke, tema);
    }

    function renderChips() {
        const filtrosActivos = document.querySelector(".filtros-activos");
        filtrosActivos.innerHTML = "";
        const template = document.getElementById("filtros-template");
        if (filtroActivo.region !== null) {
            const clon = template.content.cloneNode(true);
            clon.querySelector(".chip-texto").textContent = "Región: " + filtroActivo.region;

            const boton = clon.querySelector('button');
            boton.setAttribute('aria-label', "Quitar filtro de región " + filtroActivo.region);
            boton.addEventListener('click', () => {
                regiones.querySelector('input[value="' + filtroActivo.region.toLowerCase() + '"]').checked = false;
                filtroActivo.region = null;
                aplicarfiltros();
                renderChips();
            });
            filtrosActivos.appendChild(clon);
        }
        if (filtroActivo.tipos.length > 0) {
            filtroActivo.tipos.forEach(tipo => {
                const clon = template.content.cloneNode(true);
                clon.querySelector(".chip-texto").textContent = "Tipo: " + tipo;

                const boton = clon.querySelector('button');
                boton.setAttribute('aria-label', "Quitar filtro de tipo " + tipo);
                boton.addEventListener('click', () => {
                    filtroTipos.querySelector('input[value="' + tipo.toLowerCase() + '"]').checked = false;
                    filtroActivo.tipos = filtroActivo.tipos.filter(t => t !== tipo);
                    aplicarfiltros();
                    renderChips();
                    
                });
                filtrosActivos.appendChild(clon);
            });
        }
        if (filtroActivo.busqueda.trim() != "") {
            const clon = template.content.cloneNode(true);
            clon.querySelector(".chip-texto").textContent = "Búsqueda: " + filtroActivo.busqueda;

            const boton = clon.querySelector('button');
            boton.setAttribute('aria-label', "Quitar filtro de búsqueda por: " + filtroActivo.region);
            boton.addEventListener('click', () => {
                searchInput.value = "";
                filtroActivo.busqueda = "";
                btnClean.hidden = true;
                aplicarfiltros();
                renderChips();
            });
            filtrosActivos.appendChild(clon);
        }
    }
}