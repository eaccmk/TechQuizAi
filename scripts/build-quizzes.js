const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function hashAnswer(text) {
    return crypto.createHash('sha256').update(text.trim()).digest('hex');
}

function parseMarkdownQuiz(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse Frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
        throw new Error(`Invalid frontmatter in ${filePath}`);
    }

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

    const isAvailable = metadata.available !== false;
    const body = content.slice(frontmatterMatch[0].length);
    const questionBlocks = body.split(/### Question \d+/i).filter(b => b.trim());

    const questions = [];

    if (isAvailable) {
        questionBlocks.forEach((block, index) => {
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
                    if (isCorrect) {
                        correctAnswerText = optionText;
                    }
                } else if (!line.startsWith('#') && !line.startsWith('---')) {
                    if (!questionText) {
                        questionText = line;
                    } else if (options.length === 0) {
                        questionText += ' ' + line;
                    }
                }
            });

            if (!questionText || options.length < 2 || !correctAnswerText) {
                throw new Error(`Question ${index + 1} in ${filePath} is missing question text, options, or correct answer marker [- [x]]`);
            }

            questions.push({
                id: index + 1,
                difficulty,
                text: questionText,
                options,
                answerHash: hashAnswer(correctAnswerText),
                hint: hint || 'No hint available for this question.'
            });
        });
    }

    return {
        id: metadata.id,
        icon: metadata.icon || '📝',
        title: metadata.title,
        subtitle: metadata.subtitle || '',
        category: metadata.category || 'AWS Fundamentals',
        questionsCount: isAvailable ? questions.length : (parseInt(metadata.questions) || 10),
        completed: false,
        available: isAvailable,
        questions
    };
}

// Recursively find all markdown files in quizzes/ subfolders (AWS, AI, AZURE, GCP)
function getQuizFiles(dirPath) {
    let results = [];
    const list = fs.readdirSync(dirPath);
    list.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getQuizFiles(filePath));
        } else if (file.endsWith('.md')) {
            results.push(filePath);
        }
    });
    return results;
}

function buildQuizzes() {
    const quizzesDir = path.join(__dirname, '..', 'quizzes');
    const srcDir = path.join(__dirname, '..', 'src');
    const rootDir = path.join(__dirname, '..');

    if (!fs.existsSync(srcDir)) {
        fs.mkdirSync(srcDir, { recursive: true });
    }

    // Clean up top-level loose .md files directly under quizzes/ (only keep subdirectories AWS, AI, AZURE, GCP)
    const rootQuizFiles = fs.readdirSync(quizzesDir);
    rootQuizFiles.forEach(file => {
        const fullPath = path.join(quizzesDir, file);
        if (fs.statSync(fullPath).isFile() && file.endsWith('.md')) {
            fs.unlinkSync(fullPath);
            console.log(`Cleaned loose root quiz file: ${file}`);
        }
    });

    // Clean up legacy duplicate files in root directory that now live inside src/
    const legacyDuplicates = [
        'app.js',
        'quiz.js',
        'certificate.js',
        'config.js',
        'style.css',
        'quiz.css',
        'quizzes.json',
        'quizzes-data.js',
        'test.js',
        'SKILL.md',
        'netlify.md'
    ];

    legacyDuplicates.forEach(file => {
        const dupPath = path.join(rootDir, file);
        if (fs.existsSync(dupPath)) {
            fs.unlinkSync(dupPath);
            console.log(`Cleaned legacy root duplicate: ${file}`);
        }
    });

    // Support Netlify Build Environment Variables (.env)
    const analyticsId = process.env.ANALYTICS_ID || process.env.GA_MEASUREMENT_ID || '';
    const googleFormUrl = process.env.GOOGLE_FORM_URL || '';

    const configContent = `// TechQuizAi Central Configuration & Branding System (Build-Time Generated)
const CONFIG = {
    appName: 'TechQuizAi',
    tagline: 'Master Cloud Computing, One Quiz at a Time',
    heroSubtitle: 'Learn Cloud fundamentals, AI, LLM, Agents, Eval, RAG, MCP through interactive quizzes. No fluff, just concepts that stick.',
    logoIcon: '☁️',
    copyrightYear: 2026,
    copyrightText: 'Built for learners, by learners.',
    analyticsId: ${JSON.stringify(analyticsId)},
    
    urls: {
        siteUrl: 'https://techquizai.netlify.app/',
        home: 'index.html',
        quiz: 'quiz.html',
        disclaimer: 'disclaimer.html',
        linkedin: 'https://www.linkedin.com/in/millankaul',
        github: 'https://github.com/eaccmk',
        blog: 'https://qualitywithmillan.github.io/',
        googleFormUrl: ${JSON.stringify(googleFormUrl)}
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
`;

    fs.writeFileSync(path.join(srcDir, 'config.js'), configContent);
    console.log(`✓ Compiled src/config.js with build-time environment variables`);

    const files = getQuizFiles(quizzesDir);
    const manifest = [];
    const fullCatalog = {};

    files.forEach(fullPath => {
        const relativeFile = path.relative(quizzesDir, fullPath);
        try {
            const quizData = parseMarkdownQuiz(fullPath);
            manifest.push({
                id: quizData.id,
                icon: quizData.icon,
                title: quizData.title,
                subtitle: quizData.subtitle,
                category: quizData.category,
                questions: quizData.questionsCount,
                completed: false,
                available: quizData.available
            });

            fullCatalog[quizData.id] = quizData;
            console.log(`✓ Parsed ${relativeFile} -> ${quizData.title} (${quizData.questionsCount} questions, available: ${quizData.available})`);
        } catch (err) {
            console.error(`❌ Error parsing ${relativeFile}:`, err.message);
            process.exit(1);
        }
    });

    const outputData = {
        manifest,
        catalog: fullCatalog
    };

    const jsonOutputPath = path.join(srcDir, 'quizzes.json');
    const jsOutputPath = path.join(srcDir, 'quizzes-data.js');

    fs.writeFileSync(jsonOutputPath, JSON.stringify(outputData, null, 2));
    fs.writeFileSync(jsOutputPath, `window.QUIZ_CATALOG = ${JSON.stringify(outputData, null, 2)};\n`);
    console.log(`🎉 Quiz catalog built successfully! Saved to src/quizzes.json and src/quizzes-data.js (${manifest.length} total quizzes)`);
}

if (require.main === module) {
    buildQuizzes();
}

module.exports = { parseMarkdownQuiz, buildQuizzes, hashAnswer };
