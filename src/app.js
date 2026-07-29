// TechQuizAi Dashboard Application Logic

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG !== 'undefined') {
        const logoText = document.getElementById('logoText');
        const logoIcon = document.getElementById('logoIcon');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const footerCopyright = document.getElementById('footerCopyright');

        if (logoText) logoText.textContent = CONFIG.appName;
        if (logoIcon) logoIcon.textContent = CONFIG.logoIcon;
        if (heroTitle) heroTitle.textContent = CONFIG.tagline;
        if (heroSubtitle) heroSubtitle.textContent = CONFIG.heroSubtitle;
        if (footerCopyright) {
            footerCopyright.innerHTML = `&copy; ${CONFIG.copyrightYear} <a href="${CONFIG.urls.siteUrl}">${CONFIG.appName}</a>. ${CONFIG.copyrightText}`;
        }
    }
    setupCookieConsent();
});

let allQuizzes = [];

const CATEGORY_ORDER = [
    'AWS Fundamentals',
    'Artificial Intelligence (AI) Foundations',
    'Google Cloud Platform (GCP)',
    'Azure Cloud & DevOps'
];

// Load quiz manifest from window.QUIZ_CATALOG or src/quizzes.json
async function loadQuizzes() {
    if (typeof window !== 'undefined' && window.QUIZ_CATALOG && window.QUIZ_CATALOG.manifest) {
        allQuizzes = window.QUIZ_CATALOG.manifest;
        renderQuizzes(allQuizzes);
        return;
    }

    try {
        const res = await fetch('src/quizzes.json');
        if (res.ok) {
            const data = await res.json();
            allQuizzes = data.manifest || [];
        }
    } catch (err) {
        console.warn('Could not fetch src/quizzes.json, using fallback data:', err);
    }
    renderQuizzes(allQuizzes);
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderCardHtml(quiz) {
    const isCompleted = localStorage.getItem(`techquizai_completed_${quiz.id}`) === 'true' || quiz.completed;
    return `
    <article class="quiz-card ${!quiz.available ? 'disabled' : ''}" data-id="${quiz.id}" tabindex="${quiz.available ? '0' : '-1'}" aria-disabled="${!quiz.available}">
      <div class="quiz-card-top">
        <span class="quiz-icon" aria-hidden="true">${quiz.icon || '📝'}</span>
        ${isCompleted
            ? '<span class="badge-completed" aria-label="Status: Completed">✓ Completed</span>'
            : (!quiz.available ? '<span class="badge-coming-soon" aria-label="Status: Coming Soon">⏳ Coming Soon</span>' : '')}
      </div>
      <h3 class="quiz-title">${escapeHtml(quiz.title)}</h3>
      <p class="quiz-subtitle">${escapeHtml(quiz.subtitle)}</p>
      <div class="quiz-meta">
        <span class="quiz-questions">${quiz.questions} Questions</span>
        ${!quiz.available
            ? `<button class="btn-disabled" disabled aria-disabled="true">Coming Soon</button>`
            : (isCompleted
                ? `<div class="completed-actions">
                     <button class="btn-retake" data-action="retake" data-id="${quiz.id}" aria-label="Retake ${escapeHtml(quiz.title)} quiz">Retake Quiz</button>
                     <button class="btn-certificate" data-action="certificate" data-id="${quiz.id}" aria-label="Download certificate for ${escapeHtml(quiz.title)}">📥 Certificate</button>
                   </div>`
                : `<button class="btn-start" data-action="start" data-id="${quiz.id}" aria-label="Start ${escapeHtml(quiz.title)} quiz">Start Quiz</button>`)}
      </div>
    </article>
  `;
}

// Render quiz cards grouped into horizontal category rows
function renderQuizzes(list, searchTerm = '') {
    const grid = document.getElementById('quizGrid');
    if (!grid) return;

    if (list.length === 0 && searchTerm) {
        // Automatically filter and display all published & available quizzes from allQuizzes
        const availableQuizzes = allQuizzes.filter(q => q.available !== false);

        grid.innerHTML = `
        <div class="no-results-card" role="region" aria-label="Search results empty">
            <div class="no-results-icon" aria-hidden="true">🔎</div>
            <h2 class="no-results-title">No quizzes found for <span class="search-term-highlight">"${escapeHtml(searchTerm)}"</span></h2>
            <p class="no-results-subtitle">Spin the wheel to explore published quizzes available to take (${availableQuizzes.length} available):</p>
            
            <div class="picker-container" id="iosPickerContainer" tabindex="0" aria-label="Available Quizzes 3D Selector Wheel">
                <div class="picker-selection-lens"></div>
                <div class="picker-wheel" id="iosPickerWheel">
                    ${availableQuizzes.map((q, idx) => `
                        <div class="picker-item ${idx === 0 ? 'active' : ''}" data-id="${q.id}" data-idx="${idx}">
                            ${q.icon || '📝'} ${escapeHtml(q.title)}
                        </div>
                    `).join('')}
                </div>
            </div>

            <button class="btn-picker-start" id="pickerStartBtn" data-id="${availableQuizzes[0] ? availableQuizzes[0].id : 'aws-basics'}">
                Start ${availableQuizzes[0] ? escapeHtml(availableQuizzes[0].title) : 'Quiz'} →
            </button>
        </div>
        `;

        initIosPicker(availableQuizzes);
        return;
    }

    // Group quizzes by category
    const categoryMap = {};
    list.forEach(quiz => {
        const cat = quiz.category || 'AWS Fundamentals';
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push(quiz);
    });

    // Sort categories by CATEGORY_ORDER
    const sortedCategories = Object.keys(categoryMap).sort((a, b) => {
        const idxA = CATEGORY_ORDER.indexOf(a);
        const idxB = CATEGORY_ORDER.indexOf(b);
        return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    let html = '';
    sortedCategories.forEach(catName => {
        const catQuizzes = categoryMap[catName];
        const headingId = `cat-${catName.replace(/[^a-zA-Z0-9]/g, '')}`;
        html += `
        <section class="category-block" aria-labelledby="${headingId}">
            <div class="category-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <div class="header-left">
                    <i class="fa-solid fa-chevron-down toggle-icon"></i>
                    <h2 id="${headingId}">${escapeHtml(catName)}</h2>
                </div>
                <span class="quiz-count">${catQuizzes.length} quiz${catQuizzes.length === 1 ? '' : 'zes'}</span>
            </div>
            <div class="category-grid">
                ${catQuizzes.map(quiz => renderCardHtml(quiz)).join('')}
            </div>
        </section>
        `;
    });

    grid.innerHTML = html;
}

// iOS 3D Cylindrical Wheel Picker Logic
function initIosPicker(availableQuizzes) {
    const container = document.getElementById('iosPickerContainer');
    const wheel = document.getElementById('iosPickerWheel');
    const startBtn = document.getElementById('pickerStartBtn');
    if (!container || !wheel || availableQuizzes.length === 0) return;

    let selectedIndex = 0;
    const totalItems = availableQuizzes.length;
    const radius = 65;

    function updateWheelPosition() {
        const items = wheel.querySelectorAll('.picker-item');
        items.forEach((item, idx) => {
            const diff = idx - selectedIndex;
            const angle = diff * 32;
            const opacity = Math.max(0.15, 1 - Math.abs(diff) * 0.4);
            const scale = Math.max(0.75, 1 - Math.abs(diff) * 0.12);
            
            item.style.transform = `rotateX(${-angle}deg) translateZ(${radius}px) scale(${scale})`;
            item.style.opacity = opacity;

            if (idx === selectedIndex) {
                item.classList.add('active');
                item.setAttribute('aria-selected', 'true');
            } else {
                item.classList.remove('active');
                item.setAttribute('aria-selected', 'false');
            }
        });

        const activeQuiz = availableQuizzes[selectedIndex];
        if (activeQuiz && startBtn) {
            startBtn.dataset.id = activeQuiz.id;
            startBtn.textContent = `Start ${activeQuiz.title} →`;
        }
    }

    updateWheelPosition();

    let startY = 0;
    let isDragging = false;

    container.addEventListener('pointerdown', (e) => {
        isDragging = true;
        startY = e.clientY;
        container.setPointerCapture(e.pointerId);
    });

    container.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const currentY = e.clientY - startY;
        if (Math.abs(currentY) > 20) {
            if (currentY < 0 && selectedIndex < totalItems - 1) {
                selectedIndex++;
                startY = e.clientY;
                updateWheelPosition();
            } else if (currentY > 0 && selectedIndex > 0) {
                selectedIndex--;
                startY = e.clientY;
                updateWheelPosition();
            }
        }
    });

    const onPointerUp = () => { isDragging = false; };
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0 && selectedIndex < totalItems - 1) {
            selectedIndex++;
            updateWheelPosition();
        } else if (e.deltaY < 0 && selectedIndex > 0) {
            selectedIndex--;
            updateWheelPosition();
        }
    }, { passive: false });

    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && selectedIndex < totalItems - 1) {
            e.preventDefault();
            selectedIndex++;
            updateWheelPosition();
        } else if (e.key === 'ArrowUp' && selectedIndex > 0) {
            e.preventDefault();
            selectedIndex--;
            updateWheelPosition();
        }
    });

    wheel.addEventListener('click', (e) => {
        const item = e.target.closest('.picker-item');
        if (item) {
            selectedIndex = parseInt(item.dataset.idx);
            updateWheelPosition();
        }
    });

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const quizId = startBtn.dataset.id;
            if (quizId) openNameModal(quizId);
        });
    }
}

loadQuizzes();

// Search functionality with clear button (x)
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const rawTerm = e.target.value;
        const term = rawTerm.trim().toLowerCase();

        if (searchClearBtn) {
            if (rawTerm.length > 0) {
                searchClearBtn.classList.remove('hidden');
            } else {
                searchClearBtn.classList.add('hidden');
            }
        }

        const filtered = allQuizzes.filter(q =>
            q.title.toLowerCase().includes(term) ||
            q.subtitle.toLowerCase().includes(term) ||
            (q.category && q.category.toLowerCase().includes(term))
        );
        renderQuizzes(filtered, rawTerm.trim());
    });
}

if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }
        searchClearBtn.classList.add('hidden');
        renderQuizzes(allQuizzes, '');
    });
}

// Dark mode toggle (Defaults to dark mode first)
const themeToggle = document.getElementById('themeToggle');
const themeKey = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.theme : 'theme';
const savedTheme = localStorage.getItem(themeKey) || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem(themeKey, next);
    });
}

// Google Analytics 4 Consent Mode & Location/Privacy Aware Controller
function initGoogleAnalytics(consentStatus) {
    const gaId = (typeof CONFIG !== 'undefined' && CONFIG.analyticsId) ? CONFIG.analyticsId : null;
    if (!gaId || gaId === 'G-MEASUREMENT_ID') return;

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    if (consentStatus === 'accepted') {
        window[`ga-disable-${gaId}`] = false;

        if (!document.getElementById('ga-gtag-script')) {
            const script = document.createElement('script');
            script.id = 'ga-gtag-script';
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
            document.head.appendChild(script);

            gtag('js', new Date());
            gtag('consent', 'default', {
                'analytics_storage': 'granted',
                'ad_storage': 'denied'
            });
            gtag('config', gaId, { 'anonymize_ip': true });
        } else {
            gtag('consent', 'update', { 'analytics_storage': 'granted' });
        }
    } else {
        // Globally disable Google Analytics if user selected Reject All
        window[`ga-disable-${gaId}`] = true;
        gtag('consent', 'default', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied'
        });
    }
}

// Cookie Banner Controller with Multi-Tab Cross-Tab Sync
function setupCookieConsent() {
    const cookieBanner = document.getElementById('cookieBanner');
    const consentKey = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.cookieConsent : 'cookieConsent';

    function applyConsent(status) {
        if (cookieBanner) {
            if (status) {
                cookieBanner.classList.add('hidden');
                cookieBanner.style.display = 'none';
            } else {
                cookieBanner.classList.remove('hidden');
                cookieBanner.style.display = 'block';
            }
        }
        initGoogleAnalytics(status);
    }

    const currentStatus = localStorage.getItem(consentKey);
    applyConsent(currentStatus);

    const acceptCookies = document.getElementById('acceptCookies');
    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'accepted');
            applyConsent('accepted');
        });
    }

    const rejectCookies = document.getElementById('rejectCookies');
    if (rejectCookies) {
        rejectCookies.addEventListener('click', () => {
            localStorage.setItem(consentKey, 'rejected');
            applyConsent('rejected');
        });
    }

    // Cross-Tab Synchronization: Automatically hide cookie banner across all open tabs once user decides
    window.addEventListener('storage', (e) => {
        if (e.key === consentKey) {
            applyConsent(e.newValue);
        }
    });
}

// Pre-quiz Name Modal Logic
let pendingQuizId = null;
const nameModal = document.getElementById('nameModal');
const userNameInput = document.getElementById('userNameInput');
const cancelNameBtn = document.getElementById('cancelNameBtn');
const startQuizBtn = document.getElementById('startQuizBtn');
const userNameKey = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.userName : 'techquizai_user_name';
const defaultUser = (typeof CONFIG !== 'undefined' && CONFIG.defaults) ? CONFIG.defaults.userName : 'Learner';

function openNameModal(quizId) {
    pendingQuizId = quizId;
    const existingName = localStorage.getItem(userNameKey) || '';
    if (userNameInput) userNameInput.value = existingName;
    if (nameModal) {
        nameModal.classList.remove('hidden');
        setTimeout(() => userNameInput && userNameInput.focus(), 100);
    }
}

function closeNameModal() {
    if (nameModal) nameModal.classList.add('hidden');
    pendingQuizId = null;
}

function proceedToQuiz() {
    const targetQuizId = pendingQuizId;
    const enteredName = (userNameInput ? userNameInput.value.trim() : '') || defaultUser;
    localStorage.setItem(userNameKey, enteredName);
    closeNameModal();
    if (targetQuizId) {
        sessionStorage.setItem('techquizai_current_quiz', targetQuizId);
        window.location.href = `quiz.html?id=${targetQuizId}`;
    }
}

if (cancelNameBtn) cancelNameBtn.addEventListener('click', closeNameModal);
if (startQuizBtn) startQuizBtn.addEventListener('click', proceedToQuiz);
if (userNameInput) {
    userNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') proceedToQuiz();
    });
}

// Keyboard modal dismissal accessibility (Escape key)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (nameModal && !nameModal.classList.contains('hidden')) closeNameModal();
        if (signupModal && !signupModal.classList.contains('hidden')) signupModal.classList.add('hidden');
    }
});

// Quiz card click & keyboard Enter handler
const quizGrid = document.getElementById('quizGrid');
if (quizGrid) {
    quizGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const quizId = btn.dataset.id;

        if (action === 'start' || action === 'retake') {
            openNameModal(quizId);
        } else if (action === 'certificate') {
            const savedName = localStorage.getItem(userNameKey) || defaultUser;
            generateCertificate(10, savedName);
        }
    });

    quizGrid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const card = e.target.closest('.quiz-card:not(.disabled)');
            if (card) {
                const quizId = card.dataset.id;
                if (quizId) openNameModal(quizId);
            }
        }
    });
}

// Sign Up / Contact Us Modal Logic (Netlify Form & Optional Google Form Sync)
const signUpBtn = document.getElementById('signUpBtn');
const contactUsBtn = document.getElementById('contactUsBtn');
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const cancelSignupBtn = document.getElementById('cancelSignupBtn');
const signupSuccess = document.getElementById('signupSuccess');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

function openSignupModal() {
    if (signupForm) {
        signupForm.reset();
        signupForm.classList.remove('hidden');
        signupForm.style.display = 'block';
    }
    if (signupSuccess) {
        signupSuccess.classList.add('hidden');
        signupSuccess.style.display = 'none';
    }
    if (signupModal) signupModal.classList.remove('hidden');
}

if (signUpBtn) signUpBtn.addEventListener('click', openSignupModal);
if (contactUsBtn) contactUsBtn.addEventListener('click', openSignupModal);

if (cancelSignupBtn && signupModal) {
    cancelSignupBtn.addEventListener('click', () => {
        signupModal.classList.add('hidden');
    });
}

if (closeSuccessBtn && signupModal) {
    closeSuccessBtn.addEventListener('click', () => {
        signupModal.classList.add('hidden');
    });
}

if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);

        // 1. Instantly hide input form and show clean success screen inside modal
        if (signupForm) {
            signupForm.classList.add('hidden');
            signupForm.style.display = 'none';
        }
        if (signupSuccess) {
            signupSuccess.classList.remove('hidden');
            signupSuccess.style.display = 'block';
        }

        // 2. Submit to Netlify Forms endpoint via AJAX
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).catch(() => {});

        // 3. Submit behind-the-scenes to Google Forms
        const googleFormUrl = (typeof CONFIG !== 'undefined' && CONFIG.urls) ? CONFIG.urls.googleFormUrl : null;
        if (googleFormUrl) {
            fetch(googleFormUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).catch(() => {});
        }
    });
}
