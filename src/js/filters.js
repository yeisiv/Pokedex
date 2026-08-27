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
    const filtroActivo = {region: null, tipos: [], busqueda: ""};
    let pokemonsFiltrados = [];

    function aplicarfiltros(){
        pokemonsFiltrados= listaPoke.filter(pokemon =>{
            let pasaRegion = true;
            let pasaTipo = true;
            let pasaBusqueda = true;
            if(filtroActivo.region != null){
                pasaRegion = pokemon.region === filtroActivo.region;
            }
            if(filtroActivo.tipos.length > 0){
                pasaTipo = filtroActivo.tipos.every(tipo => pokemon.tipos.includes(tipo));
            }
            if(filtroActivo.busqueda.trim() != ""){
                pasaBusqueda = pokemon.nombre.toLowerCase().startsWith(searchInput.value.toLowerCase()) || String(pokemon.numero).startsWith((searchInput.value));
            }
            return pasaBusqueda && pasaRegion && pasaTipo;
        })
        renderGrid(pokemonsFiltrados, tiposPoke, tema);
    }

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
    });

    btnClean.addEventListener('click', () => {
        searchInput.value = '';
        btnClean.hidden = true;
        searchInput.focus();
    });

    const filtroTipos = document.querySelector('.tipo-opciones');
    
    filtroTipos.addEventListener('change', (event) => {
        const seleccionados = Array.from(filtroTipos.querySelectorAll('input:checked'));
        
        if (seleccionados.length > 2) {
            event.target.checked = false;
        }

        filtroActivo.tipos = (seleccionados.map(input => ponerMayusculaPrimeraLetra(input.value)));
        console.log(filtroActivo);

        aplicarfiltros();
    });

    const regiones = document.querySelector('.region-opciones');

    regiones.addEventListener('change', (event) =>{
        const seleccionado = regiones.querySelector('input[name="region"]:checked');

        filtroActivo.region = ponerMayusculaPrimeraLetra(seleccionado.value);

        aplicarfiltros();
    });
}