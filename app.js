// Quiz data - AWS Fundamentals (AWS Basics active for MVP)
const quizzes = [
    {
        id: 'aws-basics',
        icon: '🪣',
        title: 'AWS Basics',
        subtitle: 'Master the fundamentals of Amazon Web Services',
        questions: 10,
        completed: false,
        available: true
    },
    {
        id: 'iam-concepts',
        icon: '🔐',
        title: 'IAM Concepts',
        subtitle: 'Understand Identity and Access Management',
        questions: 10,
        completed: false,
        available: false
    },
    {
        id: 'ec2-compute',
        icon: '🖥️',
        title: 'EC2 & Compute',
        subtitle: 'Learn virtual servers and compute resources',
        questions: 10,
        completed: false,
        available: false
    },
    {
        id: 's3-storage',
        icon: '📦',
        title: 'S3 Storage',
        subtitle: 'Explore object storage and data management',
        questions: 10,
        completed: false,
        available: false
    },
    {
        id: 'vpc-networking',
        icon: '🌐',
        title: 'VPC & Networking',
        subtitle: 'Grasp cloud networking essentials',
        questions: 10,
        completed: false,
        available: false
    },
    {
        id: 'rds-databases',
        icon: '🗄️',
        title: 'RDS & Databases',
        subtitle: 'Understand managed database services',
        questions: 10,
        completed: false,
        available: false
    }
];

// Render quiz cards
function renderQuizzes(list) {
    const grid = document.getElementById('quizGrid');
    grid.innerHTML = list.map(quiz => `
    <div class="quiz-card ${!quiz.available ? 'disabled' : ''}" data-id="${quiz.id}">
      <div class="quiz-card-top">
        <span class="quiz-icon">${quiz.icon}</span>
        ${quiz.completed
            ? '<span class="badge-completed">✓ Completed</span>'
            : (!quiz.available ? '<span class="badge-coming-soon">⏳ Coming Soon</span>' : '')}
      </div>
      <div class="quiz-title">${quiz.title}</div>
      <div class="quiz-subtitle">${quiz.subtitle}</div>
      <div class="quiz-meta">
        <span class="quiz-questions">${quiz.questions} Questions</span>
        ${!quiz.available
            ? `<button class="btn-disabled" disabled>Coming Soon</button>`
            : (quiz.completed
                ? `<div class="completed-actions">
                     <button class="btn-retake" data-action="retake" data-id="${quiz.id}">Retake</button>
                     <button class="btn-certificate" data-action="certificate" data-id="${quiz.id}">📥 Certificate</button>
                   </div>`
                : `<button class="btn-start" data-action="start" data-id="${quiz.id}">Start Quiz</button>`)}
      </div>
    </div>
  `).join('');
}

renderQuizzes(quizzes);

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = quizzes.filter(q =>
        q.title.toLowerCase().includes(term) ||
        q.subtitle.toLowerCase().includes(term)
    );
    renderQuizzes(filtered);
});

// Dark mode toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', next);
});

// Cookie consent
const cookieBanner = document.getElementById('cookieBanner');
const consentStatus = localStorage.getItem('cookieConsent');

if (consentStatus) {
    cookieBanner.classList.add('hidden');
}

document.getElementById('acceptCookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'standard');
    cookieBanner.classList.add('hidden');
});

document.getElementById('rejectCookies').addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    cookieBanner.classList.add('hidden');
});

// Pre-quiz Name Modal Logic
let pendingQuizId = null;
const nameModal = document.getElementById('nameModal');
const userNameInput = document.getElementById('userNameInput');
const cancelNameBtn = document.getElementById('cancelNameBtn');
const startQuizBtn = document.getElementById('startQuizBtn');

function openNameModal(quizId) {
    pendingQuizId = quizId;
    const existingName = localStorage.getItem('techquizai_user_name') || '';
    userNameInput.value = existingName;
    nameModal.classList.remove('hidden');
    setTimeout(() => userNameInput.focus(), 100);
}

function closeNameModal() {
    nameModal.classList.add('hidden');
    pendingQuizId = null;
}

function proceedToQuiz() {
    const targetQuizId = pendingQuizId;
    const enteredName = userNameInput.value.trim() || 'Learner';
    localStorage.setItem('techquizai_user_name', enteredName);
    closeNameModal();
    if (targetQuizId) {
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

// Quiz card click handler
document.getElementById('quizGrid').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    const action = btn.dataset.action;
    const quizId = btn.dataset.id;

    if (action === 'start' || action === 'retake') {
        openNameModal(quizId);
    } else if (action === 'certificate') {
        const savedName = localStorage.getItem('techquizai_user_name') || 'Learner';
        generateCertificate(10, savedName);
    }
});

// Sign Up Modal Logic (Netlify Form compatible)
const signUpBtn = document.getElementById('signUpBtn');
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const cancelSignupBtn = document.getElementById('cancelSignupBtn');
const signupSuccess = document.getElementById('signupSuccess');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

if (signUpBtn && signupModal) {
    signUpBtn.addEventListener('click', () => {
        if (signupForm) signupForm.classList.remove('hidden');
        if (signupSuccess) signupSuccess.classList.add('hidden');
        signupModal.classList.remove('hidden');
    });
}

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

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        }).then(() => {
            signupForm.classList.add('hidden');
            signupSuccess.classList.remove('hidden');
        }).catch(() => {
            signupForm.classList.add('hidden');
            signupSuccess.classList.remove('hidden');
        });
    });
}