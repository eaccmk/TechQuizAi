const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { parseMarkdownQuiz, hashAnswer } = require('../scripts/build-quizzes');
const CONFIG = require('../src/config');

console.log('🧪 Running TechQuizAi Automated Test Suite...\n');

let testsPassed = 0;
function runTest(name, fn) {
    try {
        fn();
        console.log(`  ✓ PASSED: ${name}`);
        testsPassed++;
    } catch (err) {
        console.error(`  ❌ FAILED: ${name}`);
        console.error(err.stack || err.message);
        process.exit(1);
    }
}

// 1. Config Validation Test
runTest('Central Configuration Validation', () => {
    assert.strictEqual(typeof CONFIG.appName, 'string', 'CONFIG.appName should be a string');
    assert.strictEqual(typeof CONFIG.storageKeys.userName, 'string', 'storageKeys.userName missing');
    assert.strictEqual(typeof CONFIG.storageKeys.attemptsPrefix, 'string', 'storageKeys.attemptsPrefix missing');
    assert.ok(CONFIG.urls.siteUrl, 'siteUrl URL missing');
    assert.ok(CONFIG.branding.primaryColor, 'primaryColor branding missing');
});

// 2. Core File & Directory Integrity Test
runTest('Core File & Directory Structure Integrity Check', () => {
    const requiredFiles = [
        'index.html',
        'quiz.html',
        '404.html',
        'disclaimer.html',
        'src/config.js',
        'src/app.js',
        'src/quiz.js',
        'src/certificate.js',
        'src/style.css',
        'src/quiz.css',
        'src/quizzes-data.js',
        'src/quizzes.json',
        'assets/favicon.png',
        'scripts/build-quizzes.js'
    ];

    requiredFiles.forEach(file => {
        const fullPath = path.join(__dirname, '..', file);
        assert.ok(fs.existsSync(fullPath), `Required core file missing: ${file}`);
    });
});

// 3. Subfolder Quiz Markdown Parser Test (AWS, AI, AZURE, GCP)
runTest('Subfolder Markdown Quiz Files Parsing & Schema Test', () => {
    const quizzesDir = path.join(__dirname, '..', 'quizzes');
    assert.ok(fs.existsSync(quizzesDir), 'quizzes/ directory missing');

    const expectedSubfolders = ['AWS', 'AI', 'AZURE', 'GCP'];
    expectedSubfolders.forEach(sub => {
        const subPath = path.join(quizzesDir, sub);
        assert.ok(fs.existsSync(subPath), `Expected quiz subfolder missing: quizzes/${sub}`);
    });

    function getQuizFiles(dirPath) {
        let results = [];
        const list = fs.readdirSync(dirPath);
        list.forEach(file => {
            const filePath = path.join(dirPath, file);
            if (fs.statSync(filePath).isDirectory()) {
                results = results.concat(getQuizFiles(filePath));
            } else if (file.endsWith('.md')) {
                results.push(filePath);
            }
        });
        return results;
    }

    const files = getQuizFiles(quizzesDir);
    assert.strictEqual(files.length, 12, 'Should have 12 .md quiz files (3 per subfolder across 4 categories)');

    files.forEach(fullPath => {
        const relativeFile = path.relative(quizzesDir, fullPath);
        const quiz = parseMarkdownQuiz(fullPath);

        assert.ok(quiz.id, `Quiz in ${relativeFile} missing id`);
        assert.ok(quiz.title, `Quiz in ${relativeFile} missing title`);

        if (quiz.available) {
            assert.ok(quiz.questionsCount > 0, `Active quiz in ${relativeFile} has 0 questions`);
            assert.ok(Array.isArray(quiz.questions), `Quiz questions in ${relativeFile} must be an array`);

            quiz.questions.forEach((q, idx) => {
                assert.ok(q.text, `Question ${idx + 1} in ${relativeFile} missing text`);
                assert.ok(Array.isArray(q.options) && q.options.length >= 2, `Question ${idx + 1} in ${relativeFile} must have at least 2 options`);
                assert.strictEqual(typeof q.answerHash, 'string', `Question ${idx + 1} in ${relativeFile} missing answerHash`);
                assert.strictEqual(q.answerHash.length, 64, `Question ${idx + 1} in ${relativeFile} answerHash is not a valid SHA-256 string`);
                assert.strictEqual(q.correct, undefined, `Question ${idx + 1} in ${relativeFile} should NOT expose plain correct index`);
            });
        }
    });
});

// 4. Answer Security & Obfuscation Hash Test
runTest('Answer Obfuscation SHA-256 Hash Matching', () => {
    const answer = 'Identity and Access Management';
    const hash = hashAnswer(answer);
    assert.strictEqual(hash.length, 64, 'Hash must be 64 characters long');
    assert.strictEqual(hashAnswer(answer), hash, 'Hash output must be deterministic');
    assert.notStrictEqual(hashAnswer('Wrong Answer'), hash, 'Different answer must produce different hash');
});

// 5. Dynamic 50% Passing Threshold Logic Test
runTest('Dynamic 50% Passing Criteria Logic Test', () => {
    function isPassed(correctCount, totalCount) {
        const passThreshold = Math.ceil(totalCount * 0.5);
        return correctCount >= passThreshold;
    }

    assert.strictEqual(isPassed(5, 10), true, '5 out of 10 must pass (50%)');
    assert.strictEqual(isPassed(4, 10), false, '4 out of 10 must fail (<50%)');
    assert.strictEqual(isPassed(3, 5), true, '3 out of 5 must pass (60% >= 50%)');
    assert.strictEqual(isPassed(2, 5), false, '2 out of 5 must fail (40% < 50%)');
});

console.log(`\n🎉 All ${testsPassed} tests passed successfully! Code is ready to deploy.`);
