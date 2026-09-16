import { panelRegiones, panelTipos } from "./render.js";
import { initFiltros } from "./filters.js";
import { initTema } from "./tema.js";

async function iniciar(){
    initTema();
    let [resPokemons, resTipos, resRegion] = await Promise.all([
        fetch('./src/data/pokedex_completo.json'),
        fetch('./src/data/tipos.json'),
        fetch('./src/data/regiones.json')
    ]);
    let pokemons = await resPokemons.json();
    let tiposColours = await resTipos.json();
    let regiones = await resRegion.json();

    panelRegiones(regiones);

    panelTipos(tiposColours);

    initFiltros(pokemons, tiposColours);
}

iniciar();