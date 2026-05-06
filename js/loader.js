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
        
        // Cực kỳ quan trọng: Khởi tạo lại Menu sau khi Header đã được chèn vào DOM
        if (id === 'global-header') {
            initMobileMenu();
            window.dispatchEvent(new Event('scroll'));
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if (!btn || !menu) return;

    // Gỡ bỏ sự kiện cũ nếu có để tránh lặp
    btn.onclick = null;

    btn.onclick = (e) => {
        e.stopPropagation();
        const isHidden = menu.classList.contains('hidden');
        if (isHidden) {
            menu.classList.remove('hidden');
            // Force reflow
            menu.offsetHeight;
            menu.classList.remove('scale-95', 'opacity-0');
            menu.classList.add('scale-100', 'opacity-100');
        } else {
            hideMenu();
        }
    };

    const hideMenu = () => {
        menu.classList.remove('scale-100', 'opacity-100');
        menu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            menu.classList.add('hidden');
        }, 200);
    };

    // Đóng khi click ngoài
    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            if (!menu.classList.contains('hidden')) hideMenu();
        }
    });

    // Đóng khi click vào link
    menu.querySelectorAll('a').forEach(link => {
        link.onclick = () => hideMenu();
    });
}

// Chạy load ngay lập tức
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('global-header', 'components/header.html');
    loadComponent('global-footer', 'components/footer.html');
});