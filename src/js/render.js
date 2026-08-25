const templateCarta = document.getElementById('card-template');

function crearCarta(pokemon, tiposPoke, tema){
    let cartaPokemon = templateCarta.content.cloneNode(true);
    
    let sprite = cartaPokemon.querySelector('.card__sprite');
    let numero = cartaPokemon.querySelector('.card__numero');
    let nombre = cartaPokemon.querySelector('.card__nombre');
    let tipos = cartaPokemon.querySelector('.card__tipos');

    let idParaSprite = pokemon.formaRegional ? pokemon.idSprite : pokemon.numero

    sprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${idParaSprite}.png`;
    sprite.alt = pokemon.nombre;

    numero.textContent = "#"+ pokemon.numero;
    nombre.textContent = pokemon.nombre;

    pokemon.tipos.forEach(tipo => {
        let tip = document.createElement('span');
        let colorTip = tiposPoke[tipo.toLowerCase()];
        
        tip.classList.add('tip', 'tip-${tipo.toLowerCase()}');
        tip.textContent = tipo;
        tip.style.backgroundColor = tema === 'dark' ? colorTip.bgDark : colorTip.bgLight;
        tip.style.color = tema === 'dark' ? colorTip.textDark : colorTip.textLight;
        tipos.appendChild(tip);        
    });

    return cartaPokemon;
}

const templateRegion = document.getElementById('region-option-template');

function crearRegion(region){
    let opcionRegion = templateRegion.content.cloneNode(true);

    let input = opcionRegion.querySelector('input');
    let nombre = opcionRegion.querySelector('.region-nombre');

    input.value = region.id;
    nombre.textContent = region.nombre;

    return opcionRegion;
}

const templateTipos = document.getElementById('tipo-option-template');

function crearTipos(nombre, colores, tema){

    let opcionTipo = templateTipos.content.cloneNode(true);

    let input = opcionTipo.querySelector('input');
    let nombreT = opcionTipo.querySelector('.tipo-nombre');
    let label = opcionTipo.querySelector('.tipo-option');

    input.value = nombre;
    nombreT.textContent = ponerMayusculaPrimeraLetra(nombre);

    let bg = tema === 'dark' ? colores.bgDark : colores.bgLight;
    let text = tema === 'dark' ? colores.textDark : colores.textLight;

    label.style.setProperty('--chip-bg',bg);
    label.style.setProperty('--chip-text',text);

    return opcionTipo;
}

function ponerMayusculaPrimeraLetra(palabra){
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
}

export function renderGrid(listaPokemon, tiposPoke, tema){
    let grid = document.querySelector('.grid');
    grid.innerHTML='';

    listaPokemon.forEach(pokemon =>{
        const carta = crearCarta(pokemon, tiposPoke, tema);
        grid.appendChild(carta);
    });
}

export function panelRegiones(regiones){
    let panelRegion = document.querySelector('.region-opciones');
    regiones.forEach(region=>{
        const area = crearRegion (region);
        panelRegion.appendChild(area);
    })
}

export function panelTipos(tiposPoke, tema){
    let panelTipo = document.querySelector('.tipo-opciones');
    Object.entries(tiposPoke).forEach(([nombreTipo, colores]) =>{
        const opcion = crearTipos(nombreTipo, colores, tema);
        panelTipo.appendChild(opcion);
    })
}