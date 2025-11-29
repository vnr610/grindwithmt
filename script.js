// Performance-optimized script with DOM caching, debouncing, and Intersection Observer

(function() {
    'use strict';
    
    // Cache DOM elements
    const cache = {
        themeToggleBtn: null,
        themeToggleMobile: null,
        mobileMenu: null,
        jsModal: null,
        modalPanel: null,
        showAllBtn: null,
        moreCard: null,
        emailInput: null,
        tabContents: null,
        tabButtons: null,
        blogCards: null
    };
    
    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Initialize DOM cache
    function initCache() {
        cache.themeToggleBtn = document.getElementById('theme-toggle');
        cache.themeToggleMobile = document.getElementById('theme-toggle-mobile');
        cache.mobileMenu = document.getElementById('mobile-menu');
        cache.jsModal = document.getElementById('js-modal');
        cache.modalPanel = cache.jsModal?.querySelector('div:nth-child(2) > div');
        cache.showAllBtn = document.getElementById('show-all-js-btn');
        cache.moreCard = document.getElementById('more-js-card');
        cache.emailInput = document.getElementById('newsletter-email');
        cache.tabContents = document.querySelectorAll('.tab-content');
        cache.tabButtons = document.querySelectorAll('.tab-btn');
        cache.blogCards = document.querySelectorAll('.blog-card');
    }
    
    // --- 1. Dark Mode Logic (Optimized) ---
    function initTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.theme;
        
        if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            updateIcons('moon');
        } else {
            document.documentElement.classList.remove('dark');
            updateIcons('sun');
        }
    }
    
    function toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'light' : 'dark';
        updateIcons(isDark ? 'sun' : 'moon');
    }
    
    function updateIcons(mode) {
        const iconName = mode === 'moon' ? 'sun' : 'moon';
        const iconHtml = `<i data-lucide="${iconName}" class="w-5 h-5"></i>`;
        
        if (cache.themeToggleBtn) cache.themeToggleBtn.innerHTML = iconHtml;
        if (cache.themeToggleMobile) cache.themeToggleMobile.innerHTML = iconHtml;
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // --- 2. Mobile Menu Logic ---
    function toggleMobileMenu() {
        if (cache.mobileMenu) {
            cache.mobileMenu.classList.toggle('hidden');
        }
    }
    
    // Make it globally accessible
    window.toggleMobileMenu = toggleMobileMenu;
    
    // --- 3. Modal & Tab Logic (Optimized) ---
    function openJsModal(tabToOpen) {
        if (!cache.jsModal || !cache.modalPanel) return;
        
        cache.jsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        if (tabToOpen) {
            switchTab(tabToOpen);
        }
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: cache.modalPanel,
                scale: [0.9, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    }
    
    function closeJsModal() {
        if (!cache.jsModal || !cache.modalPanel) return;
        
        if (typeof anime !== 'undefined') {
            anime({
                targets: cache.modalPanel,
                scale: [1, 0.95],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuad',
                complete: () => {
                    cache.jsModal.classList.add('hidden');
                    document.body.style.overflow = '';
                }
            });
        } else {
            cache.jsModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }
    
    function switchTab(tabId) {
        if (!cache.tabContents || !cache.tabButtons) return;
        
        // Hide all tabs
        cache.tabContents.forEach(content => {
            content.classList.add('hidden');
            content.classList.remove('block');
        });
        
        // Show selected tab
        const selectedContent = document.getElementById(tabId);
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
            selectedContent.classList.add('block');
            
            if (typeof anime !== 'undefined') {
                anime({
                    targets: selectedContent,
                    opacity: [0, 1],
                    translateY: [10, 0],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }
        
        // Update button states
        const inactiveClass = "tab-btn w-full text-left px-4 py-3 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white flex items-center justify-between group transition-colors";
        const activeClass = "tab-btn w-full text-left px-4 py-3 rounded-md text-sm font-medium bg-brand-blue text-white shadow-sm flex items-center justify-between group transition-colors";
        
        cache.tabButtons.forEach(btn => {
            btn.className = inactiveClass;
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('opacity-100');
                icon.classList.add('opacity-0');
            }
        });
        
        const activeBtn = document.getElementById('btn-' + tabId);
        if (activeBtn) {
            activeBtn.className = activeClass;
            const activeIcon = activeBtn.querySelector('i');
            if (activeIcon) {
                activeIcon.classList.remove('opacity-0');
                activeIcon.classList.add('opacity-100');
            }
        }
    }
    
    // Make functions globally accessible
    window.openJsModal = openJsModal;
    window.closeJsModal = closeJsModal;
    window.switchTab = switchTab;
    
    // --- 4. "Show All" Logic ---
    function initShowAll() {
        if (!cache.showAllBtn) return;
        
        cache.showAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (cache.moreCard) {
                cache.moreCard.classList.remove('hidden');
                this.style.display = 'none';
                
                if (typeof anime !== 'undefined') {
                    anime({
                        targets: cache.moreCard,
                        opacity: [0, 1],
                        translateY: [20, 0],
                        duration: 600,
                        easing: 'easeOutQuad'
                    });
                }
            }
        });
    }
    
    // --- 5. Email Validation Logic (Debounced) ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    function validateEmail() {
        if (!cache.emailInput) return;
        
        const email = cache.emailInput.value;
        cache.emailInput.classList.remove('border-red-500', 'border-green-500', 'border-transparent');
        
        if (email.length === 0) {
            cache.emailInput.classList.add('border-transparent');
        } else if (emailRegex.test(email)) {
            cache.emailInput.classList.add('border-green-500');
        } else {
            cache.emailInput.classList.add('border-red-500');
        }
    }
    
    // --- 6. Optimized Animations with Intersection Observer ---
    function initAnimations() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Use Intersection Observer for reveal animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe reveal elements
        document.querySelectorAll('.reveal-element').forEach(el => {
            revealObserver.observe(el);
        });
        
        // Animate on page load only if elements are visible
        if (typeof anime !== 'undefined') {
            requestAnimationFrame(() => {
                const nav = document.querySelector('nav');
                const hero = document.querySelector('.hero-section');
                const sectionTitle = document.querySelector('.section-title');
                const blogCards = document.querySelectorAll('.blog-card:not(.hidden)');
                const ctaSection = document.querySelector('.cta-section');
                
                if (nav || hero || sectionTitle || blogCards.length || ctaSection) {
                    const tl = anime.timeline({
                        easing: 'easeOutExpo',
                        duration: 750
                    });
                    
                    if (nav) {
                        tl.add({
                            targets: nav,
                            translateY: [-100, 0],
                            opacity: [0, 1],
                            duration: 800
                        });
                    }
                    
                    if (hero) {
                        tl.add({
                            targets: hero,
                            translateY: [20, 0],
                            opacity: [0, 1],
                            duration: 800
                        }, '-=400');
                    }
                    
                    if (sectionTitle) {
                        tl.add({
                            targets: sectionTitle,
                            translateX: [-20, 0],
                            opacity: [0, 1],
                            duration: 600
                        }, '-=400');
                    }
                    
                    if (blogCards.length) {
                        tl.add({
                            targets: blogCards,
                            translateY: [50, 0],
                            opacity: [0, 1],
                            delay: anime.stagger(150),
                            duration: 800
                        }, '-=200');
                    }
                    
                    if (ctaSection) {
                        tl.add({
                            targets: ctaSection,
                            scale: [0.95, 1],
                            opacity: [0, 1],
                            duration: 800
                        }, '-=400');
                    }
                }
            });
        }
        
        // Optimized hover effects with event delegation
        if (cache.blogCards.length) {
            document.addEventListener('mouseenter', (e) => {
                const card = e.target.closest('.blog-card');
                if (card) {
                    const target = card.querySelector('.bg-white, .dark\\:bg-dark-card');
                    if (target && typeof anime !== 'undefined') {
                        anime({
                            targets: target,
                            scale: 1.02,
                            duration: 300,
                            easing: 'easeOutQuad'
                        });
                    }
                }
            }, true);
            
            document.addEventListener('mouseleave', (e) => {
                const card = e.target.closest('.blog-card');
                if (card) {
                    const target = card.querySelector('.bg-white, .dark\\:bg-dark-card');
                    if (target && typeof anime !== 'undefined') {
                        anime({
                            targets: target,
                            scale: 1,
                            duration: 300,
                            easing: 'easeOutQuad'
                        });
                    }
                }
            }, true);
        }
    }
    
    // Initialize everything
    function init() {
        initCache();
        initTheme();
        
        if (cache.themeToggleBtn) {
            cache.themeToggleBtn.addEventListener('click', toggleTheme);
        }
        if (cache.themeToggleMobile) {
            cache.themeToggleMobile.addEventListener('click', toggleTheme);
        }
        
        initShowAll();
        
        if (cache.emailInput) {
            cache.emailInput.addEventListener('input', debounce(validateEmail, 300));
        }
        
        // Wait for DOM and external scripts
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAnimations);
        } else {
            initAnimations();
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();