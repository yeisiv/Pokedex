import { renderGrid } from "./render.js";

function detectarTema(){
    let prefiereDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefiereDark ? 'dark' : 'light';
}

async function iniciar(){
    let tema = detectarTema();

    let [resPokemons, resTipos] = await Promise.all([
        fetch('./src/data/pokedex_completo.json'),
        fetch('./src/data/tipos.json')
    ]);
    let pokemons = await resPokemons.json();
    let tiposColours = await resTipos.json();
    renderGrid(pokemons, tiposColours, tema);
}

iniciar();