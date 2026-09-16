const templateCarta = document.getElementById('card-template');

function crearCarta(pokemon, tiposPoke) {
    let cartaPokemon = templateCarta.content.cloneNode(true);

    let sprite = cartaPokemon.querySelector('.card__sprite');
    let numero = cartaPokemon.querySelector('.card__numero');
    let nombre = cartaPokemon.querySelector('.card__nombre');
    let tipos = cartaPokemon.querySelector('.card__tipos');

    let idParaSprite = pokemon.formaRegional ? pokemon.idSprite : pokemon.numero

    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idParaSprite}.png`;
    sprite.alt = pokemon.nombre;

    numero.textContent = "#" + pokemon.numero;
    nombre.textContent = pokemon.nombre;

    pokemon.tipos.forEach(tipo => {
        let tip = document.createElement('span');
        let colorTip = tiposPoke[tipo.toLowerCase()];

        tip.classList.add('tip', `tip-${tipo.toLowerCase()}`);
        tip.textContent = tipo;

        tip.style.setProperty('--chip-bg-light', colorTip.bgLight);
        tip.style.setProperty('--chip-text-light', colorTip.textLight);
        tip.style.setProperty('--chip-bg-dark', colorTip.bgDark);
        tip.style.setProperty('--chip-text-dark', colorTip.textDark);

        tipos.appendChild(tip);
    });

    return cartaPokemon;
}

const templateRegion = document.getElementById('region-option-template');

function crearRegion(region) {
    let opcionRegion = templateRegion.content.cloneNode(true);

    let input = opcionRegion.querySelector('input');
    let nombre = opcionRegion.querySelector('.region-nombre');

    input.value = region.id;
    nombre.textContent = region.nombre;

    return opcionRegion;
}

const templateTipos = document.getElementById('tipo-option-template');

function crearTipos(nombre, colores) {

    let opcionTipo = templateTipos.content.cloneNode(true);

    let input = opcionTipo.querySelector('input');
    let nombreT = opcionTipo.querySelector('.tipo-nombre');
    let label = opcionTipo.querySelector('.tipo-option');

    input.value = nombre;
    nombreT.textContent = ponerMayusculaPrimeraLetra(nombre);

    label.style.setProperty('--chip-bg-light', colores.bgLight);
    label.style.setProperty('--chip-text-light', colores.textLight);
    label.style.setProperty('--chip-bg-dark', colores.bgDark);
    label.style.setProperty('--chip-text-dark', colores.textDark);

    return opcionTipo;
}

export function ponerMayusculaPrimeraLetra(palabra) {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

export function renderGrid(listaPokemon, tiposPoke) {
    let grid = document.querySelector('.grid');
    let emptyState = document.querySelector('.empty-state');
    let hayResultados = listaPokemon.length > 0;

    grid.innerHTML = '';
    grid.hidden = !hayResultados;
    emptyState.hidden = hayResultados;

    listaPokemon.forEach(pokemon => {
        const carta = crearCarta(pokemon, tiposPoke);
        grid.appendChild(carta);
    });
}

export function panelRegiones(regiones) {
    let panelRegion = document.querySelector('.region-opciones');
    regiones.forEach(region => {
        const area = crearRegion(region);
        panelRegion.appendChild(area);
    })
}

export function panelTipos(tiposPoke) {
    let panelTipo = document.querySelector('.tipo-opciones');
    Object.entries(tiposPoke).forEach(([nombreTipo, colores]) => {
        const opcion = crearTipos(nombreTipo, colores);
        panelTipo.appendChild(opcion);
    })
}