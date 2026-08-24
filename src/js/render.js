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

export function renderGrid(listaPokemon, tiposPoke, tema){
    let grid = document.querySelector('.grid');
    grid.innerHTML='';

    listaPokemon.forEach(pokemon =>{
        const carta = crearCarta(pokemon, tiposPoke, tema);
        grid.appendChild(carta);
    });
}