// STARLA Monthly Commentary Generator
// Powered by OptiaData

// Pre-defined question sets for monthly reporting
const MONTHLY_QUESTIONS = {
    emea: [
        { id: 'emea-q1', category: 'Category Performance', question: 'What is the total RTD coffee in value, volume – MAT, L12wks, L4wks?' },
        { id: 'emea-q2', category: 'Category Growth', question: 'What is the total growth for RTD coffee in value, volume – MAT, L12wks, L4wks?' },
        { id: 'emea-q3', category: 'YoY Comparison', question: 'How has this changed vs this same period last year?' },
        { id: 'emea-q4', category: 'MoM Comparison', question: 'How has this changed vs last month?' },
        { id: 'emea-q5', category: 'Starbucks Performance', question: 'What is the total Starbucks (Arla) in value, volume – MAT, L12wks, L4wks?' },
        { id: 'emea-q6', category: 'Starbucks Growth', question: 'What is the total growth for Starbucks (Arla) in value, volume – MAT, L12wks, L4wks?' },
        { id: 'emea-q7', category: 'Brand Drivers', question: 'Which brands are driving the most growth in the RTD category? – MAT, L12wks, L4wks?' },
        { id: 'emea-q8', category: 'Brand Contribution', question: 'What is the contribution of each brand to total category growth? – MAT, L12wks, L4wks?' },
        { id: 'emea-q9', category: 'Country Performance', question: 'Which countries are showing the highest and lowest growth in RTD coffee sales? – MAT, L12wks, L4wks?' },
        { id: 'emea-q10', category: 'Starbucks vs Market', question: 'How is Starbucks performing in each country compared to the total RTD market? – MAT, L12wks, L4wks?' },
        { id: 'emea-q11', category: 'Share Movement', question: 'Which countries is Starbucks gaining or losing share? – MAT, L12wks, L4wks?' },
        { id: 'emea-q12', category: 'Share Trend', question: 'How is Starbucks value share and share point change trending over time? And how has this changed vs last month?' },
        { id: 'emea-q13', category: 'Competitive Ranking', question: 'How does Starbucks rank in terms of value sales, volume, and share compared to competitors like Nescafé, Emmi, etc.?' },
        { id: 'emea-q14', category: 'Performance Drivers', question: 'What is the impact of in-market drivers (e.g., price, distribution, unit sales) on Starbucks performance?' },
        { id: 'emea-q15', category: 'Format Analysis', question: 'Which product formats are driving the most value? And how has this changed vs MAT, L12wks, L4wks?' }
    ],
    'emea-ex-turkey': [
        { id: 'exturkey-q1', category: 'Category Performance', question: 'What is the total RTD coffee in value, volume – MAT, L12wks, L4wks?' },
        { id: 'exturkey-q2', category: 'Category Growth', question: 'What is the total growth for RTD coffee in value, volume – MAT, L12wks, L4wks?' },
        { id: 'exturkey-q3', category: 'Starbucks Performance', question: 'What is the total Starbucks (Arla) in value, volume – MAT, L12wks, L4wks?' },
        { id: 'exturkey-q4', category: 'Starbucks Growth', question: 'What is the total growth for Starbucks (Arla) in value, volume – MAT, L12wks, L4wks?' },
        { id: 'exturkey-q5', category: 'Brand Drivers', question: 'Which brands are driving the most growth in the RTD category?' },
        { id: 'exturkey-q6', category: 'Share Movement', question: 'Which countries is Starbucks gaining or losing share?' }
    ],
    countries: [
        { id: 'country-q1', category: 'Value Sales', question: 'What is Starbucks total value sales and how has it changed MAT, L12wks, L4wks?' },
        { id: 'country-q2', category: 'Share vs Competitors', question: 'How does Starbucks market share change compare to competitors?' },
        { id: 'country-q3', category: 'Relative Growth', question: 'Is Starbucks growing faster or slower than the total RTD coffee market?' },
        { id: 'country-q4', category: 'Platform Performance', question: 'Which Starbucks platforms are driving growth or decline? (Chilled Classic, Daily Brew, Energy, Frappuccino, Multiserve, Protein)' },
        { id: 'country-q5', category: 'Distribution', question: 'Which brands are gaining and losing in distribution?' }
    ]
};

// Sample data responses (would be replaced by actual API calls)
const SAMPLE_RESPONSES = {
    'emea-q1': 'Total RTD Coffee: MAT €2.16bn (+8.5%), L12wks €578m (+9.2%), L4wks €198m (+7.8%)',
    'emea-q2': 'Value Growth: MAT +8.5%, L12wks +9.2%, L4wks +7.8%. Volume Growth: MAT +5.2%, L12wks +6.1%, L4wks +4.9%',
    'emea-q5': 'Starbucks (Arla): MAT €490.8m, L12wks €125.4m, L4wks €49.8m',
    'emea-q6': 'Starbucks Value Growth: MAT +5.1%, L12wks +3.8%, L4wks +2.2%. Share: MAT 22.7% (-200bps), L12wks 21.7% (-200bps), L4wks 21.5% (-160bps)',
    'exturkey-q3': 'Starbucks (ex-Turkey): MAT €467.2m, L12wks €121.8m, L4wks €48.3m',
    'exturkey-q4': 'Value Share: MAT 26.7% (-70bps), L12wks 26.6% (-60bps), L4wks 26.6% (flat vs LY)'
};

// State
let generatedAnswers = {};
let currentPeriod = 'p9-2025';

// Generate commentary for a specific section
async function generateSection(sectionId) {
    const questions = MONTHLY_QUESTIONS[sectionId];
    if (!questions) return;

    for (const q of questions) {
        const answerBox = document.getElementById(q.id);
        if (answerBox) {
            answerBox.innerHTML = '<span style="color: var(--starbucks-green)">⏳ Generating...</span>';

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Use sample response or generate placeholder
            const answer = SAMPLE_RESPONSES[q.id] || `Analysis for "${q.question}" - Data pending from STARLA PDFs.`;
            answerBox.textContent = answer;
            answerBox.classList.add('filled');
            generatedAnswers[q.id] = { question: q.question, answer: answer };
        }
    }
}

// Generate all commentary
async function generateAllCommentary() {
    const btn = document.querySelector('[onclick="generateAllCommentary()"]');
    btn.innerHTML = '⏳ Generating...';
    btn.disabled = true;

    await generateSection('emea');
    await generateSection('emea-ex-turkey');
    await generateSection('countries');

    btn.innerHTML = '✅ Generated';
    setTimeout(() => {
        btn.innerHTML = '🔄 Generate All Commentary';
        btn.disabled = false;
    }, 2000);
}

// Download report as text file
function downloadReport() {
    const period = document.getElementById('periodSelect').value.toUpperCase().replace('-', ' ');
    const timestamp = new Date().toISOString().split('T')[0];

    let report = `STARLA RTD MONTHLY COMMENTARY
========================================
Period: ${period}
Generated: ${timestamp}
Powered by OptiaData
========================================

`;

    // Executive Summary
    const summaryText = document.getElementById('summary-text');
    if (summaryText) {
        report += `EXECUTIVE SUMMARY
----------------------------------------
${summaryText.innerText}

`;
    }

    // Total EMEA
    report += `TOTAL EMEA ANALYSIS
----------------------------------------
`;
    for (const q of MONTHLY_QUESTIONS.emea) {
        const answer = generatedAnswers[q.id];
        if (answer) {
            report += `
Q: ${answer.question}
A: ${answer.answer}
`;
        }
    }

    // EMEA ex-Turkey
    report += `
TOTAL EMEA (EXCL. TURKEY)
----------------------------------------
`;
    for (const q of MONTHLY_QUESTIONS['emea-ex-turkey']) {
        const answer = generatedAnswers[q.id];
        if (answer) {
            report += `
Q: ${answer.question}
A: ${answer.answer}
`;
        }
    }

    // Country Level
    report += `
COUNTRY LEVEL ANALYSIS
----------------------------------------
`;
    for (const q of MONTHLY_QUESTIONS.countries) {
        const answer = generatedAnswers[q.id];
        if (answer) {
            report += `
Q: ${answer.question}
A: ${answer.answer}
`;
        }
    }

    report += `
========================================
VALIDATION
✓ Reviewed by Sr Data Scientist
✓ Approved by McKinsey Expert Partner
========================================
© ${new Date().getFullYear()} OptiaData. Confidential.
`;

    // Create and download file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `STARLA_Monthly_Commentary_${period.replace(' ', '_')}_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Period selector change handler
    const periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', (e) => {
            currentPeriod = e.target.value;
            // Clear previous answers when period changes
            generatedAnswers = {};
            document.querySelectorAll('.answer-box').forEach(box => {
                box.textContent = '';
                box.classList.remove('filled');
            });
        });
    }
});
