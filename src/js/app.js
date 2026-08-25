import { renderGrid, panelRegiones, panelTipos } from "./render.js";
import { initFiltros } from "./filters.js";

function detectarTema(){
    let prefiereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefiereDark ? 'dark' : 'light';
}

async function iniciar(){
    let tema = detectarTema();

    let [resPokemons, resTipos, resRegion] = await Promise.all([
        fetch('./src/data/pokedex_completo.json'),
        fetch('./src/data/tipos.json'),
        fetch('./src/data/regiones.json')
    ]);
    let pokemons = await resPokemons.json();
    let tiposColours = await resTipos.json();
    let regiones = await resRegion.json();
    renderGrid(pokemons, tiposColours, tema);

    panelRegiones(regiones);

    panelTipos(tiposColours, tema);

    initFiltros();
}

iniciar();