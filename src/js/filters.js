import { renderGrid, ponerMayusculaPrimeraLetra } from "./render.js";

const botonesControl = document.querySelectorAll('.icon-btn');
const todosPaneles = document.querySelectorAll('.panel');

const MAX_TIPOS = 2;

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

export function initFiltros(listaPoke, tiposPoke) {
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
            filtroActivo.busqueda = "";
        }

        aplicarfiltros();
        renderChips();
    });

    btnClean.addEventListener('click', () => {
        searchInput.value = '';
        btnClean.hidden = true;
        searchInput.focus();
        filtroActivo.busqueda = '';
        aplicarfiltros();
        renderChips();
    });

    const filtroTipos = document.querySelector('.tipo-opciones');

    const contadorTipos = document.querySelector('.tipo-contador');

    const avisoTipos = document.querySelector('.tipo-aviso');
    let temporizadorAviso;

    function actualizarContador() {
        contadorTipos.textContent = "Tipos seleccionados: " + filtroActivo.tipos.length + "/" + MAX_TIPOS;
        ocultarAvisoTipos();
    }

    function ocultarAvisoTipos() {
        if (filtroActivo.tipos.length < MAX_TIPOS) {
            clearTimeout(temporizadorAviso);
            avisoTipos.textContent = '';
        }
    }

    filtroTipos.addEventListener('change', (event) => {
        const seleccionados = Array.from(filtroTipos.querySelectorAll('input:checked'));
        if (seleccionados.length > MAX_TIPOS) {
            event.target.checked = false;

            const etiqueta = event.target.closest('.tipo-option');
            etiqueta.classList.add('tipo-rechazado');
            etiqueta.addEventListener('animationend', () => {
                etiqueta.classList.remove('tipo-rechazado');
            }, { once: true });

            clearTimeout(temporizadorAviso);
            avisoTipos.textContent = '';
            temporizadorAviso = setTimeout(() => {
                avisoTipos.textContent = "Máximo " + MAX_TIPOS + " tipos. Quita uno para elegir otro.";
                temporizadorAviso = setTimeout(() => {
                    avisoTipos.textContent = '';
                }, 3000);
            }, 100);
        } else {
            filtroActivo.tipos = (seleccionados.map(input => ponerMayusculaPrimeraLetra(input.value)));

            aplicarfiltros();
            renderChips();
        }

    });

    const regiones = document.querySelector('.region-opciones');

    regiones.addEventListener('change', (event) => {
        const seleccionado = regiones.querySelector('input[name="region"]:checked');

        filtroActivo.region = ponerMayusculaPrimeraLetra(seleccionado.value);

        aplicarfiltros();
        renderChips();
    });

    const filtrosActivos = document.querySelector(".filtros-activos");
    function aplicarfiltros() {
        const hayFiltros = filtroActivo.busqueda.trim() != "" || filtroActivo.region != null || filtroActivo.tipos.length > 0;
        pokemonsFiltrados = listaPoke.filter(pokemon => {
            if (!hayFiltros && pokemon.formaRegional) {
                return false;
            }
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
        renderGrid(pokemonsFiltrados, tiposPoke);
    }

    function renderChips() {
        filtrosActivos.innerHTML = "";
        const template = document.getElementById("filtros-template");
        if (filtroActivo.region !== null) {
            const clon = template.content.cloneNode(true);
            clon.querySelector(".chip-texto").textContent = "Región: " + filtroActivo.region;

            const boton = clon.querySelector('button');
            boton.setAttribute('aria-label', "Quitar filtro de región " + filtroActivo.region);
            boton.addEventListener('click', () => {
                const indice = indiceDelChip(boton);
                regiones.querySelector('input[value="' + filtroActivo.region.toLowerCase() + '"]').checked = false;
                filtroActivo.region = null;
                aplicarfiltros();
                renderChips();
                enfocarTrasBorrar(indice);
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
                    const indice = indiceDelChip(boton);
                    filtroTipos.querySelector('input[value="' + tipo.toLowerCase() + '"]').checked = false;
                    filtroActivo.tipos = filtroActivo.tipos.filter(t => t !== tipo);
                    aplicarfiltros();
                    renderChips();
                    enfocarTrasBorrar(indice);
                });
                filtrosActivos.appendChild(clon);
            });
        }
        if (filtroActivo.busqueda.trim() != "") {
            const clon = template.content.cloneNode(true);
            clon.querySelector(".chip-texto").textContent = "Búsqueda: " + filtroActivo.busqueda;

            const boton = clon.querySelector('button');
            boton.setAttribute('aria-label', "Quitar filtro de búsqueda por: " + filtroActivo.busqueda);
            boton.addEventListener('click', () => {
                const indice = indiceDelChip(boton);
                searchInput.value = "";
                filtroActivo.busqueda = "";
                btnClean.hidden = true;
                aplicarfiltros();
                renderChips();
                enfocarTrasBorrar(indice);
            });
            filtrosActivos.appendChild(clon);
        }
        document.querySelector('.filtros').hidden = filtrosActivos.children.length === 0;
        actualizarContador();
    }

    function enfocarTrasBorrar(indiceBorrado) {
        const botones = filtrosActivos.querySelectorAll('.chip button');
        const destino = Math.min(indiceBorrado, botones.length - 1);

        if (destino >= 0) {
            botones[destino].focus();
        } else {
            botonesControl[0].focus();
        }
    }

    function indiceDelChip(boton) {
        return Array.from(filtrosActivos.querySelectorAll('.chip button')).indexOf(boton);
    }

    filtrosActivos.addEventListener('click', (event) => event.stopPropagation());

    function limpiarFiltros() {
        filtroActivo.busqueda = '';
        filtroActivo.region = null;
        filtroActivo.tipos = [];
        regiones.querySelectorAll('input:checked').forEach(input => input.checked = false);
        filtroTipos.querySelectorAll('input:checked').forEach(input => input.checked = false);
        searchInput.value = '';
        btnClean.hidden = true;
        aplicarfiltros();
        renderChips();
    }

    const botonBorrarFiltros = document.querySelector('.delete-filters');
    botonBorrarFiltros.addEventListener('click', () => {
        limpiarFiltros();
        botonesControl[0].focus();
    });

    aplicarfiltros();
}