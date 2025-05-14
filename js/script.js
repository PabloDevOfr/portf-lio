document.addEventListener('DOMContentLoaded', () => {
    // Menu Mobile
    const mobileButton = document.getElementById('mobile-btn');
    const navMenu = document.getElementById('menu-nav');
    const menuList = document.getElementById('menu-lista');

    if (mobileButton && navMenu && menuList) {
        mobileButton.addEventListener('click', () => {
            navMenu.classList.toggle('aberto');
            const estaAberto = navMenu.classList.contains('aberto');
            mobileButton.setAttribute('aria-expanded', estaAberto);
            if (estaAberto) {
                mobileButton.setAttribute('aria-label', 'Fechar menu');
                document.body.style.overflow = 'hidden'; // Trava scroll do body
            } else {
                mobileButton.setAttribute('aria-label', 'Abrir menu');
                document.body.style.overflow = ''; // Libera scroll
            }
        });

        menuList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('aberto')) {
                    navMenu.classList.remove('aberto');
                    mobileButton.setAttribute('aria-expanded', 'false');
                    mobileButton.setAttribute('aria-label', 'Abrir menu');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // Atualizar ano no rodapé
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Marcar link ativo no menu de navegação ao rolar
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.cabecalho__menu__lista a');

    function activateMenuAtCurrentSection() {
        let index = sections.length;

        while(--index && window.scrollY + 100 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove('ativo'));
        if (navLinks[index]) {
            navLinks[index].classList.add('ativo');
        }
    }
    if (sections.length > 0 && navLinks.length > 0) { // Executar só se houver seções e links
        activateMenuAtCurrentSection();
        window.addEventListener('scroll', activateMenuAtCurrentSection);
    }


    // Animação ao Scroll (elementos surgindo)
    const targetElements = document.querySelectorAll('[data-anime]');
    const animationClass = 'animar';

    function animeScroll() {
        const windowTop = window.pageYOffset + ((window.innerHeight * 3) / 4);
        targetElements.forEach(function(element) {
            if((windowTop) > element.offsetTop) {
                element.classList.add(animationClass);
            } else {
                // element.classList.remove(animationClass); // Para re-animar se rolar para cima (opcional)
            }
        });
    }

    if(targetElements.length) {
        window.addEventListener('scroll', debounce(function() {
            animeScroll();
        }, 50)); // Diminuir o tempo de debounce para responsividade da animação
        animeScroll(); // Executa uma vez ao carregar
    }

    // Função Debounce
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Esconder/mostrar cabeçalho ao rolar
    let lastScrollTop = 0;
    const header = document.querySelector('.cabecalho');
    if (header) {
        const headerHeight = header.offsetHeight;
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > headerHeight * 2) {
                header.style.top = `-${headerHeight}px`;
            } else {
                header.style.top = '0';
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }, false);
    }


    // Efeito Matrix Background
    const matrixBackground = document.getElementById('matrixBackground');
    if (matrixBackground && window.innerWidth > 768) {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ";
        const fontSize = 14;
        const columns = Math.floor(window.innerWidth / fontSize);
        const streamLengthBase = 15; // Comprimento base da stream
        const streamLengthVariance = 10; // Variação no comprimento

        function createColumn() {
            const column = document.createElement('div');
            column.className = 'matrix-column';
            
            const leftPosition = Math.floor(Math.random() * columns) * fontSize;
            column.style.left = `${leftPosition}px`;
            
            column.style.top = `-${Math.random() * window.innerHeight * 0.5}px`; 

            const currentStreamLength = streamLengthBase + Math.floor(Math.random() * streamLengthVariance);
            let textContent = '';
            for (let i = 0; i < currentStreamLength; i++) {
                textContent += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            column.innerHTML = `<span>${textContent.charAt(0)}</span>` + textContent.substring(1);

            const fallDuration = (Math.random() * 5) + 5; 
            column.style.animationDuration = `1s, ${fallDuration}s`; 
            column.style.animationDelay = `${Math.random() * 1}s`; 

            matrixBackground.appendChild(column);

            column.addEventListener('animationend', (e) => {
                if (e.animationName === 'fall') {
                    column.remove(); 
                    createColumn(); 
                }
            });
        }
        
        const initialColumnsToCreate = Math.floor(columns / 4); 
        for (let i = 0; i < initialColumnsToCreate; i++) {
            setTimeout(createColumn, Math.random() * 2000); 
        }
    }
});
