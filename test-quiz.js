const fs = require('fs');

// Load window.QUIZ_CATALOG
const dataContent = fs.readFileSync('src/quizzes-data.js', 'utf8');
const window = {};
eval(dataContent);

function testQuiz(quizId) {
    let qData = window.QUIZ_CATALOG.catalog[quizId];
    if (qData) {
        console.log(`Quiz ${quizId} loaded from catalog. First question: ${qData.questions[0].text}`);
    } else {
        console.log(`Quiz ${quizId} NOT found in catalog!`);
    }
}

['mcp-concepts', 'aws-basics', 'iam-concepts'].forEach(testQuiz);
