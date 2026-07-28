// Sample AWS Basics questions
const questions = [
    { id: 1, difficulty: 'easy', text: 'What does IAM stand for?', options: ['Identity and Access Management', 'Internal Application Model', 'Internet Access Module', 'Integrated Auth Mechanism'], correct: 0, hint: 'It controls who can do what in your AWS account.' },
    { id: 2, difficulty: 'easy', text: 'Which AWS service is used for object storage?', options: ['EC2', 'S3', 'RDS', 'Lambda'], correct: 1, hint: 'Think "buckets" of files.' },
    { id: 3, difficulty: 'easy', text: 'What does EC2 stand for?', options: ['Elastic Compute Cloud', 'Enterprise Cloud Center', 'External Compute Cluster', 'Elastic Container Cloud'], correct: 0, hint: 'It\'s about renting virtual servers.' },
    { id: 4, difficulty: 'easy', text: 'Which service is a managed relational database?', options: ['DynamoDB', 'S3', 'RDS', 'CloudFront'], correct: 2, hint: 'Think MySQL, PostgreSQL, hosted by AWS.' },
    { id: 5, difficulty: 'easy', text: 'What is a VPC?', options: ['A billing tool', 'A virtual private network in AWS', 'A type of storage', 'A monitoring service'], correct: 1, hint: 'It\'s your own isolated network inside AWS.' },
    { id: 6, difficulty: 'easy', text: 'Which AWS service delivers content via a CDN?', options: ['CloudFront', 'CloudWatch', 'CloudTrail', 'CloudFormation'], correct: 0, hint: 'Think fast content delivery to users worldwide.' },
    { id: 7, difficulty: 'medium', text: 'What is the default limit on VPCs per region?', options: ['3', '5', '10', 'Unlimited'], correct: 1, hint: 'It\'s a soft limit you can request to increase.' },
    { id: 8, difficulty: 'medium', text: 'Which storage class is cheapest for rarely accessed data?', options: ['S3 Standard', 'S3 Glacier', 'S3 Intelligent-Tiering', 'S3 One Zone-IA'], correct: 1, hint: 'Think long-term archival storage.' },
    { id: 9, difficulty: 'medium', text: 'What does an IAM policy attached to a role define?', options: ['Billing limits', 'Permissions', 'Network speed', 'Storage size'], correct: 1, hint: 'It\'s about what actions are allowed or denied.' },
    { id: 10, difficulty: 'hard', text: 'In S3, what consistency model applies to all operations as of Dec 2020?', options: ['Eventual consistency only', 'Strong read-after-write consistency', 'No consistency guarantee', 'Weak consistency'], correct: 1, hint: 'AWS made a major consistency announcement for S3.' }
];

let currentIndex = 0;
let userAnswers = new Array(questions.length).fill(null);
let submitted = false;

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
    cardStack.innerHTML = '';

    // Render up to 3 stacked cards (depth 2, 1, 0)
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
        ${q.options.map((opt, i) => `
          <div class="option-item ${userAnswers[qIndex] === i ? 'selected' : ''}" data-option="${i}">
            <span class="option-radio"></span>
            <span>${opt}</span>
          </div>
        `).join('')}
      </div>
      <div class="in-card-hint hidden">
        💡 <strong>Hint:</strong> ${q.hint}
      </div>
    `;

        cardStack.appendChild(card);

        // Bind interactive events only for top card (depth 0)
        if (depth === 0) {
            card.querySelectorAll('.option-item').forEach(el => {
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userAnswers[qIndex] = parseInt(el.dataset.option);
                    card.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
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

function updateControls() {
    progressFill.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;
    quizCounter.textContent = `${currentIndex + 1}/${questions.length}`;
    backBtn.disabled = currentIndex === 0;

    if (currentIndex === questions.length - 1) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
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

nextBtn.addEventListener('click', goNext);
backBtn.addEventListener('click', goBack);

exitBtn.addEventListener('click', () => {
    if (confirm('Leave quiz? Your progress will be lost.')) {
        window.location.href = 'index.html';
    }
});

// Tinder Swipe Gestures with smooth card deck feedback
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

        // Update Tinder directional badges
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

        // Scale background card 1 up slightly as top card moves
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
        // Prevent drag on option clicks
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

// Finish / Submit flow
finishBtn.addEventListener('click', () => {
    submitModal.classList.remove('hidden');
});

document.getElementById('cancelSubmit').addEventListener('click', () => {
    submitModal.classList.add('hidden');
});

document.getElementById('confirmSubmit').addEventListener('click', () => {
    submitModal.classList.add('hidden');
    submitted = true;
    calculateAndShowResults();
});

function calculateAndShowResults() {
    const correctCount = questions.reduce((acc, q, i) => acc + (userAnswers[i] === q.correct ? 1 : 0), 0);

    document.querySelector('.quiz-focus-bg').classList.add('hidden');

    let html = '';

    if (correctCount === 0) {
        const attempts = parseInt(localStorage.getItem('techquizai_attempts_aws-basics') || '0') + 1;
        localStorage.setItem('techquizai_attempts_aws-basics', attempts);
        const remaining = Math.max(0, 3 - attempts);

        html = `
      <div class="results-icon">💪</div>
      <div class="results-title">Don't Give Up!</div>
      <div class="results-score">You scored ${correctCount}/10</div>
      <div class="results-card">
        <p>Everyone starts somewhere. Review the concepts and give it another shot.
        ${remaining > 0 ? `You have <strong>${remaining} attempt${remaining === 1 ? '' : 's'}</strong> left.` : 'You\'ve used all your attempts for now.'}</p>
      </div>
      ${remaining > 0 ? `<button class="btn-result-action btn-primary-result" onclick="location.reload()">Retake Quiz Now</button>` : ''}
      <button class="btn-result-action btn-secondary-result" onclick="window.location.href='index.html'">Back to Dashboard</button>
    `;
        resultsScreen.innerHTML = html;
        resultsScreen.classList.remove('hidden');
        return; // no confetti, no certificate for 0 correct
    }

    // 1-10 correct: everyone gets a certificate, confetti fires for all passing scores
    const isPerfect = correctCount === 10;

    html = `
    <div class="results-icon" id="celebrationIcon">${isPerfect ? '🏆' : '🎉'}</div>
    <div class="results-title">${isPerfect ? 'Perfect Score!' : 'Congratulations!'}</div>
    <div class="results-score">You scored ${correctCount}/10</div>
    <div class="results-card">
      <p>${isPerfect ? 'Outstanding work! You\'ve mastered AWS Basics completely.' : 'Great effort! You\'ve earned your certificate of completion for AWS Basics.'}</p>
    </div>
    <button class="btn-result-action btn-primary-result" id="downloadCertBtn">📥 Download Certificate</button>
    <button class="btn-result-action btn-secondary-result" id="shareBtn">🔗 Share Achievement</button>
    <button class="btn-result-action btn-secondary-result" onclick="window.location.href='index.html'">Back to Dashboard</button>
  `;

    resultsScreen.innerHTML = html;
    resultsScreen.classList.remove('hidden');

    // Wire up the now-visible buttons
    const userName = localStorage.getItem('techquizai_user_name') || 'Learner';
    document.getElementById('downloadCertBtn').addEventListener('click', () => generateCertificate(correctCount, userName));
    document.getElementById('shareBtn').addEventListener('click', () => shareAchievement(correctCount));

    // Confetti fires for ANY passing score (1-10), not just perfect
    launchConfetti();

    // Let user replay the celebration by tapping the icon, any number of times
    document.getElementById('celebrationIcon').addEventListener('click', () => {
        launchConfetti();
    });
}

function launchConfetti() {
    const colors = ['#a78bfa', '#f0abfc', '#7c3aed', '#34d399', '#fbbf24'];

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            const fromLeft = i % 2 === 0;
            piece.className = `confetti-piece ${fromLeft ? 'confetti-left' : 'confetti-right'}`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.width = (Math.random() * 6 + 6) + 'px';
            piece.style.height = piece.style.width;
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            piece.style.setProperty('--burst-x', (Math.random() * 40 + 30) + 'vw');
            document.body.appendChild(piece);
            setTimeout(() => piece.remove(), 3200);
        }, i * 15);
    }
}

// Share functionality - triggers native mobile share sheet automatically on mobile
function shareAchievement(score) {
    const shareText = `I just scored ${score}/10 on the AWS Basics quiz on @TechQuizAi! 🎉`;
    const shareUrl = window.location.origin + window.location.pathname.replace('quiz.html', 'index.html');

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);

    if (isMobile && navigator.share) {
        navigator.share({
            title: 'TechQuizAi Achievement',
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

    document.getElementById('closeShareMenu').addEventListener('click', () => menu.remove());
}

function handleShare(platform, text, url) {
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
        case 'native':
            // Wrapped safely, some mobile browsers throw on cancel/unsupported context
            if (navigator.share) {
                navigator.share({ title: 'techquizaiAi Achievement', text, url }).catch(() => { });
            } else {
                copyToClipboard(`${text} ${url}`);
            }
            break;
        case 'linkedin':
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
            break;
        case 'x':
            window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
            break;
        case 'copy':
            copyToClipboard(`${text} ${url}`);
            break;
    }
}

function copyToClipboard(fullText) {
    navigator.clipboard.writeText(fullText).then(() => {
        alert('Link copied to clipboard!');
    }).catch(() => {
        alert('Could not copy automatically. Here is your share text:\n\n' + fullText);
    });
}

// Init
renderStack(0);