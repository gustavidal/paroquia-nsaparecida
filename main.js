// Menu hambúrguer
function toggleMenu() {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('open');
}

// Fecha o menu ao clicar em um link
document.querySelectorAll('#main-nav a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('main-nav').classList.remove('open');
    });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
    const nav = document.getElementById('main-nav');
    const hamburger = document.querySelector('.hamburger');
    if (nav.classList.contains('open') && !nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
    }
});

// Animação de entrada dos cards ao rolar a página
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll(
    '.horario-card, .preview-card, .comunidade-card, .pastoral-card, .evento-card'
).forEach(card => observer.observe(card));
