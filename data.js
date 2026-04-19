const articlesData = [
    {
        id: 'post1',
        title: '大家好啊我是Nero',
        filename: 'post1.html',
        date: '2026-04-19',
        category: 'life',
        categoryName: '生活',
        excerpt: '关于博客创建的介绍和目的（好玩）'
    },
    {
        id: 'post2',
        title: '制作了一个报警系统',
        filename: 'post2.html',
        date: '2026-04-18',
        category: 'tech',
        categoryName: '技术',
        excerpt: '分享最近做的报警系统'
    },
    {
        id: 'post3',
        title: '我的天呐原神！',
        filename: 'post3.html',
        date: '2026-04-17',
        category: 'life',
        categoryName: '生活',
        excerpt: '记录我的天呐原神！'
    }
];

const categoriesData = {
    tech: {
        name: '技术',
        filename: 'category-tech.html'
    },
    life: {
        name: '生活',
        filename: 'category-life.html'
    },
    travel: {
        name: '旅行',
        filename: 'category-travel.html'
    }
};

function getArticles() {
    return articlesData;
}

function getArticlesByCategory(category) {
    return articlesData.filter(article => article.category === category);
}

function getLatestArticles(limit = 10) {
    return [...articlesData]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
}

function getCategories() {
    return categoriesData;
}

function getCategoryArticleCount(category) {
    return articlesData.filter(article => article.category === category).length;
}

function getAllCategoriesWithCount() {
    return Object.entries(categoriesData).map(([key, value]) => ({
        ...value,
        key: key,
        count: getCategoryArticleCount(key)
    }));
}

function generatePostHTML(article) {
    return `
        <article class="post-item glass-effect">
            <h3><a href="${article.filename}">${article.title}</a></h3>
            <p class="post-meta">${article.date} | ${article.categoryName}</p>
            <p class="post-excerpt">${article.excerpt}</p>
        </article>
    `;
}

function generateCategoryItemHTML(category) {
    return `
        <a href="${category.filename}" class="category-item glass-effect">
            <h3>${category.name}</h3>
            <p>${category.count}篇文章</p>
        </a>
    `;
}

function loadLatestPosts(containerSelector, limit = 10) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const latestArticles = getLatestArticles(limit);
    container.innerHTML = latestArticles.map(article => generatePostHTML(article)).join('');
}

function loadPostsByCategory(category, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const categoryArticles = getArticlesByCategory(category);
    container.innerHTML = categoryArticles.map(article => generatePostHTML(article)).join('');
}

function loadCategories(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const categories = getAllCategoriesWithCount();
    container.innerHTML = categories.map(cat => generateCategoryItemHTML(cat)).join('');
}

function updateCategoryCounts(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const categories = getAllCategoriesWithCount();
    const categoryItems = container.querySelectorAll('.category-item');

    categoryItems.forEach((item, index) => {
        const countElement = item.querySelector('p');
        if (countElement && categories[index]) {
            countElement.textContent = `${categories[index].count}篇文章`;
        }
    });
}

function getRelatedArticles(articleId, limit = 2) {
    const currentArticle = articlesData.find(article => article.id === articleId);
    if (!currentArticle) return [];

    // 过滤掉当前文章
    const otherArticles = articlesData.filter(article => article.id !== articleId);
    
    // 按分类相关性排序
    const sortedArticles = otherArticles.sort((a, b) => {
        // 同分类的文章排在前面
        if (a.category === currentArticle.category && b.category !== currentArticle.category) return -1;
        if (a.category !== currentArticle.category && b.category === currentArticle.category) return 1;
        // 其他情况随机排序
        return Math.random() - 0.5;
    });

    return sortedArticles.slice(0, limit);
}

function loadRelatedArticles(articleId, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const relatedArticles = getRelatedArticles(articleId);
    container.innerHTML = relatedArticles.map(article => generatePostHTML(article)).join('');
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        articlesData,
        categoriesData,
        getArticles,
        getArticlesByCategory,
        getLatestArticles,
        getCategories,
        getCategoryArticleCount,
        getAllCategoriesWithCount,
        generatePostHTML,
        generateCategoryItemHTML,
        loadLatestPosts,
        loadPostsByCategory,
        loadCategories,
        updateCategoryCounts,
        getRelatedArticles,
        loadRelatedArticles
    };
}