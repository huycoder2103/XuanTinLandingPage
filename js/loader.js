async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '../' : '';
    
    try {
        const response = await fetch(pathPrefix + file);
        let html = await response.text();
        
        if (isSubPage) {
            html = html.replace(/href="index\.html/g, 'href="../index.html');
            html = html.replace(/href="pages\//g, 'href="');
        }

        element.innerHTML = html;
        
        if (id === 'global-header') {
            window.dispatchEvent(new Event('scroll'));
            initMobileMenu();
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const close = document.getElementById('mobile-menu-close');
    const links = menu ? menu.querySelectorAll('a') : [];

    if (btn && menu && close) {
        btn.onclick = () => menu.classList.remove('translate-x-full');
        close.onclick = () => menu.classList.add('translate-x-full');
        links.forEach(link => {
            link.onclick = () => menu.classList.add('translate-x-full');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('global-header', 'components/header.html');
    loadComponent('global-footer', 'components/footer.html');
});