// Dynamic Quiz Engine with Answer Hashing & Option Randomization

let quizTitle = 'AWS Basics';
let quizId = 'aws-basics';
let questions = [];
let currentIndex = 0;
let userAnswers = [];
let submitted = false;

const userNameKey = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.userName : 'techquizai_user_name';
const attemptsPrefix = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.attemptsPrefix : 'techquizai_attempts_';
const defaultUser = (typeof CONFIG !== 'undefined' && CONFIG.defaults) ? CONFIG.defaults.userName : 'Learner';
const themeKey = (typeof CONFIG !== 'undefined' && CONFIG.storageKeys) ? CONFIG.storageKeys.theme : 'theme';
const savedTheme = localStorage.getItem(themeKey) || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// SHA-256 browser hashing for obfuscated answer verification
async function sha256(str) {
    const textBuf = new TextEncoder().encode(str.trim());
    if (window.crypto && window.crypto.subtle) {
        const hashBuf = await window.crypto.subtle.digest('SHA-256', textBuf);
        return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(16);
}

// Fisher-Yates array shuffle for option randomization
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function getQuizIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || sessionStorage.getItem('techquizai_current_quiz') || 'aws-basics';
}

// Browser-side Markdown Quiz parser fallback
async function parseMarkdownQuizClient(mdContent) {
    const frontmatterMatch = mdContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) return null;

    const yamlBlock = frontmatterMatch[1];
    const metadata = {};
    yamlBlock.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value = parts.slice(1).join(':').trim();
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            metadata[key] = value;
        }
    });

    const body = mdContent.slice(frontmatterMatch[0].length);
    const questionBlocks = body.split(/### Question \d+/i).filter(b => b.trim());
    const parsedQuestions = [];

    for (let index = 0; index < questionBlocks.length; index++) {
        const block = questionBlocks[index];
        const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let difficulty = 'easy';
        let questionText = '';
        const options = [];
        let correctAnswerText = null;
        let hint = '';

        lines.forEach(line => {
            if (line.toLowerCase().startsWith('difficulty:')) {
                difficulty = line.split(':')[1].trim().toLowerCase();
            } else if (line.startsWith('> Hint:')) {
                hint = line.replace('> Hint:', '').trim();
            } else if (line.startsWith('- [')) {
                const isCorrect = line.startsWith('- [x]') || line.startsWith('- [X]');
                const optionText = line.replace(/- \[[xX\s]\]/, '').trim();
                options.push(optionText);
                if (isCorrect) correctAnswerText = optionText;
            } else if (!line.startsWith('#') && !line.startsWith('---')) {
                if (!questionText) questionText = line;
                else if (options.length === 0) questionText += ' ' + line;
            }
        });

        if (questionText && options.length >= 2 && correctAnswerText) {
            const answerHash = await sha256(correctAnswerText);
            parsedQuestions.push({
                id: index + 1,
                difficulty,
                text: questionText,
                options,
                answerHash,
                hint: hint || 'No hint available for this question.'
            });
        }
    }

    return {
        id: metadata.id,
        title: metadata.title,
        questions: parsedQuestions
    };
}

// Initialize quiz data from window.QUIZ_CATALOG, src/quizzes.json, or dynamic .md fetch
async function initQuiz() {
    quizId = getQuizIdFromUrl();

    let qData = null;

    if (typeof window !== 'undefined' && window.QUIZ_CATALOG && window.QUIZ_CATALOG.catalog && window.QUIZ_CATALOG.catalog[quizId]) {
        qData = window.QUIZ_CATALOG.catalog[quizId];
    } else {
        try {
            const res = await fetch('src/quizzes.json');
            if (res.ok) {
                const data = await res.json();
                if (data.catalog && data.catalog[quizId]) {
                    qData = data.catalog[quizId];
                }
            }
        } catch (err) {
            console.warn('Could not load src/quizzes.json via fetch:', err);
        }
    }

    // Dynamic runtime fallback across subfolders if catalog not available
    if (!qData || !qData.questions || qData.questions.length === 0) {
        const subfolders = ['AWS', 'AI', 'AZURE', 'GCP'];
        const mdFileName = quizId.toUpperCase().replace(/-/g, '_') + '.md';

        for (const folder of subfolders) {
            try {
                const mdRes = await fetch(`quizzes/${folder}/${mdFileName}`);
                if (mdRes.ok) {
                    const mdText = await mdRes.text();
                    qData = await parseMarkdownQuizClient(mdText);
                    if (qData && qData.questions && qData.questions.length > 0) break;
                }
            } catch (mdErr) {
                // Continue checking other folders
            }
        }
    }

    if (qData && qData.questions && qData.questions.length > 0) {
        quizTitle = qData.title || quizTitle;
        document.title = `${CONFIG ? CONFIG.appName : 'TechQuizAi'} - ${quizTitle}`;

        questions = qData.questions.map(q => ({
            ...q,
            options: shuffleArray(q.options)
        }));
    }

    if (questions.length === 0) {
        console.error(`No questions found for quiz ID: ${quizId}`);
        alert('Could not load quiz questions. Returning to dashboard.');
        window.location.href = 'index.html';
        return;
    }

    userAnswers = new Array(questions.length).fill(null);
    renderStack(0);
}

const cardStack = document.getElementById('cardStack');
const progressFill = document.getElementById('progressFill');
const quizCounter = document.getElementById('quizCounter');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const finishBtn = document.getElementById('finishBtn');
const submitModal = document.getElementById('submitModal');
const resultsScreen = document.getElementById('resultsScreen');
const exitBtn = document.getElementById('exitBtn');

function renderStack(index) {
    if (!cardStack) return;
    cardStack.innerHTML = '';

    for (let depth = 2; depth >= 0; depth--) {
        const qIndex = index + depth;
        if (qIndex >= questions.length) continue;

        const q = questions[qIndex];
        const card = document.createElement('div');
        card.className = `quiz-card card-stack-${depth}`;
        card.dataset.index = qIndex;

        card.innerHTML = `
      ${depth === 0 ? `
        <div class="swipe-badge badge-next">NEXT →</div>
        <div class="swipe-badge badge-prev">← BACK</div>
      ` : ''}
      <div class="card-header">
        <span class="difficulty-tag difficulty-${q.difficulty}">${q.difficulty}</span>
        ${depth === 0 ? `<button class="btn-card-hint" data-action="hint">💡 Hint</button>` : ''}
      </div>
      <div class="question-text">${q.text}</div>
      <div class="options-list">
        ${q.options.map((opt) => `
          <div class="option-item ${userAnswers[qIndex] === opt ? 'selected' : ''}">
            <span class="option-radio"></span>
            <span>${escapeHtml(opt)}</span>
          </div>
        `).join('')}
      </div>
      <div class="in-card-hint hidden">
        💡 <strong>Hint:</strong> ${q.hint}
      </div>
    `;

        cardStack.appendChild(card);

        if (depth === 0) {
            const optionEls = card.querySelectorAll('.option-item');
            optionEls.forEach((el, optIdx) => {
                const optText = q.options[optIdx];
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userAnswers[qIndex] = optText;
                    optionEls.forEach(o => o.classList.remove('selected'));
                    el.classList.add('selected');
                });
            });

            const hintBtn = card.querySelector('.btn-card-hint');
            const hintBox = card.querySelector('.in-card-hint');
            if (hintBtn && hintBox) {
                hintBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hintBox.classList.toggle('hidden');
                    hintBtn.classList.toggle('active');
                });
            }

            attachSwipe(card);
        }
    }

    updateControls();
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function updateControls() {
    if (progressFill) progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
    if (quizCounter) quizCounter.textContent = `${currentIndex + 1}/${questions.length}`;
    if (backBtn) backBtn.disabled = currentIndex === 0;

    if (currentIndex === questions.length - 1) {
        if (nextBtn) nextBtn.classList.add('hidden');
        if (finishBtn) finishBtn.classList.remove('hidden');
    } else {
        if (nextBtn) nextBtn.classList.remove('hidden');
        if (finishBtn) finishBtn.classList.add('hidden');
    }
}

function goNext() {
    if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderStack(currentIndex);
    }
}

function goBack() {
    if (currentIndex > 0) {
        currentIndex--;
        renderStack(currentIndex);
    }
}

if (nextBtn) nextBtn.addEventListener('click', goNext);
if (backBtn) backBtn.addEventListener('click', goBack);

if (exitBtn) {
    exitBtn.addEventListener('click', () => {
        if (confirm('Leave quiz? Your progress will be lost.')) {
            window.location.href = 'index.html';
        }
    });
}

function attachSwipe(card) {
    let startX = 0;
    let currentX = 0;
    let dragging = false;

    const badgeNext = card.querySelector('.badge-next');
    const badgePrev = card.querySelector('.badge-prev');
    const card1 = cardStack.querySelector('.card-stack-1');

    const onStart = (x) => {
        startX = x;
        dragging = true;
        card.classList.add('swiping');
    };

    const onMove = (x) => {
        if (!dragging) return;
        currentX = x - startX;
        const rotate = currentX * 0.08;

        card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

        if (currentX < -20 && currentIndex < questions.length - 1) {
            const opacity = Math.min(1, Math.abs(currentX + 20) / 70);
            if (badgeNext) badgeNext.style.opacity = opacity;
            if (badgePrev) badgePrev.style.opacity = 0;
        } else if (currentX > 20 && currentIndex > 0) {
            const opacity = Math.min(1, Math.abs(currentX - 20) / 70);
            if (badgePrev) badgePrev.style.opacity = opacity;
            if (badgeNext) badgeNext.style.opacity = 0;
        } else {
            if (badgeNext) badgeNext.style.opacity = 0;
            if (badgePrev) badgePrev.style.opacity = 0;
        }

        if (card1) {
            const dragProgress = Math.min(1, Math.abs(currentX) / 200);
            const nextScale = 0.94 + (dragProgress * 0.06);
            const nextY = 14 - (dragProgress * 14);
            card1.style.transform = `translateY(${nextY}px) scale(${nextScale})`;
            card1.style.opacity = `${0.8 + (dragProgress * 0.2)}`;
        }
    };

    const onEnd = () => {
        if (!dragging) return;
        dragging = false;
        card.classList.remove('swiping');

        if (currentX < -90 && currentIndex < questions.length - 1) {
            card.style.transform = '';
            card.classList.add('swipe-left');
            setTimeout(goNext, 250);
        } else if (currentX > 90 && currentIndex > 0) {
            card.style.transform = '';
            card.classList.add('swipe-right');
            setTimeout(goBack, 250);
        } else {
            card.style.transform = '';
            if (badgeNext) badgeNext.style.opacity = 0;
            if (badgePrev) badgePrev.style.opacity = 0;
            if (card1) {
                card1.style.transform = 'translateY(14px) scale(0.94)';
                card1.style.opacity = '0.8';
            }
        }
        currentX = 0;
    };

    card.addEventListener('touchstart', e => onStart(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchmove', e => onMove(e.touches[0].clientX), { passive: true });
    card.addEventListener('touchend', onEnd);

    card.addEventListener('mousedown', e => {
        if (e.target.closest('.option-item')) return;
        e.preventDefault();
        onStart(e.clientX);
    });

    const mouseMoveHandler = (e) => onMove(e.clientX);
    const mouseUpHandler = () => {
        onEnd();
        window.removeEventListener('mousemove', mouseMoveHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
    };

    card.addEventListener('mousedown', () => {
        window.addEventListener('mousemove', mouseMoveHandler);
        window.addEventListener('mouseup', mouseUpHandler);
    });
}

if (finishBtn) finishBtn.addEventListener('click', () => submitModal && submitModal.classList.remove('hidden'));
const cancelSubmit = document.getElementById('cancelSubmit');
if (cancelSubmit) cancelSubmit.addEventListener('click', () => submitModal && submitModal.classList.add('hidden'));

const confirmSubmit = document.getElementById('confirmSubmit');
if (confirmSubmit) {
    confirmSubmit.addEventListener('click', async () => {
        if (submitModal) submitModal.classList.add('hidden');
        submitted = true;
        await calculateAndShowResults();
    });
}

async function calculateAndShowResults() {
    let correctCount = 0;

    // Verify each user answer
    for (let i = 0; i < questions.length; i++) {
        const userChoice = userAnswers[i];
        if (userChoice) {
            let isCorrect = false;
            const q = questions[i];
            
            if (q.encodedAnswer) {
                try {
                    const decoded = atob(q.encodedAnswer);
                    isCorrect = (userChoice === decoded);
                } catch (e) {}
            } else if (q.answerHash) {
                const hash = await sha256(userChoice);
                isCorrect = (hash === q.answerHash);
            }
            
            if (isCorrect) correctCount++;
        }
    }

    const totalQ = questions.length;

    // DYNAMIC 50% PASSING LOGIC:
    // Passing criteria requires at least 50% correct answers (e.g. 5/10, 3/5, etc.)
    // Math.ceil ensures odd question counts (e.g. 5 questions) require 3/5 (60%) to pass.
    const passThreshold = Math.ceil(totalQ * 0.5);
    const isPassed = correctCount >= passThreshold;

    if (isPassed) {
        // Record completion status only when user achieves the minimum 50% passing score
        localStorage.setItem(`techquizai_completed_${quizId}`, 'true');
        localStorage.setItem(`techquizai_score_${quizId}`, correctCount);
    }

    const focusBg = document.querySelector('.quiz-focus-bg');
    if (focusBg) focusBg.classList.add('hidden');

    let html = '';

    let summaryHtml = '<div class="results-summary-list">';
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const userChoice = userAnswers[i] || 'No answer';
        let isCorrect = false;
        let correctText = '';
        
        if (q.encodedAnswer) {
            try {
                correctText = atob(q.encodedAnswer);
                if (userChoice) {
                    isCorrect = (userChoice === correctText);
                }
            } catch (e) {}
        } else if (q.answerHash && userChoice) {
            const hash = await sha256(userChoice);
            isCorrect = (hash === q.answerHash);
        }
        
        summaryHtml += `
            <div class="summary-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="summary-q">Q${i + 1}: ${escapeHtml(q.text)}</div>
                <div class="summary-a">
                    <div>Your answer: <span class="${isCorrect ? 'correct-text' : 'wrong-text'}">${escapeHtml(userChoice)}</span></div>
                    ${!isCorrect && correctText ? `<div>Correct answer: <span class="correct-text">${escapeHtml(correctText)}</span></div>` : ''}
                </div>
            </div>
        `;
    }
    summaryHtml += '</div>';

    // If user failed to achieve the 50% passing threshold
    if (!isPassed) {
        const storageKey = `${attemptsPrefix}${quizId}`;
        const attempts = parseInt(localStorage.getItem(storageKey) || '0') + 1;
        localStorage.setItem(storageKey, attempts);
        const remaining = Math.max(0, 3 - attempts);

        html = `
      <div class="results-icon">💪</div>
      <div class="results-title">Keep Practicing!</div>
      <div class="results-score">You scored ${correctCount}/${totalQ}</div>
      <div class="results-card">
        <p>Passing requires at least <strong>50% (${passThreshold}/${totalQ} correct answers)</strong>. Review the concepts and give it another shot!
        ${remaining > 0 ? `<br>You have <strong>${remaining} attempt${remaining === 1 ? '' : 's'}</strong> left.` : 'You\'ve used all your attempts for now.'}</p>
        ${summaryHtml}
      </div>
      ${remaining > 0 ? `<button class="btn-result-action btn-primary-result" onclick="location.reload()">Retake Quiz Now</button>` : ''}
      <button class="btn-result-action btn-secondary-result" onclick="window.location.href='index.html'">Back to Dashboard</button>
    `;
        if (resultsScreen) {
            resultsScreen.innerHTML = html;
            resultsScreen.classList.remove('hidden');
        }
        return;
    }

    // User achieved 50% or higher (Passed)
    const isPerfect = correctCount === totalQ;

    html = `
    <div class="results-icon" id="celebrationIcon">${isPerfect ? '🏆' : '🎉'}</div>
    <div class="results-title">${isPerfect ? 'Perfect Score!' : 'Congratulations! Passed!'}</div>
    <div class="results-score">You scored ${correctCount}/${totalQ} (${Math.round((correctCount / totalQ) * 100)}%)</div>
    <div class="results-card">
      <p>${isPerfect ? `Outstanding work! You've mastered ${quizTitle} completely.` : `Great effort! You scored more than 50% (${correctCount}/${totalQ}) and earned your certificate of completion for ${quizTitle}.`}</p>
      ${summaryHtml}
    </div>
    <button class="btn-result-action btn-primary-result" id="downloadCertBtn">📥 Download Certificate</button>
    <button class="btn-result-action btn-secondary-result" id="shareBtn">🔗 Share Achievement</button>
    <button class="btn-result-action btn-secondary-result" onclick="window.location.href='index.html'">Back to Dashboard</button>
  `;

    if (resultsScreen) {
        resultsScreen.innerHTML = html;
        resultsScreen.classList.remove('hidden');
    }

    const savedName = localStorage.getItem(userNameKey) || defaultUser;
    const certBtn = document.getElementById('downloadCertBtn');
    if (certBtn) certBtn.addEventListener('click', () => generateCertificate(correctCount, savedName, quizTitle));

    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', () => shareAchievement(correctCount, totalQ));

    launchConfetti();

    const celebrationIcon = document.getElementById('celebrationIcon');
    if (celebrationIcon) celebrationIcon.addEventListener('click', launchConfetti);
}

function launchConfetti() {
    const colors = ['#a78bfa', '#f0abfc', '#7c3aed', '#34d399', '#fbbf24', '#38bdf8', '#ef4444', '#10b981'];

    // Spawn 60 party popper confetti pieces shooting from bottom-left & bottom-right up to top-center
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            const isLeft = i % 2 === 0;
            piece.className = `confetti-piece ${isLeft ? 'popper-left' : 'popper-right'}`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            const size = Math.floor(Math.random() * 8) + 6;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            piece.style.borderRadius = Math.random() > 0.4 ? '50%' : '2px';

            // Arc parameters: throw towards top center, then flutter down
            const tx = (Math.random() * 25 + 15) * (isLeft ? 1 : -1);
            const ty = -(Math.random() * 25 + 60);
            const fallX = tx + (Math.random() * 16 - 8);
            const rot = (Math.random() * 720 - 360);

            piece.style.setProperty('--tx', `${tx}vw`);
            piece.style.setProperty('--ty', `${ty}vh`);
            piece.style.setProperty('--fall-x', `${fallX}vw`);
            piece.style.setProperty('--rot', `${rot}deg`);

            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 3400);
        }, i * 20);
    }
}

function shareAchievement(score, total) {
    const appName = CONFIG ? CONFIG.appName : 'TechQuizAi';
    const shareText = `I just scored ${score}/${total} on the ${quizTitle} quiz on @${appName}! 🎉`;
    const shareUrl = window.location.origin + window.location.pathname.replace('quiz.html', 'index.html');

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);

    if (isMobile && navigator.share) {
        navigator.share({
            title: `${appName} Achievement`,
            text: shareText,
            url: shareUrl
        }).catch(() => {
            showShareMenu(shareText, shareUrl);
        });
    } else {
        showShareMenu(shareText, shareUrl);
    }
}

function showShareMenu(text, url) {
    const existing = document.getElementById('shareMenu');
    if (existing) existing.remove();

    const menu = document.createElement('div');
    menu.id = 'shareMenu';
    menu.className = 'share-menu-overlay';
    menu.innerHTML = `
    <div class="share-menu-box">
      <h3>Share your achievement</h3>
      <div class="share-options">
        <button class="share-opt" data-platform="linkedin"><i class="fa-brands fa-linkedin"></i> LinkedIn</button>
        <button class="share-opt" data-platform="x"><i class="fa-brands fa-x-twitter"></i> Twitter</button>
        <button class="share-opt" data-platform="native"><i class="fa-solid fa-share-nodes"></i> More Apps</button>
        <button class="share-opt" data-platform="copy"><i class="fa-solid fa-link"></i> Copy Link</button>
      </div>
      <button class="share-close" id="closeShareMenu">Cancel</button>
    </div>
  `;
    document.body.appendChild(menu);

    menu.querySelectorAll('.share-opt').forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            handleShare(platform, text, url);
            menu.remove();
        });
    });

    const closeBtn = document.getElementById('closeShareMenu');
    if (closeBtn) closeBtn.addEventListener('click', () => menu.remove());
}

function handleShare(platform, text, url) {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
        case 'native':
            if (navigator.share) {
                navigator.share({ title: 'TechQuizAi Achievement', text, url }).catch(() => { });
            } else {
                copyToClipboard(`${text} ${url}`);
            }
            break;
        case 'linkedin': {
            const linkedInWebUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            const linkedInAppUrl = `linkedin://shareArticle?mini=true&url=${encodedUrl}`;
            openWithAppFallback(linkedInAppUrl, linkedInWebUrl);
            break;
        }
        case 'x': {
            const twitterWebUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
            const twitterAppUrl = `twitter://post?message=${encodedText} ${encodedUrl}`;
            openWithAppFallback(twitterAppUrl, twitterWebUrl);
            break;
        }
        case 'copy':
            copyToClipboard(`${text} ${url}`);
            break;
    }
}

function openWithAppFallback(appUrl, webUrl) {
    const start = Date.now();
    // Attempt to open the native app URI scheme
    window.location.href = appUrl;
    
    // Set a timeout to fallback to the web URL if the app doesn't open
    setTimeout(() => {
        // If the app successfully launched, the browser should have backgrounded 
        // and paused execution. If Date.now() is close to the timeout duration, 
        // it means we are still in the browser and the app launch failed.
        if (Date.now() - start < 1500) {
            window.open(webUrl, '_blank');
        }
    }, 1000);
}

function copyToClipboard(fullText) {
    navigator.clipboard.writeText(fullText).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Could not copy automatically. Here is your share text:\n\n' + fullText);
    });
}

initQuiz();
