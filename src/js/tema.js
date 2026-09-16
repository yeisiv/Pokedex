const media = window.matchMedia('(prefers-color-scheme: dark)');

function temaEfectivo() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) return 'dark';
    if (html.classList.contains('light')) return 'light';
    return media.matches ? 'dark' : 'light';
}

export function initTema() {
    const btnToggle = document.querySelector('.toggle-tema');
    const html = document.documentElement;
    function actualizarAria() {
        if (temaEfectivo() === 'dark') {
            btnToggle.setAttribute('aria-pressed', 'true');
        } else {
            btnToggle.setAttribute('aria-pressed', 'false');
        }
    }

    actualizarAria();

    function cambiarTema() {
        const nuevoTema = temaEfectivo() === 'dark' ? 'light' : 'dark';
        html.classList.remove('dark', 'light');
        html.classList.add(nuevoTema);
        try {
            localStorage.setItem('tema', nuevoTema);
        } catch (error) {
            // sin almacenamiento disponible. El tema cambia pero no se recuerda.
        }
        
        actualizarAria();
    }

    media.addEventListener('change', actualizarAria);
    btnToggle.addEventListener('click', cambiarTema);

}