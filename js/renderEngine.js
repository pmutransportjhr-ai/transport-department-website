/**
 * RenderEngine - Dynamic UI Generator for Jharkhand Transport Department Portal
 * Transport Department, Government of Jharkhand
 */

(function (window, document) {
    'use strict';

    /*
     * Client-side URL validation is defense in depth only. This static site does
     * not provide a server-side token issuer or POST handler, so a token created
     * in sessionStorage must never be treated as CSRF protection.
     */
    var PortalSecurity = {
        TRUSTED_DOMAINS: [
            'transport.jharkhand.gov.in',
            '103.97.109.116',
            'parivahan.gov.in',
            'vahan.parivahan.gov.in',
            'sarathi.parivahan.gov.in',
            'echallan.parivahan.gov.in'
        ],

        isTrustedURL: function (input) {
            if (typeof input !== 'string' || !input.trim()) return false;

            var parsed;
            try {
                parsed = new URL(input.trim(), window.location.href);
            } catch (error) {
                return false;
            }

            if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                return false;
            }
            if (parsed.username || parsed.password) return false;

            /* Relative and same-origin links are allowed; reject cross-origin HTTP. */
            if (parsed.origin === window.location.origin) return true;
            if (parsed.protocol !== 'https:') return false;

            var host = parsed.hostname.toLowerCase();
            return this.TRUSTED_DOMAINS.some(function (domain) {
                return host === domain.toLowerCase();
            });
        },

        safeRedirect: function (input) {
            if (!this.isTrustedURL(input)) {
                console.warn('[PortalSecurity] Blocked redirect to an untrusted URL.');
                return false;
            }

            try {
                window.location.assign(new URL(input.trim(), window.location.href).href);
                return true;
            } catch (error) {
                console.warn('[PortalSecurity] Redirect could not be completed.');
                return false;
            }
        },

        /* Kept as a compatibility hook; CSRF must be implemented by the server. */
        init: function () {}
    };

    /* Expose PortalSecurity globally for use by other scripts if needed */
    window.PortalSecurity = PortalSecurity;


    const RenderEngine = {
        init: function () {
            this.detectCurrentPage();
            this.renderHeader();
            this.renderNoticeTicker();
            this.renderHomeSections();
            this.renderFooter();
            this.setupAccordion();
            this.setupAccessibility();

        },


        initHeader: function () {
            this.detectCurrentPage();
            this.renderHeader();
            this.setupAccordion();
        },

        initTicker: function () {
            this.renderNoticeTicker();
        },

        initFooter: function () {
            this.renderFooter();
        },

        currentPage: 'index.html',

        detectCurrentPage: function () {
            const path = window.location.pathname;
            const page = path.substring(path.lastIndexOf('/') + 1);
            this.currentPage = page || 'index.html';
        },

        // Render Header & Top Bar
        renderHeader: function () {
            const headerContainer = document.getElementById('main-header');
            if (!headerContainer || typeof navData === 'undefined') return;

            const current = this.currentPage;

            let navHtml = navData.mainMenu.map((item, idx) => {
                const isActive = (item.activeOn && item.activeOn.includes(current)) || (item.url === current) ? 'active' : '';
                if (item.dropdown && item.dropdown.length > 0) {
                    let dropdownItems = item.dropdown.map(drop =>
                        `<li><a class="dropdown-item" href="${drop.url}">${drop.title}</a></li>`
                    ).join('');

                    return `
                        <li class="nav-item dropdown ${isActive}">
                            <a href="${item.url}" class="nav-link dropdown-toggle" id="navDropdown${idx}" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                ${item.title} <i class="fa fa-caret-down"></i>
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navDropdown${idx}">
                                ${dropdownItems}
                            </ul>
                        </li>
                    `;
                } else {
                    return `
                        <li class="nav-item ${isActive}">
                            <a class="nav-link" href="${item.url}">
                                ${item.icon ? `<i class="fa ${item.icon}"></i> ` : ''}${item.title}
                            </a>
                        </li>
                    `;
                }
            }).join('');

            const ctaBtn = navData.ctaButton ? `
                <li class="nav-item portal-nav-link">
                    <a class="nav-link" href="${navData.ctaButton.url}" target="_blank" rel="noopener">
                        <i class="fa ${navData.ctaButton.icon}"></i> ${navData.ctaButton.title}
                    </a>
                </li>
            ` : '';

            const headerMarkup = `
                <div class="govt-strip">
                    <div class="container-fluid govt-strip-inner">
                        <div class="govt-name">
                            <span class="govt-seal">⚜</span> GOVERNMENT OF JHARKHAND
                            <span class="strip-divider"></span>
                            <strong>${navData.headerBranding.englishTitle.split(',')[0]}</strong>
                        </div>
                        <div class="govt-tools">
                            <a href="tel:${navData.topStrip.helpline}"><i class="fa fa-phone"></i> ${navData.topStrip.helplineText}</a>
                            <a class="sr-only-focusable" href="#main-content">Skip to Main Content</a>
                            <span class="font-controls" aria-label="Font Controls">
                                <a href="javascript:void(0)" onclick="RenderEngine.changeFontSize(-1)" title="Decrease Font Size">A−</a>
                                <a href="javascript:void(0)" onclick="RenderEngine.changeFontSize(0)" title="Reset Font Size">A</a>
                                <a href="javascript:void(0)" onclick="RenderEngine.changeFontSize(1)" title="Increase Font Size">A+</a>
                            </span>
                            <a href="javascript:void(0)" onclick="RenderEngine.toggleContrast()" aria-label="Toggle High Contrast" title="Toggle Contrast Mode">
                                <i class="fa fa-moon-o"></i>
                            </a>
                            <a href="javascript:void(0)" title="Select Language">English <i class="fa fa-angle-down"></i></a>
                            <span class="visitor-count">
                                <i class="fa fa-bar-chart"></i> Visitors: 
                                <img src="https://hits.sh/transport.jharkhand.gov.in/.svg?style=flat-square" alt="Visitor Counter" />
                            </span>
                        </div>
                    </div>
                </div>

                <div class="identity-bar">
                    <div class="container-fluid identity-inner">
                        <a class="department-identity" href="index.html">
                            <img src="${navData.headerBranding.logo}" alt="Government of Jharkhand emblem">
                            <span>
                                <b>${navData.headerBranding.hindiTitle}</b>
                                <strong>${navData.headerBranding.englishTitle}</strong>
                                <small>${navData.headerBranding.subtitle}</small>
                            </span>
                        </a>
                        <div class="header-actions">
                            <form class="portal-search" action="how_do_i.html" role="search">
                                <label class="visually-hidden" for="portal-search-input">Search portal</label>
                                <input id="portal-search-input" type="search" name="q" placeholder="Search portal (Vahan, Sarathi, Rules)">
                                <button type="submit" aria-label="Search"><i class="fa fa-search"></i></button>
                            </form>
                            <a class="partner-badge" href="${navData.headerBranding.parivahanLink}" target="_blank" rel="noopener">
                                <i class="fa fa-shield"></i><span>PARIVAHAN</span>
                            </a>
                            <a class="partner-badge" href="${navData.headerBranding.digitalIndiaLink}" target="_blank" rel="noopener">
                                <i class="fa fa-microchip"></i><span>DIGITAL INDIA</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="morth-nav-row">
                    <nav class="navbar navbar-expand-lg" role="navigation">
                        <div class="container-fluid">
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
                                <i class="fa fa-bars"></i> <span class="toggler-label">MENU</span>
                            </button>
                            <div class="collapse navbar-collapse" id="mainNavbar">
                                <ul class="navbar-nav">
                                    ${navHtml}
                                    ${ctaBtn}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            `;

            headerContainer.innerHTML = headerMarkup;

            // Bootstrap 5 dropdown hover on desktop
            if (typeof $ !== 'undefined') {
                // Desktop: enable hover for dropdown menus
                $(headerContainer).on('mouseenter', '.nav-item.dropdown', function () {
                    if (window.innerWidth >= 992) {
                        var $toggle = $(this).find('.dropdown-toggle');
                        var ddInstance = bootstrap.Dropdown.getOrCreateInstance($toggle[0]);
                        ddInstance.show();
                    }
                }).on('mouseleave', '.nav-item.dropdown', function () {
                    if (window.innerWidth >= 992) {
                        var $toggle = $(this).find('.dropdown-toggle');
                        var ddInstance = bootstrap.Dropdown.getOrCreateInstance($toggle[0]);
                        ddInstance.hide();
                    }
                });
            }
        },

        // Render Notice Ticker
        renderNoticeTicker: function () {
            const tickerContainer = document.getElementById('notice-ticker-container');
            if (!tickerContainer || typeof tickerNotifications === 'undefined') return;

            let tickerItemsHtml = tickerNotifications.map(item =>
                `<span><strong>${item.text}</strong> ${item.highlight ? `<a href="${item.link}" style="color:#ffd126;margin-left:4px;text-decoration:underline;">[${item.highlight}]</a>` : ''} <b>●</b></span>`
            ).join(' ');

            tickerContainer.innerHTML = `
                <section class="notice-ticker" aria-label="Latest notifications">
                    <div class="notice-label"><i class="fa fa-bullhorn"></i> Latest Notifications</div>
                    <div class="notice-track">
                        <div class="notice-marquee" aria-label="Transport Department notices">
                            ${tickerItemsHtml}
                        </div>
                    </div>
                </section>
            `;
        },

        // Render Home Page Sections
        renderHomeSections: function () {
            this.renderHeroSlider();
            this.renderKeyOfficials();
            this.renderCitizenPortals();
            this.renderLiveDashboard();
            this.renderRepositoryDesk('All Categories');
            this.renderRoadSafetySchemes();
            this.renderMediaGallery('All');
            this.renderSocialMediaHub();
            this.renderDistrictDirectory();
            this.renderBottomLinks();
        },

        // 1. Key Officials Render
        renderKeyOfficials: function () {
            const container = document.getElementById('key-officials-container');
            if (!container || typeof officialsData === 'undefined') return;

            let cardsHtml = officialsData.map(off => `
                <div class="minister-card-item">
                    <img src="${off.image}" alt="${off.name}">
                    <div class="minister-card-text">
                        <h4>${off.name}</h4>
                        <p class="designation">${off.designation}</p>
                        <p class="dept">${off.department}</p>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="panel-box officials-box">
                    <div class="panel-box-header green-header">
                        <span><i class="fa fa-users"></i> KEY OFFICIALS</span>
                        <span class="badge-tag">GOVT</span>
                    </div>
                    <div class="panel-box-body">
                        ${cardsHtml}
                        <a href="contact-details.html" class="directory-btn">
                            Directory of Officials <i class="fa fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            `;
        },

        // 2. Hero Slider Render
        renderHeroSlider: function () {
            const container = document.getElementById('hero-slider-container');
            if (!container || typeof bannersData === 'undefined' || !bannersData.length) return;

            let indicators = bannersData.map((b, idx) => `
                <li data-slide-to="${idx}" class="${idx === 0 ? 'active' : ''}"></li>
            `).join('');

            let slides = bannersData.map((b, idx) => `
                <div class="hero-slide ${idx === 0 ? 'active' : ''}">
                    <img src="${b.image}" alt="${b.title}">
                    <div class="hero-slide-caption">
                        ${b.badge ? `<span class="hero-badge-tag">${b.badge}</span>` : ''}
                        <h2>${b.title}</h2>
                        <p>${b.subtitle}</p>
                        ${b.buttonText ? `<a href="${b.buttonUrl}" class="hero-yellow-btn"><i class="fa fa-shield"></i> ${b.buttonText}</a>` : ''}
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div id="transportCarousel" class="hero-slider-box">
                    <div class="hero-slides-wrapper">
                        ${slides}
                    </div>
                    <ol class="hero-indicators">
                        ${indicators}
                    </ol>
                    <button class="hero-ctrl prev-btn" type="button" aria-label="Previous Slide">
                        <i class="fa fa-chevron-left"></i>
                    </button>
                    <button class="hero-ctrl next-btn" type="button" aria-label="Next Slide">
                        <i class="fa fa-chevron-right"></i>
                    </button>
                </div>
            `;

            // Self-Contained Bulletproof Slider Controller
            let currentIndex = 0;
            const slideCount = bannersData.length;
            let timer = null;

            function goToSlide(index) {
                currentIndex = (index + slideCount) % slideCount;
                
                const slidesList = container.querySelectorAll('.hero-slide');
                const dotsList = container.querySelectorAll('.hero-indicators li');

                slidesList.forEach((slide, idx) => {
                    if (idx === currentIndex) {
                        slide.classList.add('active');
                    } else {
                        slide.classList.remove('active');
                    }
                });

                dotsList.forEach((dot, idx) => {
                    if (idx === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function startAutoPlay() {
                stopAutoPlay();
                timer = setInterval(function() {
                    goToSlide(currentIndex + 1);
                }, 4500);
            }

            function stopAutoPlay() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }

            const prevBtn = container.querySelector('.prev-btn');
            const nextBtn = container.querySelector('.next-btn');
            const dots = container.querySelectorAll('.hero-indicators li');

            if (prevBtn) {
                prevBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    goToSlide(currentIndex - 1);
                    startAutoPlay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    goToSlide(currentIndex + 1);
                    startAutoPlay();
                });
            }

            dots.forEach((dot, idx) => {
                dot.addEventListener('click', function(e) {
                    e.preventDefault();
                    goToSlide(idx);
                    startAutoPlay();
                });
            });

            container.addEventListener('mouseenter', stopAutoPlay);
            container.addEventListener('mouseleave', startAutoPlay);

            startAutoPlay();
        },

        // 3. Citizen Online Portals Grid
        renderCitizenPortals: function () {
            const container = document.getElementById('online-portals-container');
            if (!container || typeof citizenPortalsData === 'undefined') return;

            let portalsHtml = citizenPortalsData.map(p => `
                <div class="col-md-3 col-sm-6 portal-card-col">
                    <a href="${p.url}" ${p.external ? 'target="_blank" rel="noopener"' : ''} class="portal-flex-card">
                        <div class="portal-card-img" style="background:${p.iconBg};color:${p.iconColor}">
                            <i class="fa ${p.iconClass}"></i>
                        </div>
                        <div class="portal-card-info">
                            <h4>${p.title}</h4>
                            <small>${p.subtitle}</small>
                        </div>
                        <span class="blue-arrow"><i class="fa fa-arrow-right"></i></span>
                    </a>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="panel-box portals-panel-box">
                    <div class="panel-box-top-bar">
                        <div class="panel-top-title">
                            <i class="fa fa-th" style="color:#1670f5;margin-right:6px;"></i>
                            <h3>CITIZEN ONLINE PORTALS & SERVICES</h3>
                        </div>
                        <span class="panel-top-sub">Direct Access Gateways to Parivahan & State Applications</span>
                    </div>
                    <div class="panel-box-body">
                        <div class="row portal-cards-row">
                            ${portalsHtml}
                        </div>
                    </div>
                </div>
            `;
        },

        // 4. Live Dashboard Metrics
        renderLiveDashboard: function () {
            const container = document.getElementById('live-dashboard-container');
            if (!container || typeof dashboardData === 'undefined') return;

            let metricsHtml = dashboardData.map(d => `
                <div class="col-md-3 col-sm-6 dashboard-col">
                    <div class="metric-card" style="border-left:4px solid ${d.iconColor}">
                        <div class="metric-icon" style="background:${d.iconBg};color:${d.iconColor}">
                            <i class="fa ${d.icon}"></i>
                        </div>
                        <div class="metric-info">
                            <h3>${d.count}</h3>
                            <p class="metric-label">${d.label}</p>
                            <small class="metric-sub">${d.subtext}</small>
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="container">
                    <div class="dashboard-header">
                        <div>
                            <h2><i class="fa fa-line-chart"></i> Transport Department Live Dashboard</h2>
                            <p>Real-time statistics & integrated repository metrics across 24 districts</p>
                        </div>
                        <span class="live-tag"><i class="fa fa-signal"></i> LIVE REPOSITORY DATA</span>
                    </div>
                    <div class="row metric-row">
                        ${metricsHtml}
                    </div>
                </div>
            `;
        },

        // 5. Public Repository Desk (8-Card Grid Matching User Screenshots)
        renderRepositoryDesk: function (categoryFilter) {
            const container = document.getElementById('repository-desk-container');
            if (!container) return;

            categoryFilter = categoryFilter || 'All Categories';
            const categories = ['All Categories', 'Notifications', 'Traffic & DL', 'Forms', 'Portals'];

            let filterTabsHtml = categories.map(cat => `
                <button class="repo-pill-btn ${cat === categoryFilter ? 'active' : ''}" onclick="RenderEngine.renderRepositoryDesk('${cat}')">
                    ${cat}
                </button>
            `).join('');

            let cardsData = (typeof repositoryCardsData !== 'undefined') ? repositoryCardsData : [];
            if (categoryFilter !== 'All Categories') {
                cardsData = cardsData.filter(c => c.category === categoryFilter);
            }

            let cardsHtml = cardsData.map(card => {
                let itemsList = card.items.map(item => `
                    <li>
                        <div class="repo-item-content">
                            <a href="${item.url}" ${item.isExternal ? 'target="_blank" rel="noopener"' : ''}>
                                <i class="fa ${item.isExternal ? 'fa-external-link external-icon' : 'fa-file-pdf-o pdf-icon'}"></i>
                                <span>${item.title}</span>
                            </a>
                            ${item.date ? `<small class="repo-item-date">${item.date}</small>` : ''}
                        </div>
                        ${item.isNew ? '<span class="badge badge-pink-new">NEW</span>' : ''}
                    </li>
                `).join('');

                return `
                    <div class="col-md-3 col-sm-6 repo-grid-col">
                        <div class="repo-card-box">
                            <div class="repo-card-head green-head">
                                <div class="head-title-wrap">
                                    <div class="icon-circle"><i class="fa ${card.icon}"></i></div>
                                    <h4>${card.title}</h4>
                                </div>
                                <span class="badge pdf-badge" style="background:${card.badgeColor || '#e83b50'}">${card.badge || 'PDF'}</span>
                            </div>
                            <div class="repo-card-content">
                                <ul>
                                    ${itemsList}
                                </ul>
                            </div>
                            <div class="repo-card-bottom">
                                <a href="${card.moreLink}">View Complete List <i class="fa fa-angle-right"></i></a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = `
                <div class="container-fluid" style="max-width:1360px;margin:auto;">
                    <div class="repo-desk-top">
                        <div>
                            <span class="desk-blue-tag">PUBLIC REPOSITORY DESK</span>
                            <h2 class="repo-desk-heading"><i class="fa fa-folder" style="color:#d89f00;"></i> Notifications, Acts, Rules & Gazette Desk</h2>
                        </div>
                        <div class="repo-pills-wrap">
                            ${filterTabsHtml}
                        </div>
                    </div>

                    <div class="row repo-8cards-row">
                        ${cardsHtml || '<div class="col-xs-12"><p>No repository cards found for this category.</p></div>'}
                    </div>
                </div>
            `;
        },

        // 6. Road Safety & Key Schemes Showcase
        renderRoadSafetySchemes: function () {
            const container = document.getElementById('road-safety-schemes-container');
            if (!container) return;

            const schemes = [
                {
                    title: "Gram Gadi Yojna",
                    badge: "SCHEME",
                    badgeBg: "#007541",
                    icon: "fa-bus",
                    color: "#007541",
                    desc: "Mukhyamantri Gram Gadi Yojna provides free & subsidized bus travel for students, senior citizens, and rural commuters.",
                    url: "pdf/Route  notification under Mukhyamantri Gram Gadi Yojna5.pdf",
                    linkText: "View Scheme Routes"
                },
                {
                    title: "Good Samaritan Policy",
                    badge: "REWARD",
                    badgeBg: "#e83b50",
                    icon: "fa-heartbeat",
                    color: "#e83b50",
                    desc: "Assisting road accident victims during the Golden Hour entitles Good Samaritans to cash awards and legal protection.",
                    url: "pdf/Good Samaritan Jharkhand Gazette 23.09.2022.pdf",
                    linkText: "Read Protection Policy"
                },
                {
                    title: "Vehicle Scrappage Facility",
                    badge: "POLICY",
                    badgeBg: "#1670f5",
                    icon: "fa-recycle",
                    color: "#1670f5",
                    desc: "Registered Vehicle Scrapping Facility (RVSF) offers tax concessions and road tax waivers for scrapping 15+ year old vehicles.",
                    url: "pdf/PREOWNED.pdf",
                    linkText: "Check Scrappage Norms"
                },
                {
                    title: "IRC Road Safety Signs",
                    badge: "SAFETY",
                    badgeBg: "#f3a800",
                    icon: "fa-shield",
                    color: "#f3a800",
                    desc: "Comprehensive guidelines on Mandatory, Cautionary, and Informatory traffic signboards approved by Indian Roads Congress.",
                    url: "road-signs.html",
                    linkText: "Explore Road Signs"
                }
            ];

            let cardsHtml = schemes.map(s => `
                <div class="col-md-3 col-sm-6 scheme-card-col">
                    <div class="scheme-card-box">
                        <div class="scheme-top-badge" style="background:${s.badgeBg}">${s.badge}</div>
                        <div class="scheme-icon-wrap" style="color:${s.color}">
                            <i class="fa ${s.icon}"></i>
                        </div>
                        <h3>${s.title}</h3>
                        <p>${s.desc}</p>
                        <a href="${s.url}" target="${s.url.endsWith('.pdf') ? '_blank' : '_self'}" class="scheme-btn" style="border-color:${s.color};color:${s.color}">
                            ${s.linkText} <i class="fa fa-angle-right"></i>
                        </a>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="schemes-section-inner">
                    <div class="schemes-header-top">
                        <div>
                            <span class="desk-blue-tag" style="background:#eaf0fb;color:#1670f5;">PUBLIC SAFETY & WELFARE</span>
                            <h2 class="schemes-main-heading"><i class="fa fa-shield" style="color:#007541;"></i> Key Departmental Schemes & Road Safety Initiatives</h2>
                        </div>
                        <a href="how_do_i.html" class="all-schemes-link">View All Citizen Schemes <i class="fa fa-arrow-right"></i></a>
                    </div>
                    <div class="row schemes-cards-row">
                        ${cardsHtml}
                    </div>
                </div>
            `;
        },

        // 8. Animated Media & Photo Gallery Showcase
        renderMediaGallery: function (filterCategory) {
            const container = document.getElementById('media-gallery-container');
            if (!container) return;

            filterCategory = filterCategory || 'All';
            const categories = ['All', 'Events', 'Gram Gadi', 'Road Safety', 'Infrastructure'];

            const galleryItems = [
                {
                    title: "Mukhyamantri Gram Gadi Yojna Bus Service Launch",
                    category: "Gram Gadi",
                    image: "img/services/ggy.jpg",
                    date: "Flag-off Event"
                },
                {
                    title: "Statewide Road Safety Month Campaign & Awareness Rally",
                    category: "Road Safety",
                    image: "img/banners/Jharkhand%20Road%20Safety%20Awareness%20Campaign.png",
                    date: "Public Drive"
                },
                {
                    title: "Vehicle Registration & Fitness Services",
                    category: "Infrastructure",
                    image: "img/services/vehicle-reg.jpg",
                    date: "Ranchi Center"
                },
                {
                    title: "Smart Card Driving Licence Desk & Automated Test Track",
                    category: "Events",
                    image: "img/services/driving-license.jpg",
                    date: "DTO Launch"
                },
                {
                    title: "Interstate Checkpost Modernization & Entry Tax Review",
                    category: "Infrastructure",
                    image: "img/services/check-post.jpg",
                    date: "Border Review"
                },
                {
                    title: "National Highway Safety Guidelines & Enforcement",
                    category: "Road Safety",
                    image: "img/road-signs/over-speeding.jpg",
                    date: "Safety Drive"
                }
            ];

            let filteredList = galleryItems;
            if (filterCategory !== 'All') {
                filteredList = galleryItems.filter(item => item.category === filterCategory);
            }

            let tabsHtml = categories.map(cat => `
                <button class="gallery-pill-btn ${cat === filterCategory ? 'active' : ''}" onclick="RenderEngine.renderMediaGallery('${cat}')">
                    ${cat}
                </button>
            `).join('');

            let itemsHtml = filteredList.map(item => `
                <div class="col-md-4 col-sm-6 gallery-card-col">
                    <div class="gallery-card-box">
                        <div class="gallery-img-wrap">
                            <img src="${item.image}" alt="${item.title}">
                            <span class="gallery-cat-badge">${item.category}</span>
                            <div class="gallery-hover-overlay">
                                <span class="zoom-icon"><i class="fa fa-search-plus"></i></span>
                            </div>
                        </div>
                        <div class="gallery-card-body">
                            <h4>${item.title}</h4>
                            <small><i class="fa fa-calendar-o"></i> ${item.date}</small>
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="gallery-section-inner">
                    <div class="gallery-header-top">
                        <div>
                            <span class="desk-blue-tag" style="background:#fef6e6;color:#d89f00;">DEPARTMENT MEDIA DESK</span>
                            <h2 class="gallery-main-heading"><i class="fa fa-camera" style="color:#d89f00;"></i> Photo Gallery & Major Events Showcase</h2>
                        </div>
                        <div class="gallery-pills-wrap">
                            ${tabsHtml}
                        </div>
                    </div>
                    <div class="row gallery-cards-row">
                        ${itemsHtml}
                    </div>
                </div>
            `;
        },

        // 9. MoRTH Official Social Media Hub
        activeSocialTab: 'tweets',
        renderSocialMediaHub: function (activeTab) {
            const container = document.getElementById('social-media-container');
            if (!container) return;

            if (activeTab) {
                this.activeSocialTab = activeTab;
            } else {
                activeTab = this.activeSocialTab || 'tweets';
            }

            let feedContentHtml = '';

            if (activeTab === 'tweets') {
                feedContentHtml = `
                    <div class="tweet-item">
                        <div class="tweet-header">
                            <img src="img/brand/logo1.jpg" alt="Transport Dept Emblem" class="tweet-avatar">
                            <div>
                                <h5>Transport Dept Jharkhand <i class="fa fa-check-circle verified-icon"></i></h5>
                                <span class="tweet-handle">@TransportJhr • 2h ago</span>
                            </div>
                        </div>
                        <div class="tweet-content">
                            <p>🚨 <strong>Road Safety Awareness:</strong> Always wear helmets & seatbelts while driving. Good Samaritans assisting road accident victims in the Golden Hour receive ₹5,000 reward + protection certificate under State Gazette! #RoadSafety #Jharkhand</p>
                        </div>
                        <div class="tweet-actions">
                            <span><i class="fa fa-comment-o"></i> 14</span>
                            <span><i class="fa fa-retweet"></i> 48</span>
                            <span><i class="fa fa-heart-o"></i> 192</span>
                            <span><i class="fa fa-share-square-o"></i> Share</span>
                        </div>
                    </div>

                    <div class="tweet-item">
                        <div class="tweet-header">
                            <img src="img/brand/logo1.jpg" alt="Transport Dept Emblem" class="tweet-avatar">
                            <div>
                                <h5>Transport Dept Jharkhand <i class="fa fa-check-circle verified-icon"></i></h5>
                                <span class="tweet-handle">@TransportJhr • Yesterday</span>
                            </div>
                        </div>
                        <div class="tweet-content">
                            <p>🚌 <strong>Mukhyamantri Gram Gadi Yojna:</strong> Bus routes updated across rural districts! Free passes issued to senior citizens, students, and persons with disabilities. Apply at your nearest DTO office. #GramGadiYojna</p>
                        </div>
                        <div class="tweet-actions">
                            <span><i class="fa fa-comment-o"></i> 29</span>
                            <span><i class="fa fa-retweet"></i> 95</span>
                            <span><i class="fa fa-heart-o"></i> 340</span>
                            <span><i class="fa fa-share-square-o"></i> Share</span>
                        </div>
                    </div>

                    <div class="tweet-item" style="border:none;">
                        <div class="tweet-header">
                            <img src="img/brand/logo1.jpg" alt="Transport Dept Emblem" class="tweet-avatar">
                            <div>
                                <h5>Transport Dept Jharkhand <i class="fa fa-check-circle verified-icon"></i></h5>
                                <span class="tweet-handle">@TransportJhr • 3 days ago</span>
                            </div>
                        </div>
                        <div class="tweet-content">
                            <p>💳 <strong>e-Challan Digital Payment:</strong> Pay traffic violation challans online directly via <a href="https://echallan.parivahan.gov.in/" target="_blank" rel="noopener">echallan.parivahan.gov.in</a>. Safe, instant, & official. #DigitalIndia #Parivahan</p>
                        </div>
                        <div class="tweet-actions">
                            <span><i class="fa fa-comment-o"></i> 8</span>
                            <span><i class="fa fa-retweet"></i> 32</span>
                            <span><i class="fa fa-heart-o"></i> 115</span>
                            <span><i class="fa fa-share-square-o"></i> Share</span>
                        </div>
                    </div>
                `;
            } else if (activeTab === 'videos') {
                feedContentHtml = `
                    <div class="video-feed-item" style="margin-bottom:18px;">
                        <div class="video-thumbnail-box" style="position:relative;border-radius:8px;overflow:hidden;">
                            <img src="img/services/ggy.jpg" alt="Gram Gadi Yojna Video" style="width:100%;height:180px;object-fit:cover;border-radius:8px;">
                            <div class="play-overlay" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
                                <a href="https://youtube.com" target="_blank" rel="noopener" class="play-btn" style="font-size:38px;color:#ff0000;background:#ffffff;border-radius:50%;width:50px;height:50px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);"><i class="fa fa-play"></i></a>
                            </div>
                        </div>
                        <h4 style="font-size:14px;font-weight:800;margin:10px 0 4px;color:#182b20;">Mukhyamantri Gram Gadi Yojna Official Documentary & Bus Route Guide</h4>
                        <small style="color:var(--text-muted);"><i class="fa fa-youtube-play text-danger"></i> Transport Dept Official Channel • 18K views</small>
                    </div>
                    <div class="video-feed-item">
                        <div class="video-thumbnail-box" style="position:relative;border-radius:8px;overflow:hidden;">
                            <img src="img/services/driving-license.jpg" alt="DL Online Guide" style="width:100%;height:180px;object-fit:cover;border-radius:8px;">
                            <div class="play-overlay" style="position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;">
                                <a href="https://youtube.com" target="_blank" rel="noopener" class="play-btn" style="font-size:38px;color:#ff0000;background:#ffffff;border-radius:50%;width:50px;height:50px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.3);"><i class="fa fa-play"></i></a>
                            </div>
                        </div>
                        <h4 style="font-size:14px;font-weight:800;margin:10px 0 4px;color:#182b20;">How to Apply for Learner Licence & Slot Booking on Sarathi 4.0 Portal</h4>
                        <small style="color:var(--text-muted);"><i class="fa fa-youtube-play text-danger"></i> Transport Dept Official Channel • 42K views</small>
                    </div>
                `;
            } else if (activeTab === 'facebook') {
                feedContentHtml = `
                    <div class="fb-post-item" style="border-bottom:1px solid #edf2ef;padding-bottom:14px;margin-bottom:14px;">
                        <div class="tweet-header">
                            <img src="img/brand/logo1.jpg" alt="Transport Dept Emblem" class="tweet-avatar">
                            <div>
                                <h5>Department of Transport, Govt of Jharkhand</h5>
                                <span class="tweet-handle">Official Facebook Page • Published by Admin</span>
                            </div>
                        </div>
                        <p style="font-size:13px;color:#374151;margin:8px 0 10px;">
                            📢 <strong>Public Notice:</strong> All vehicle owners are requested to complete High Security Registration Plate (HSRP) fitment at authorized vehicle dealerships across all 24 districts to avoid penalties.
                        </p>
                        <div class="tweet-actions">
                            <span><i class="fa fa-thumbs-o-up"></i> 142 Likes</span>
                            <span><i class="fa fa-comment-o"></i> 38 Comments</span>
                            <span><i class="fa fa-share"></i> 54 Shares</span>
                        </div>
                    </div>
                    <div class="fb-post-item">
                        <div class="tweet-header">
                            <img src="img/brand/logo1.jpg" alt="Transport Dept Emblem" class="tweet-avatar">
                            <div>
                                <h5>Department of Transport, Govt of Jharkhand</h5>
                                <span class="tweet-handle">Official Facebook Page • Published by Admin</span>
                            </div>
                        </div>
                        <p style="font-size:13px;color:#374151;margin:8px 0 10px;">
                            🚗 <strong>Automated Driving Test Tracks:</strong> Modernized automated driving testing tracks operational in Ranchi & Jamshedpur for fair, transparent DL skill evaluation.
                        </p>
                        <div class="tweet-actions">
                            <span><i class="fa fa-thumbs-o-up"></i> 230 Likes</span>
                            <span><i class="fa fa-comment-o"></i> 19 Comments</span>
                            <span><i class="fa fa-share"></i> 78 Shares</span>
                        </div>
                    </div>
                `;
            }

            container.innerHTML = `
                <div class="social-hub-inner">
                    <div class="social-header-top">
                        <div>
                            <span class="desk-blue-tag" style="background:#e8f1fd;color:#1670f5;"><i class="fa fa-share-alt"></i> DIGITAL CONNECTIVITY</span>
                            <h2 class="social-main-heading"><i class="fa fa-twitter" style="color:#1da1f2;"></i> Official Social Media Hub & Announcements</h2>
                        </div>
                        <span class="social-live-badge"><i class="fa fa-circle" style="color:#22c55e;"></i> LIVE SOCIAL FEEDS</span>
                    </div>

                    <div class="row social-hub-row">
                        <!-- LEFT COLUMN: TWEETS & ANNOUNCEMENTS FEED -->
                        <div class="col-md-7 social-feed-col">
                            <div class="social-feed-card">
                                <div class="feed-card-header">
                                    <div class="feed-tabs">
                                        <button class="feed-tab-btn ${activeTab === 'tweets' ? 'active' : ''}" onclick="RenderEngine.renderSocialMediaHub('tweets')">
                                            <i class="fa fa-twitter" style="color:#1da1f2;"></i> Latest Tweets
                                        </button>
                                        <button class="feed-tab-btn ${activeTab === 'videos' ? 'active' : ''}" onclick="RenderEngine.renderSocialMediaHub('videos')">
                                            <i class="fa fa-youtube-play" style="color:#ff0000;"></i> Videos
                                        </button>
                                        <button class="feed-tab-btn ${activeTab === 'facebook' ? 'active' : ''}" onclick="RenderEngine.renderSocialMediaHub('facebook')">
                                            <i class="fa fa-facebook" style="color:#1877f2;"></i> Facebook
                                        </button>
                                    </div>
                                </div>
                                <div class="feed-card-body">
                                    ${feedContentHtml}
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT COLUMN: OFFICIAL CHANNELS & CITIZEN HELPDESK -->
                        <div class="col-md-5 social-channels-col">
                            <div class="social-channels-card">
                                <h3><i class="fa fa-bullhorn" style="color:#007541;"></i> Connect on Official Channels</h3>
                                <div class="channel-list">
                                    <div class="channel-item twitter-box">
                                        <div class="channel-info">
                                            <i class="fa fa-twitter channel-icon"></i>
                                            <div>
                                                <h4>Twitter / X</h4>
                                                <small>@TransportJhr • 45.2K Followers</small>
                                            </div>
                                        </div>
                                        <a href="https://x.com" target="_blank" rel="noopener" class="follow-btn twitter-btn">Follow</a>
                                    </div>

                                    <div class="channel-item facebook-box">
                                        <div class="channel-info">
                                            <i class="fa fa-facebook channel-icon"></i>
                                            <div>
                                                <h4>Facebook Page</h4>
                                                <small>@JharkhandTransport • 88.4K Likes</small>
                                            </div>
                                        </div>
                                        <a href="https://facebook.com" target="_blank" rel="noopener" class="follow-btn fb-btn">Like Page</a>
                                    </div>

                                    <div class="channel-item youtube-box">
                                        <div class="channel-info">
                                            <i class="fa fa-youtube-play channel-icon"></i>
                                            <div>
                                                <h4>YouTube Channel</h4>
                                                <small>Transport Dept Jharkhand • 32.1K Subs</small>
                                            </div>
                                        </div>
                                        <a href="https://youtube.com" target="_blank" rel="noopener" class="follow-btn yt-btn">Subscribe</a>
                                    </div>

                                    <div class="channel-item help-box">
                                        <div class="channel-info">
                                            <i class="fa fa-phone channel-icon" style="color:#e83b50;"></i>
                                            <div>
                                                <h4>National Highway Helpline</h4>
                                                <small>Toll Free Helpline: 1033 (24x7)</small>
                                            </div>
                                        </div>
                                        <a href="tel:1033" class="follow-btn helpline-btn">Call 1033</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // 7. District Transport Offices (24 DTO Directory)
        renderDistrictDirectory: function () {
            const container = document.getElementById('district-directory-container');
            if (!container) return;

            const districts = [
                "Ranchi", "East Singhbhum", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar",
                "Giridih", "Ramgarh", "Palamu", "Dumka", "West Singhbhum", "Koderma",
                "Jamtara", "Khunti", "Gumla", "Simdega", "Lohardaga", "Latehar",
                "Garhwa", "Chatra", "Pakur", "Sahibganj", "Godda", "Seraikela-Kharsawan"
            ];

            let pillsHtml = districts.map(d => `
                <div class="col-md-2 col-sm-3 col-xs-6 district-pill-col">
                    <a href="contact-details.html" class="district-pill-item">
                        <i class="fa fa-map-marker"></i> ${d} DTO
                    </a>
                </div>
            `).join('');

            container.innerHTML = `
                <div class="district-dir-inner">
                    <div class="district-dir-head">
                        <h3><i class="fa fa-building-o" style="color:#d89f00;margin-right:8px;"></i> 24 District Transport Offices (DTO) Quick Directory</h3>
                        <p>Direct contact details, office locations, and helpline numbers for all 24 districts of Jharkhand</p>
                    </div>
                    <div class="row district-pills-row">
                        ${pillsHtml}
                    </div>
                </div>
            `;
        },

        // 10. Bottom Portals, Links & Helpdesk Cards (Pre-Footer Desk)
        renderBottomLinks: function () {
            const container = document.getElementById('bottom-links-container');
            if (!container) return;

            container.innerHTML = `
                <div class="container-fluid" style="max-width:1360px;margin:auto;">
                    <div class="row bottom-links-row" style="margin-top:0;">
                        <div class="col-md-3 col-sm-6 bottom-link-col">
                            <div class="bottom-link-card">
                                <h3><i class="fa fa-shield" style="color:#1670f5;"></i> POLICIES & ACCESSIBILITY</h3>
                                <ul>
                                    <li><a href="disclaimer.html">Disclaimer <span class="badge badge-pink-new">NEW</span></a></li>
                                    <li><a href="privacy.html">Privacy Policy</a></li>
                                    <li><a href="help.html">Help & Support</a></li>
                                    <li><a href="accessibility.html">Accessibility Statement</a></li>
                                    <li><a href="hyperlink.html">Hyperlinking Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-3 col-sm-6 bottom-link-col">
                            <div class="bottom-link-card">
                                <h3><i class="fa fa-building" style="color:#f3a800;"></i> GOVERNMENT PORTALS</h3>
                                <div class="govt-logos-grid">
                                    <a href="https://india.gov.in/" target="_blank" rel="noopener"><img src="img/brand/a1.png" alt="India.gov.in"></a>
                                    <a href="https://data.gov.in/" target="_blank" rel="noopener"><img src="img/brand/a6.png" alt="Data.gov.in"></a>
                                    <a href="https://tenders.gov.in/" target="_blank" rel="noopener"><img src="img/brand/a10.png" alt="Tenders India"></a>
                                    <a href="https://mygov.in/" target="_blank" rel="noopener"><img src="img/brand/a5.png" alt="MyGov"></a>
                                </div>
                            </div>
                        </div>

                        <div class="col-md-3 col-sm-6 bottom-link-col">
                            <div class="bottom-link-card">
                                <h3><i class="fa fa-globe" style="color:#007541;"></i> PARIVAHAN LINKS</h3>
                                <ul>
                                    <li><a href="https://parivahan.gov.in/npermit/" target="_blank" rel="noopener">National Permit Portal</a></li>
                                    <li><a href="https://vahan.parivahan.gov.in/" target="_blank" rel="noopener">Vahan 4.0 Vehicle Portal</a></li>
                                    <li><a href="https://sarathi.parivahan.gov.in/" target="_blank" rel="noopener">Sarathi 4.0 Driving Licence</a></li>
                                    <li><a href="https://vahan.parivahan.gov.in/vahan4dashboard/" target="_blank" rel="noopener">Vahan National Dashboard</a></li>
                                    <li><a href="archive.html">Archive Documents</a></li>
                                </ul>
                            </div>
                        </div>

                        <div class="col-md-3 col-sm-6 bottom-link-col">
                            <div class="bottom-link-card">
                                <h3><i class="fa fa-headphones" style="color:#e83b50;"></i> HELPDESK CONTACTS</h3>
                                <div class="helpdesk-info">
                                    <p><strong>Main Support</strong><br><a href="mailto:dtohelpdeskjharkhand@gmail.com">dtohelpdeskjharkhand@gmail.com</a></p>
                                    <p><strong>State Permit Desk</strong><br><a href="mailto:spermitjhr@gmail.com">spermitjhr@gmail.com</a></p>
                                    <p><strong>E-Challan Support</strong><br><a href="mailto:pghelpdesk@hdfcbank.com">pghelpdesk@hdfcbank.com</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        },

        // Render Footer
        renderFooter: function () {
            const footerContainer = document.getElementById('main-footer');
            if (!footerContainer) return;

            footerContainer.innerHTML = `
                <footer class="main-footer">
                    <div class="container-fluid footer-top">
                        <div class="container">
                            <div class="row">
                                <div class="col-md-3 col-sm-6 footer-col">
                                    <h4>Department of Transport</h4>
                                    <p>Government of Jharkhand<br>Providing citizen-centric online vehicle registration, driving license, and permit services across all 24 districts.</p>
                                    <div class="footer-contacts">
                                        <p><i class="fa fa-envelope"></i> dtohelpdeskjharkhand[at]gmail[dot]com</p>
                                        <p><i class="fa fa-envelope"></i> spermitjhr[at]gmail[dot]com (Permits)</p>
                                        <p><i class="fa fa-phone"></i> Helpline: 1033 (National Highways)</p>
                                    </div>
                                </div>
                                <div class="col-md-3 col-sm-6 footer-col">
                                    <h4>Quick Links</h4>
                                    <ul class="footer-links">
                                        <li><a href="index.html"><i class="fa fa-angle-right"></i> Home</a></li>
                                        <li><a href="about-us.html"><i class="fa fa-angle-right"></i> About Us</a></li>
                                        <li><a href="how_do_i.html"><i class="fa fa-angle-right"></i> Online Services</a></li>
                                        <li><a href="citizen-charter.html"><i class="fa fa-angle-right"></i> Citizen Charter</a></li>
                                        <li><a href="acts-rules.html"><i class="fa fa-angle-right"></i> Acts & Rules</a></li>
                                        <li><a href="contact-details.html"><i class="fa fa-angle-right"></i> Contact Details</a></li>
                                    </ul>
                                </div>
                                <div class="col-md-3 col-sm-6 footer-col">
                                    <h4>Important Portals</h4>
                                    <ul class="footer-links">
                                        <li><a href="https://parivahan.gov.in/npermit/" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> National Permit Portal</a></li>
                                        <li><a href="https://vahan.parivahan.gov.in/vahan/" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Vahan 4 Portal</a></li>
                                        <li><a href="https://parivahan.gov.in/sarathiservice/" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Sarathi 4 Portal</a></li>
                                        <li><a href="https://echallan.parivahan.gov.in/" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> e-Challan System</a></li>
                                        <li><a href="https://vahan.parivahan.gov.in/vahan4dashboard/" target="_blank" rel="noopener"><i class="fa fa-external-link"></i> Vahan Dashboard</a></li>
                                        <li><a href="archive.html"><i class="fa fa-angle-right"></i> Archive Notifications</a></li>
                                    </ul>
                                </div>
                                <div class="col-md-3 col-sm-6 footer-col">
                                    <h4>Policies & Help</h4>
                                    <ul class="footer-links">
                                        <li><a href="disclaimer.html"><i class="fa fa-angle-right"></i> Disclaimer</a></li>
                                        <li><a href="privacy.html"><i class="fa fa-angle-right"></i> Privacy Policy</a></li>
                                        <li><a href="help.html"><i class="fa fa-angle-right"></i> Help & FAQs</a></li>
                                        <li><a href="accessibility.html"><i class="fa fa-angle-right"></i> Accessibility Statement</a></li>
                                        <li><a href="hyperlink.html"><i class="fa fa-angle-right"></i> Hyperlinking Policy</a></li>
                                    </ul>
                                    <div class="govt-portals-logos">
                                        <a href="https://india.gov.in/" target="_blank" rel="noopener" title="National Portal of India"><img src="img/brand/a1.png" alt="India.gov.in"></a>
                                        <a href="https://mygov.in/" target="_blank" rel="noopener" title="MyGov Portal"><img src="img/brand/a5.png" alt="MyGov"></a>
                                        <a href="https://data.gov.in/" target="_blank" rel="noopener" title="Data.gov.in"><img src="img/brand/a6.png" alt="Data.gov.in"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="footer-bottom">
                        <div class="container text-center">
                            <p>Designed, Developed & Hosted by <strong>National Informatics Centre (NIC), Jharkhand, Ranchi</strong></p>
                            <p class="copyright">© ${new Date().getFullYear()} Transport Department, Government of Jharkhand. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>
            `;
        },

        fontSizeLevel: 0,
        changeFontSize: function (delta) {
            if (delta === 0) this.fontSizeLevel = 0;
            else this.fontSizeLevel = Math.max(-2, Math.min(3, this.fontSizeLevel + delta));

            const baseSize = 14 + (this.fontSizeLevel * 2);
            document.documentElement.style.fontSize = baseSize + 'px';
        },

        toggleContrast: function () {
            document.body.classList.toggle('high-contrast');
        },

        setupAccordion: function () {
            if (typeof jQuery === 'undefined') return;
            var $ = jQuery;

            $(document).off('click.portalAccordion', '[data-toggle="collapse"]').on('click.portalAccordion', '[data-toggle="collapse"]', function (e) {
                var targetId = $(this).attr('href') || $(this).attr('data-target');
                if (!targetId || targetId === '#') return;

                var $target = $(targetId);
                if ($target.length) {
                    e.preventDefault();
                    e.stopPropagation();

                    var parentSelector = $(this).attr('data-parent');
                    if (parentSelector && $(parentSelector).length) {
                        var $parent = $(parentSelector);
                        $parent.find('.panel-collapse.in').not($target).slideUp(250, function () {
                            $(this).removeClass('in').addClass('collapse').css('display', '');
                        });
                        $parent.find('[data-toggle="collapse"]').not(this).addClass('collapsed').attr('aria-expanded', 'false');
                    }

                    if ($target.hasClass('in')) {
                        $target.slideUp(250, function () {
                            $target.removeClass('in').addClass('collapse').css('display', '');
                        });
                        $(this).addClass('collapsed').attr('aria-expanded', 'false');
                    } else {
                        $target.removeClass('collapse').hide().slideDown(250, function () {
                            $target.addClass('in').css('display', '');
                        });
                        $(this).removeClass('collapsed').attr('aria-expanded', 'true');
                    }
                }
            });
        },

        setupAccessibility: function () {}
    };

    window.RenderEngine = RenderEngine;

    document.addEventListener('DOMContentLoaded', function () {
        RenderEngine.init();
    });

})(window, document);
