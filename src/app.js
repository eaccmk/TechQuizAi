// TechQuizAi Dashboard Application Logic

document.addEventListener('DOMContentLoaded', () => {
    if (typeof CONFIG !== 'undefined') {
        const logoText = document.getElementById('logoText');
        const logoIcon = document.getElementById('logoIcon');
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const footerCopyright = document.getElementById('footerCopyright');

        if (logoText) {
            // Keep the (v3) markup in index.html, update app name if needed but preserve HTML structure
            const v3Node = logoText.querySelector('span');
            logoText.firstChild.textContent = CONFIG.appName + ' ';
        }
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
    'AI Foundations',
    'Google Cloud Platform (GCP)',
    'Azure Cloud & DevOps',
    'QA / SDET'
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
        <div class="quiz-card-top-actions" style="display: flex; gap: 8px; align-items: center; position: relative;">
          ${isCompleted
            ? '<span class="badge-completed" aria-label="Status: Completed">✓ Completed</span>'
            : (!quiz.available ? '<span class="badge-coming-soon" aria-label="Status: Coming Soon">⏳ Coming Soon</span>' : '')}
          ${quiz.available ? `<button class="btn-share-icon" data-action="share" data-id="${quiz.id}" aria-label="Share ${escapeHtml(quiz.title)}" title="Share Quiz" style="order: 2;"><i class="fa-solid fa-share-nodes"></i></button>` : ''}
        </div>
      </div>
      <h3 class="quiz-title">${escapeHtml(quiz.title)}</h3>
      <p class="quiz-subtitle">${escapeHtml(quiz.subtitle)}</p>
      <div class="quiz-meta">
        <span class="quiz-questions">${quiz.questions} Questions</span>
        ${!quiz.available
            ? `<button class="btn-disabled" disabled aria-disabled="true">Coming Soon</button>`
            : (isCompleted
                ? `<div class="completed-actions">
                     <button class="btn-certificate" data-action="certificate" data-id="${quiz.id}" aria-label="Download Certificate: ${escapeHtml(quiz.title)}"><i class="fa-solid fa-award"></i> Certificate</button>
                     <button class="btn-start" data-action="retake" data-id="${quiz.id}" aria-label="Retake Quiz: ${escapeHtml(quiz.title)}">Retake Quiz</button>
                   </div>`
                : `<button class="btn-start" data-action="start" data-id="${quiz.id}" aria-label="Start Quiz: ${escapeHtml(quiz.title)}">Start Quiz</button>`)}
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

        // Sort: available (live) first, then alphabetical by title
        catQuizzes.sort((a, b) => {
            if (a.available !== b.available) {
                return a.available ? -1 : 1;
            }
            return a.title.localeCompare(b.title);
        });

        const headingId = `cat-${catName.replace(/[^a-zA-Z0-9]/g, '')}`;
        html += `
        <section class="category-block" aria-labelledby="${headingId}">
            <div class="category-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <div class="header-left">
                    <i class="fa-solid fa-chevron-down toggle-icon"></i>
                    <h2 id="${headingId}">${escapeHtml(catName)} <span style="font-size: 16px; font-weight: 500; opacity: 0.7; margin-left: 6px;">(${catQuizzes.length})</span></h2>
                </div>
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

const closeNameModalBtn = document.getElementById('closeNameModalBtn');
if (closeNameModalBtn) closeNameModalBtn.addEventListener('click', closeNameModal);
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
        } else if (action === 'share') {
            e.stopPropagation();
            const shareUrl = window.location.origin + window.location.pathname.replace('index.html', '') + 'quiz.html?id=' + quizId + '&ref=TechQuizAi-tile';

            navigator.clipboard.writeText(shareUrl).then(() => {
                const tooltip = document.createElement('div');
                tooltip.className = 'share-tooltip';
                tooltip.textContent = 'Link copied to clipboard!';

                // Remove any existing tooltips on this button
                const existing = btn.parentNode.querySelectorAll('.share-tooltip');
                existing.forEach(t => t.remove());

                btn.parentNode.appendChild(tooltip);

                // Trigger animation
                requestAnimationFrame(() => {
                    tooltip.classList.add('show');
                });

                setTimeout(() => {
                    tooltip.classList.remove('show');
                    setTimeout(() => tooltip.remove(), 300);
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy share link: ', err);
            });

            if (window.gtag) {
                gtag('event', 'quiz_shared', { quiz_id: quizId });
            } else if (window.dataLayer) {
                window.dataLayer.push({
                    event: 'quiz_shared',
                    quiz_id: quizId
                });
            }
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

// Passwordless Email OTP Authentication Logic
const authHeaderContainer = document.getElementById('authHeaderContainer');
const authModal = document.getElementById('authModal');
const authEmail = document.getElementById('authEmail');
const cancelAuthBtn = document.getElementById('cancelAuthBtn');
const requestOtpBtn = document.getElementById('requestOtpBtn');

const otpModal = document.getElementById('otpModal');
const otpInputGroup = document.getElementById('otpInputGroup');
const otpErrorText = document.getElementById('otpErrorText');
const sentOtpEmailHighlight = document.getElementById('sentOtpEmailHighlight');
const cancelOtpBtn = document.getElementById('cancelOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');

const profileModal = document.getElementById('profileModal');
const profileEmailVal = document.getElementById('profileEmailVal');
const profileStatusVal = document.getElementById('profileStatusVal');
const profileLoginVal = document.getElementById('profileLoginVal');
const closeProfileBtn = document.getElementById('closeProfileBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');

// Base64 helper to obfuscate payloads traversing the network logs in clear text
function obfuscate(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

function updateAuthUI() {
    const token = localStorage.getItem('techquizai_auth_token');
    const userJson = localStorage.getItem('techquizai_auth_user');

    if (token && userJson) {
        try {
            const user = JSON.parse(userJson);
            authHeaderContainer.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="auth-profile-badge" style="cursor: pointer;" id="headerProfileBtn">
                        <i class="fa-solid fa-user-check"></i>
                        <span class="auth-user-email">${user.email}</span>
                    </div>
                    <button class="btn-signout" id="headerSignOutBtn">Sign Out</button>
                </div>
            `;
            
            // Wire profile and signout click events
            document.getElementById('headerProfileBtn').addEventListener('click', openProfileModal);
            document.getElementById('headerSignOutBtn').addEventListener('click', handleSignOut);
        } catch (e) {
            console.error('Error rendering auth UI state:', e);
            handleSignOut();
        }
    } else {
        authHeaderContainer.innerHTML = `
            <button class="btn-signup" id="signUpBtn">Sign In</button>
        `;
        document.getElementById('signUpBtn').addEventListener('click', () => {
            if (authModal) authModal.classList.remove('hidden');
        });
    }
}

// Request OTP Flow
async function handleRequestOtp() {
    const email = authEmail.value.trim();
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    requestOtpBtn.disabled = true;
    requestOtpBtn.textContent = 'Sending...';

    try {
        const payload = obfuscate(email);
        const response = await fetch('/api/request-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            sentOtpEmailHighlight.textContent = email;
            if (authModal) authModal.classList.add('hidden');
            if (otpModal) {
                otpModal.classList.remove('hidden');
                // Focus first OTP box
                const firstBox = otpInputGroup.querySelector('input');
                if (firstBox) firstBox.focus();
            }
        } else {
            alert(data.error || 'Failed to dispatch passcode.');
        }
    } catch (err) {
        console.error('Request OTP request exception:', err);
        alert('Network or server connection error.');
    } finally {
        requestOtpBtn.disabled = false;
        requestOtpBtn.textContent = 'Send Code';
    }
}

// Verify OTP Flow
async function handleVerifyOtp() {
    const email = authEmail.value.trim();
    const boxes = otpInputGroup.querySelectorAll('input');
    let otp = '';
    boxes.forEach(box => {
        otp += box.value.trim();
    });

    if (otp.length !== 6) {
        otpErrorText.textContent = 'Please enter all 6 digits.';
        otpErrorText.style.display = 'block';
        return;
    }

    verifyOtpBtn.disabled = true;
    verifyOtpBtn.textContent = 'Verifying...';
    otpErrorText.style.display = 'none';

    try {
        const rawPayload = `${email}:${otp}`;
        const payload = obfuscate(rawPayload);

        const response = await fetch('/api/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payload })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save authentication details in LocalStorage
            localStorage.setItem('techquizai_auth_token', data.token);
            localStorage.setItem('techquizai_auth_user', JSON.stringify(data.user));

            // Merge authenticated profile metadata into our existing state engine
            // If the user's name is not yet set or is generic, set it to the username prefix of the email
            const currentSavedName = localStorage.getItem(userNameKey);
            if (!currentSavedName || currentSavedName === 'Learner') {
                const calculatedName = email.split('@')[0];
                localStorage.setItem(userNameKey, calculatedName);
            }

            if (otpModal) otpModal.classList.add('hidden');
            
            // Clear input fields
            boxes.forEach(box => { box.value = ''; });
            authEmail.value = '';

            updateAuthUI();
        } else {
            otpErrorText.textContent = data.error || 'Verification failed.';
            otpErrorText.style.display = 'block';
        }
    } catch (err) {
        console.error('Verify OTP request exception:', err);
        otpErrorText.textContent = 'Network or server connection error.';
        otpErrorText.style.display = 'block';
    } finally {
        verifyOtpBtn.disabled = false;
        verifyOtpBtn.textContent = 'Verify & Login';
    }
}

// Sign Out
function handleSignOut() {
    localStorage.removeItem('techquizai_auth_token');
    localStorage.removeItem('techquizai_auth_user');
    // We retain techquizai_user_name or quiz progress so we don't break existing data model stats,
    // but the session is invalidated.
    updateAuthUI();
}

// Account Deletion
async function handleDeleteAccount() {
    const confirmDelete = confirm('Are you sure you want to permanently delete your account? This will hard-delete your user record immediately and wipe all session states.');
    if (!confirmDelete) return;

    const token = localStorage.getItem('techquizai_auth_token');
    const userJson = localStorage.getItem('techquizai_auth_user');
    if (!token || !userJson) return;

    try {
        const user = JSON.parse(userJson);
        const payload = obfuscate(user.email);

        deleteAccountBtn.disabled = true;
        deleteAccountBtn.textContent = 'Deleting...';

        const response = await fetch('/api/delete-account', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ payload })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Your account profile has been hard deleted successfully.');
            // Wipe session and name states
            localStorage.removeItem('techquizai_auth_token');
            localStorage.removeItem('techquizai_auth_user');
            localStorage.removeItem(userNameKey);
            
            if (profileModal) profileModal.classList.add('hidden');
            updateAuthUI();
        } else {
            alert(data.error || 'Failed to complete deletion.');
        }
    } catch (err) {
        console.error('Delete account request exception:', err);
        alert('Server connection error. Failed to delete account.');
    } finally {
        deleteAccountBtn.disabled = false;
        deleteAccountBtn.textContent = 'Delete Account';
    }
}

// Open profile details modal
function openProfileModal() {
    const userJson = localStorage.getItem('techquizai_auth_user');
    if (!userJson) return;
    try {
        const user = JSON.parse(userJson);
        profileEmailVal.textContent = user.email;
        profileStatusVal.textContent = user.status || 'REPEAT';
        profileLoginVal.textContent = user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A';
        
        if (profileModal) profileModal.classList.remove('hidden');
    } catch (e) {
        console.error('Profile info display error:', e);
    }
}

// Setup input key listeners and auto-pasting inside the 6 OTP input boxes
function setupOtpInputs() {
    const boxes = otpInputGroup.querySelectorAll('input');
    
    boxes.forEach((box, index) => {
        // Automatically focus next box when digit is typed
        box.addEventListener('input', (e) => {
            const val = box.value;
            if (val.length === 1 && index < boxes.length - 1) {
                boxes[index + 1].focus();
            }
        });

        // Backspace goes to previous box
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && box.value.length === 0 && index > 0) {
                boxes[index - 1].focus();
            }
        });

        // Add auto-paste handler on all boxes (with click first-box recognition support)
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text').trim();
            if (/^\d{6}$/.test(text)) {
                // Populate all boxes starting from the first
                for (let i = 0; i < 6; i++) {
                    boxes[i].value = text[i];
                }
                // Focus the last input box
                boxes[5].focus();
            }
        });
    });
}

// Attach event handlers on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    setupOtpInputs();

    if (cancelAuthBtn) cancelAuthBtn.addEventListener('click', () => {
        if (authModal) authModal.classList.add('hidden');
    });

    if (requestOtpBtn) requestOtpBtn.addEventListener('click', handleRequestOtp);

    if (cancelOtpBtn) cancelOtpBtn.addEventListener('click', () => {
        if (otpModal) otpModal.classList.add('hidden');
        if (authModal) authModal.classList.remove('hidden');
    });

    if (verifyOtpBtn) verifyOtpBtn.addEventListener('click', handleVerifyOtp);

    if (closeProfileBtn) closeProfileBtn.addEventListener('click', () => {
        if (profileModal) profileModal.classList.add('hidden');
    });

    if (deleteAccountBtn) deleteAccountBtn.addEventListener('click', handleDeleteAccount);

    // Escape listener dismisses auth modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (authModal && !authModal.classList.contains('hidden')) authModal.classList.add('hidden');
            if (otpModal && !otpModal.classList.contains('hidden')) otpModal.classList.add('hidden');
            if (profileModal && !profileModal.classList.contains('hidden')) profileModal.classList.add('hidden');
            if (contactModal && !contactModal.classList.contains('hidden')) contactModal.classList.add('hidden');
        }
    });
});

// Contact Us Modal Logic with Email Verification & Form Handling
const contactUsBtn = document.getElementById('contactUsBtn');
const contactModal = document.getElementById('contactModal');
const contactForm = document.getElementById('contactForm');
const contactEmail = document.getElementById('contactEmail');
const cancelContactBtn = document.getElementById('cancelContactBtn');
const contactSuccess = document.getElementById('contactSuccess');
const closeContactSuccessBtn = document.getElementById('closeContactSuccessBtn');

// Standard RFC 5322 email validation regex helper
function isValidEmail(emailStr) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(emailStr);
}

if (contactUsBtn) {
    contactUsBtn.addEventListener('click', () => {
        if (contactForm) {
            contactForm.reset();
            contactForm.style.display = 'block';
            contactForm.classList.remove('hidden');
        }
        if (contactSuccess) {
            contactSuccess.style.display = 'none';
            contactSuccess.classList.add('hidden');
        }
        if (contactModal) contactModal.classList.remove('hidden');
    });
}

if (cancelContactBtn && contactModal) {
    cancelContactBtn.addEventListener('click', () => {
        contactModal.classList.add('hidden');
    });
}

if (closeContactSuccessBtn && contactModal) {
    closeContactSuccessBtn.addEventListener('click', () => {
        contactModal.classList.add('hidden');
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = contactEmail.value.trim();

        // Perform strict email format verification
        if (!isValidEmail(emailVal)) {
            alert('Please enter a valid email address (e.g. you@example.com).');
            contactEmail.focus();
            return;
        }

        // Hide form fields and display clean success message
        contactForm.style.display = 'none';
        contactForm.classList.add('hidden');
        if (contactSuccess) {
            contactSuccess.style.display = 'block';
            contactSuccess.classList.remove('hidden');
        }
    });
}

// Add format check inside Auth sign-in request-otp input trigger as well
if (requestOtpBtn) {
    // Override click event to check format before sending
    requestOtpBtn.removeEventListener('click', handleRequestOtp);
    requestOtpBtn.addEventListener('click', () => {
        const authEmailVal = authEmail.value.trim();
        if (!isValidEmail(authEmailVal)) {
            alert('Please enter a valid email address.');
            authEmail.focus();
            return;
        }
        handleRequestOtp();
    });
}


