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
            initNavTracking();
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

function initNavTracking() {
    const btn = document.getElementById('nav-track-btn');
    const dropdown = document.getElementById('nav-track-dropdown');
    const form = document.getElementById('nav-track-form');
    const input = document.getElementById('nav-track-input');
    const errBox = document.getElementById('nav-track-error');
    if (!btn || !dropdown || !form || !input) return;

    const errMsg = errBox ? errBox.querySelector('span') : null;
    const showError = (msg) => { if (errMsg) { errMsg.textContent = msg; errBox.classList.remove('hidden'); } };
    const clearError = () => { if (errBox) errBox.classList.add('hidden'); };

    const showDropdown = () => {
        dropdown.classList.remove('hidden');
        dropdown.offsetHeight;
        dropdown.classList.remove('opacity-0', '-translate-y-2');
        dropdown.classList.add('opacity-100', 'translate-y-0');
        input.focus();
    };
    const hideDropdown = () => {
        dropdown.classList.remove('opacity-100', 'translate-y-0');
        dropdown.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => dropdown.classList.add('hidden'), 200);
        clearError();
    };

    btn.onclick = (e) => {
        e.stopPropagation();
        dropdown.classList.contains('hidden') ? showDropdown() : hideDropdown();
    };

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !btn.contains(e.target) && !dropdown.classList.contains('hidden')) {
            hideDropdown();
        }
    });

    input.addEventListener('input', clearError);

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const raw = (input.value || '').trim();
        if (!raw) { showError('Vui lòng nhập mã đơn.'); return; }
        const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
        const digits = cleaned.replace(/^ORD/, '');
        if (!/^\d+$/.test(digits)) { showError('Mã đơn không hợp lệ. Định dạng đúng: ORD-000012.'); return; }
        clearError();
        window.open('https://deliverysystem.cloud/Order/Tracking/ORD-' + digits, '_blank', 'noopener');
        hideDropdown();
        input.value = '';
    });
}

// Chạy load ngay lập tức
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('global-header', 'components/header.html');
    loadComponent('global-footer', 'components/footer.html');
});