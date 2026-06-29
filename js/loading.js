// ╔════════════════════════════════════════════════════════════╗
// ║  LOADING DELAY (ms) — chỉnh số này để web load nhanh/chậm  ║
// ║  2000 = 2 giây | 1000 = 1 giây | 0 = tắt loading           ║
// ╚════════════════════════════════════════════════════════════╝
const LOADING_DELAY = 2000;

(function () {
    if (!LOADING_DELAY) return;

    // Tạo overlay + spinner
    var overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML =
        '<style>' +
        '#loading-overlay{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;transition:opacity .3s;backdrop-filter:blur(4px)}' +
        '#loading-overlay.hide{opacity:0;pointer-events:none}' +
        '.xt-spinner{width:48px;height:48px;border:4px solid rgba(255,255,255,.2);border-top-color:#e8af06;border-radius:50%;animation:xt-spin .7s linear infinite}' +
        '@keyframes xt-spin{to{transform:rotate(360deg)}}' +
        '</style>' +
        '<div class="xt-spinner"></div>';
    document.documentElement.appendChild(overlay);

    // Ẩn sau LOADING_DELAY
    function hideOverlay() {
        overlay.classList.add('hide');
    }
    setTimeout(hideOverlay, LOADING_DELAY);

    // Hiện lại khi click link chuyển trang
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href]');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href) return;
        // Bỏ qua: anchor trên cùng trang, javascript:, tel:, mailto:, target _blank
        if (href.startsWith('#') || href.startsWith('javascript') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
        if (link.target === '_blank') return;
        // Hiện spinner
        overlay.classList.remove('hide');
    });

    // Hiện khi dùng nút back/forward trình duyệt
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) overlay.classList.add('hide');
    });
})();
