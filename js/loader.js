async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    // Determine path based on current location
    const isSubPage = window.location.pathname.includes('/pages/');
    const pathPrefix = isSubPage ? '../' : '';
    
    try {
        const response = await fetch(pathPrefix + file);
        let html = await response.text();
        
        // Adjust links if in a subpage
        if (isSubPage) {
            // Links starting with 'index.html' -> '../index.html'
            html = html.replace(/href="index\.html/g, 'href="../index.html');
            // Links starting with 'pages/' -> remove 'pages/' because we are already in pages/
            html = html.replace(/href="pages\//g, 'href="');
            // For images or other assets, we might need more logic, but for now links are enough
        }

        element.innerHTML = html;
        
        // Re-trigger navbar scroll logic if header is loaded
        if (id === 'global-header') {
            window.dispatchEvent(new Event('scroll'));
        }
    } catch (error) {
        console.error('Error loading component:', error);
    }
}

// Auto load on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('global-header', 'components/header.html');
    loadComponent('global-footer', 'components/footer.html');
});