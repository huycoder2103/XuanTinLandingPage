/**
 * News module — fetches articles from a published Google Sheet.
 *
 * SETUP:
 * 1. Tạo Google Sheet với các cột: id | title | category | categoryColor | date | author | image | summary | content
 * 2. File > Share > Publish to web (chọn Sheet 1, CSV)
 * 3. Dán Sheet ID vào biến SHEET_ID bên dưới
 */

const NEWS_CONFIG = {
    SHEET_ID: '', // <-- Dán Google Sheet ID vào đây
    SHEET_NAME: 'Sheet1',
};

function getSheetUrl() {
    return `https://docs.google.com/spreadsheets/d/${NEWS_CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${NEWS_CONFIG.SHEET_NAME}`;
}

function parseSheetData(rawText) {
    const json = JSON.parse(rawText.substring(47).slice(0, -2));
    const headers = json.table.cols.map(c => c.label.toLowerCase().trim());
    return json.table.rows.map(row => {
        const obj = {};
        row.c.forEach((cell, i) => {
            obj[headers[i]] = cell ? (cell.v != null ? String(cell.v) : '') : '';
        });
        return obj;
    });
}

async function fetchArticles() {
    if (!NEWS_CONFIG.SHEET_ID) {
        console.warn('[News] Chưa cấu hình SHEET_ID trong js/news.js');
        return [];
    }
    const res = await fetch(getSheetUrl());
    const text = await res.text();
    return parseSheetData(text);
}

function formatDate(dateStr) {
    return dateStr;
}

function getCategoryColor(color) {
    const map = {
        'orange': 'bg-orange-500',
        'blue': 'bg-blue-900',
        'green': 'bg-green-600',
        'red': 'bg-red-600',
    };
    return map[color] || 'bg-orange-500';
}

function renderNewsCard(article, basePath) {
    const imgPath = basePath + article.image;
    const articleUrl = `${basePath}pages/article.html?id=${article.id}`;
    const catClass = getCategoryColor(article.categorycolor);
    return `
        <a href="${articleUrl}" class="industrial-card bg-white block group shadow-lg">
            <div class="relative overflow-hidden h-64">
                <img src="${imgPath}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                     alt="${article.title}" loading="lazy" decoding="async">
                <div class="absolute top-4 left-4 ${catClass} text-white px-4 py-1 text-[10px] font-black uppercase">
                    ${article.category}
                </div>
            </div>
            <div class="p-8">
                <p class="text-[10px] font-bold text-black/40 mb-3">${formatDate(article.date)}</p>
                <h4 class="font-black text-blue-900 text-lg uppercase leading-tight group-hover:text-orange-500 transition-colors mb-4">
                    ${article.title}
                </h4>
                <p class="text-sm text-black/60 line-clamp-3 italic">${article.summary}</p>
            </div>
        </a>`;
}

function renderHomepageNews(articles, basePath) {
    if (!articles.length) return '';
    const featured = articles[0];
    const featuredUrl = `${basePath}pages/article.html?id=${featured.id}`;
    const side = articles.slice(1, 3);

    let sideHtml = side.map(a => {
        const url = `${basePath}pages/article.html?id=${a.id}`;
        return `
            <a href="${url}" class="flex gap-4 md:gap-6 items-center p-4 bg-white border border-gray-100 rounded-xl hover:shadow-xl group transition-all">
                <img src="${basePath}${a.image}" class="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden rounded-lg object-cover"
                     alt="${a.title}" loading="lazy" decoding="async">
                <h4 class="font-black text-blue-900 text-[10px] md:text-xs uppercase group-hover:text-orange-500">${a.title}</h4>
            </a>`;
    }).join('');

    return `
        <div class="grid lg:grid-cols-12 gap-8 md:gap-10">
            <div class="lg:col-span-8 reveal-left">
                <a href="${featuredUrl}" class="industrial-card bg-white block group h-full shadow-2xl">
                    <div class="relative overflow-hidden h-48 md:h-[400px]">
                        <img src="${basePath}${featured.image}" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                             alt="${featured.title}" loading="lazy" decoding="async">
                        <div class="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent"></div>
                        <div class="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                            <h3 class="heading-style text-xl md:text-3xl font-black text-white mb-2 md:mb-4 group-hover:text-orange-500">
                                ${featured.title.toUpperCase()}
                            </h3>
                        </div>
                    </div>
                </a>
            </div>
            <div class="lg:col-span-4 flex flex-col gap-4 md:gap-6 reveal-right">
                ${sideHtml}
            </div>
        </div>`;
}

function renderArticlePage(article) {
    const catClass = getCategoryColor(article.categorycolor);
    return `
        <div class="mb-12">
            <div class="${catClass} text-white px-3 py-1 inline-block text-[10px] font-black uppercase mb-6">${article.category}</div>
            <h1 class="heading-style text-4xl md:text-6xl font-black text-blue-900 leading-tight mb-6">${article.title.toUpperCase()}</h1>
            <div class="flex items-center gap-6 text-xs font-bold text-black/40 uppercase tracking-widest border-y border-gray-200 py-6">
                <span><i class="bi bi-calendar3"></i> ${formatDate(article.date)}</span>
                <span><i class="bi bi-person"></i> ${article.author}</span>
            </div>
        </div>
        <img src="../${article.image}" class="w-full h-[500px] object-cover rounded-xl shadow-2xl mb-12" alt="${article.title}">
        <div class="article-content text-lg">${article.content}</div>`;
}
