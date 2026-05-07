// Theme Management
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;
const hljsTheme = document.getElementById('hljs-theme');

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    hljsTheme.href = theme === 'dark' 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css';
}

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Mobile Menu
const mobileBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');

mobileBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('open');
    });
});

// Data
const projects = [
    {
        title: "Project Alpha",
        description: "A modern web application built with React and Node.js. Features real-time collaboration and responsive design.",
        tags: ["React", "Node.js", "Socket.io"],
        link: "#"
    },
    {
        title: "Design System",
        description: "A comprehensive component library with accessibility-first approach and dark mode support.",
        tags: ["TypeScript", "Storybook", "CSS"],
        link: "#"
    },
    {
        title: "CLI Tool",
        description: "Command-line utility for automating deployment workflows. Supports multiple cloud providers.",
        tags: ["Go", "DevOps", "AWS"],
        link: "#"
    }
];

let blogIndex = [];
let currentTag = null;
let currentCategory = null;
let lastRoute = '';
let lastPath = '';

// Routing
function parseHash() {
    const hash = window.location.hash.slice(1) || 'about';
    const parts = hash.split('/');
    return { route: parts[0], path: parts.slice(1) };
}

function updateActiveNav(route) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.route === route);
    });
}

// Views
function renderAbout() {
    return `
        <section class="about-section">
            <div class="about-text">
                <h1>Hello, I'm a Developer.</h1>
                <p class="subtitle">I build things for the web. Focused on clean code, user experience, and minimalist design.</p>
                <div class="about-content">
                    <p>
                        I'm a software engineer with a passion for creating elegant solutions to complex problems. 
                        I believe in the power of simplicity and strive to write code that is both efficient and maintainable.
                    </p>
                    <p>
                        When I'm not coding, you'll find me exploring new technologies, contributing to open source, 
                        or writing about my experiences in tech.
                    </p>
                    <p>
                        Currently working with modern JavaScript ecosystems, cloud infrastructure, and design systems. 
                        Always interested in challenging projects and collaborative opportunities.
                    </p>
                </div>
            </div>
            <div class="about-image-wrapper">
                <div class="about-image" id="about-image">
                    <img src="assets/profile.jpg" alt="Profile Photo" onerror="this.style.display='none'; document.getElementById('about-image').classList.add('no-image');">
                </div>
            </div>
        </section>
    `;
}

function renderProjects() {
    const searchSvg = `<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`;
    
    const cards = projects.map(p => `
        <article class="project-card" data-search="${(p.title + ' ' + p.description + ' ' + p.tags.join(' ')).toLowerCase()}">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="project-tags">
                ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </article>
    `).join('');

    return `
        <section>
            <h1 class="section-title">Projects</h1>
            <div class="search-box">
                ${searchSvg}
                <input type="text" id="project-search" placeholder="Search projects by name, tech, or description..." autocomplete="off">
            </div>
            <div class="projects-grid">${cards}</div>
        </section>
    `;
}

async function loadBlogIndex() {
    try {
        const res = await fetch('data/blog-index.json');
        blogIndex = await res.json();
    } catch (e) {
        blogIndex = [];
    }
}

function getFilteredPosts() {
    let posts = [...blogIndex];
    if (currentTag) {
        posts = posts.filter(p => p.tags.includes(currentTag));
    }
    if (currentCategory) {
        posts = posts.filter(p => p.category === currentCategory);
    }
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function getAllTags() {
    const tags = new Set();
    blogIndex.forEach(p => p.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
}

function getAllCategories() {
    const cats = new Set();
    blogIndex.forEach(p => cats.add(p.category));
    return Array.from(cats).sort();
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderBlogList() {
    const posts = getFilteredPosts();
    const tags = getAllTags();
    const categories = getAllCategories();
    const searchSvg = `<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`;

    const postsHtml = posts.length ? posts.map(post => `
        <article class="blog-item" data-search="${(post.title + ' ' + post.excerpt + ' ' + post.tags.join(' ') + ' ' + post.category).toLowerCase()}">
            <h2><a href="#blog/${post.path}">${post.title}</a></h2>
            <div class="blog-meta">
                <time>${formatDate(post.date)}</time>
                <span>${post.category}</span>
                <span>${post.readTime}</span>
            </div>
            <p class="blog-excerpt">${post.excerpt}</p>
            <div class="project-tags">
                ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            </div>
        </article>
    `).join('') : '<p style="color: var(--text-secondary)">No posts found.</p>';

    return `
        <div class="blog-layout">
            <div class="blog-main">
                ${currentTag || currentCategory ? `
                    <div class="breadcrumb">
                        <a href="#blog">Blog</a>
                        ${currentCategory ? `<span>/</span><span>${currentCategory}</span>` : ''}
                        ${currentTag ? `<span>/</span><span>#${currentTag}</span>` : ''}
                        <span style="margin-left: auto; cursor: pointer;">
                            <a href="#blog" onclick="clearFilters()" style="color: var(--accent)">Clear</a>
                        </span>
                    </div>
                ` : ''}
                <div class="search-box">
                    ${searchSvg}
                    <input type="text" id="blog-search" placeholder="Search articles, tags, or categories..." autocomplete="off">
                </div>
                <div class="blog-list">${postsHtml}</div>
            </div>
            <aside class="blog-sidebar">
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Categories</h3>
                    <ul class="sidebar-list">
                        ${categories.map(c => `
                            <li>
                                <a href="#blog" 
                                   class="${currentCategory === c ? 'active' : ''}"
                                   onclick="setCategory('${c}')">
                                    ${c}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="sidebar-section">
                    <h3 class="sidebar-title">Tags</h3>
                    <div class="tag-cloud">
                        ${tags.map(t => `
                            <span class="tag ${currentTag === t ? 'active' : ''}" 
                                  onclick="setTag('${t}')">
                                ${t}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </aside>
        </div>
    `;
}

async function renderBlogPost(pathParts) {
    const path = pathParts.join('/');
    const post = blogIndex.find(p => p.path === path);
    
    if (!post) {
        return `<div class="blog-main"><p>Post not found.</p></div>`;
    }

    try {
        const res = await fetch(`blog/${path}.md`);
        const md = await res.text();
        const htmlContent = marked.parse(md);

        return `
            <div class="blog-layout">
                <article class="blog-main blog-post">
                    <div class="breadcrumb">
                        <a href="#blog">Blog</a>
                        <span>/</span>
                        <span>${post.title}</span>
                    </div>
                    <header class="blog-post-header">
                        <h1>${post.title}</h1>
                        <div class="blog-post-meta">
                            <time>${formatDate(post.date)}</time>
                            <span>${post.category}</span>
                            <span>${post.readTime}</span>
                        </div>
                    </header>
                    <div class="markdown-body">${htmlContent}</div>
                </article>
                <aside class="blog-sidebar">
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">Tags</h3>
                        <div class="tag-cloud">
                            ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                        </div>
                    </div>
                    <div class="sidebar-section">
                        <h3 class="sidebar-title">More Posts</h3>
                        <ul class="sidebar-list">
                            ${blogIndex
                                .filter(p => p.path !== path)
                                .slice(0, 5)
                                .map(p => `
                                    <li><a href="#blog/${p.path}">${p.title}</a></li>
                                `).join('')}
                        </ul>
                    </div>
                </aside>
            </div>
        `;
    } catch (e) {
        return `<div class="blog-main"><p>Failed to load post.</p></div>`;
    }
}

// Filter handlers
window.setTag = (tag) => {
    currentTag = currentTag === tag ? null : tag;
    currentCategory = null;
    render();
};

window.setCategory = (cat) => {
    currentCategory = currentCategory === cat ? null : cat;
    currentTag = null;
    render();
};

window.clearFilters = () => {
    currentTag = null;
    currentCategory = null;
};

// Search handlers
function attachSearchListeners() {
    const pSearch = document.getElementById('project-search');
    if (pSearch) {
        pSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.project-card').forEach(card => {
                const data = card.dataset.search || '';
                card.classList.toggle('hidden', !data.includes(term));
            });
        });
    }

    const bSearch = document.getElementById('blog-search');
    if (bSearch) {
        bSearch.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.blog-item').forEach(item => {
                const data = item.dataset.search || '';
                item.classList.toggle('hidden', !data.includes(term));
            });
        });
    }
}

// Main Render
async function render() {
    const app = document.getElementById('app');
    const { route, path } = parseHash();
    
    updateActiveNav(route);

    const pathStr = path.join('/');
    if (route !== lastRoute || pathStr !== lastPath) {
        window.scrollTo(0, 0);
    }
    lastRoute = route;
    lastPath = pathStr;

    switch(route) {
        case 'about':
            app.innerHTML = renderAbout();
            break;
        case 'projects':
            app.innerHTML = renderProjects();
            attachSearchListeners();
            break;
        case 'blog':
            if (path.length > 0) {
                app.innerHTML = await renderBlogPost(path);
                if (window.hljs) hljs.highlightAll();
            } else {
                app.innerHTML = renderBlogList();
                attachSearchListeners();
            }
            break;
        default:
            app.innerHTML = renderAbout();
    }
}

// Cat Logic
const cat = document.getElementById('cat');
const catMenu = document.getElementById('cat-menu');
let isDancing = false;
let isRunning = false;
let catPosition = 'right'; // 'right' or 'left'
let menuHideTimeout;

cat.addEventListener('mouseenter', () => {
    clearTimeout(menuHideTimeout);
    if (!isDancing && !isRunning) {
        cat.classList.remove('sleeping');
        cat.classList.add('standing');
        catMenu.style.display = 'flex';
    }
});

cat.addEventListener('mouseleave', () => {
    menuHideTimeout = setTimeout(() => {
        catMenu.style.display = 'none';
        if (!isDancing && !isRunning) {
            cat.classList.remove('standing');
            cat.classList.add('sleeping');
        }
    }, 500); // .5 seconds delay
});

catMenu.addEventListener('click', (e) => {
    e.stopPropagation();
    clearTimeout(menuHideTimeout);
    const action = e.target.dataset.action;
    if (!action) return;

    catMenu.style.display = 'none';

    if (action === 'dance') {
        if (isDancing || isRunning) return;
        isDancing = true;
        cat.classList.remove('sleeping', 'standing');
        cat.classList.add('dancing');
        setTimeout(() => {
            cat.classList.remove('dancing');
            cat.classList.add('standing');
            isDancing = false;
            if (!cat.matches(':hover')) {
                cat.classList.remove('standing');
                cat.classList.add('sleeping');
            }
        }, 2000);
    } else if (action === 'run') {
        if (isDancing || isRunning) return;
        isRunning = true;
        cat.classList.remove('sleeping', 'standing');
        if (catPosition === 'right') {
            cat.classList.add('running-left');
            setTimeout(() => {
                cat.classList.remove('running-left');
                cat.classList.remove('right');
                cat.classList.add('left');
                catPosition = 'left';
                cat.classList.add('standing');
                isRunning = false;
                if (!cat.matches(':hover')) {
                    cat.classList.remove('standing');
                    cat.classList.add('sleeping');
                }
            }, 2000);
        } else {
            cat.classList.add('running-right');
            setTimeout(() => {
                cat.classList.remove('running-right');
                cat.classList.remove('left');
                cat.classList.add('right');
                catPosition = 'right';
                cat.classList.add('standing');
                isRunning = false;
                if (!cat.matches(':hover')) {
                    cat.classList.remove('standing');
                    cat.classList.add('sleeping');
                }
            }, 2000);
        }
    }
});

// Init
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', async () => {
    await loadBlogIndex();
    render();
});