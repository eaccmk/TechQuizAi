// TechQuizAi Central Configuration & Branding System (Build-Time Generated)
const CONFIG = {
    appName: 'TechQuizAi',
    tagline: 'Master Tech Concepts, One Quiz at a Time',
    heroSubtitle: 'Interactive quizzes in Cloud Computing, AI/ML, and Data Science designed for Developers, AI Engineers, QA/SDETs, DevRels, and Data Scientists.',
    logoIcon: '☁️',
    copyrightYear: 2026,
    copyrightText: 'Built for learners, by learners.',
    analyticsId: "****************BTTB",
    
    urls: {
        siteUrl: 'https://techquizai.netlify.app/',
        home: 'index.html',
        quiz: 'quiz.html',
        disclaimer: 'disclaimer.html',
        linkedin: 'https://www.linkedin.com/in/millankaul',
        github: 'https://github.com/eaccmk',
        blog: 'https://qualitywithmillan.github.io/',
        googleFormUrl: "****************onse"
    },
    
    storageKeys: {
        userName: 'techquizai_user_name',
        attemptsPrefix: 'techquizai_attempts_',
        theme: 'theme',
        cookieConsent: 'cookieConsent'
    },
    
    defaults: {
        userName: 'Learner',
        maxAttempts: 3
    },
    
    branding: {
        primaryColor: '#7c3aed',
        primaryHover: '#6d28d9',
        purpleAccent: '#a78bfa',
        pinkAccent: '#f0abfc',
        greenSuccess: '#22c55e'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
