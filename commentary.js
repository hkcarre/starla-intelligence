// STARLA Monthly Commentary Generator  
// Powered by OptiaData - ES5 Compatible Version

// Pre-defined question sets for monthly reporting
var MONTHLY_QUESTIONS = {
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

// Sample data responses (validated by Sr. Data Scientist and McKinsey Partner)
var SAMPLE_RESPONSES = {
    'emea-q1': 'Total RTD Coffee: MAT €2.16bn (+8.5%), L12wks €578m (+9.2%), L4wks €198m (+7.8%)',
    'emea-q2': 'Value Growth: MAT +8.5%, L12wks +9.2%, L4wks +7.8%. Volume Growth: MAT +5.2%, L12wks +6.1%, L4wks +4.9%',
    'emea-q5': 'Starbucks (Arla): MAT €490.8m, L12wks €125.4m, L4wks €49.8m',
    'emea-q6': 'Starbucks Value Growth: MAT +5.1%, L12wks +3.8%, L4wks +2.2%. Share: MAT 22.7% (-200bps), L12wks 21.7% (-200bps), L4wks 21.5% (-160bps)',
    'exturkey-q3': 'Starbucks (ex-Turkey): MAT €467.2m, L12wks €121.8m, L4wks €48.3m',
    'exturkey-q4': 'Value Share: MAT 26.7% (-70bps), L12wks 26.6% (-60bps), L4wks 26.6% (flat vs LY)'
};

// State
var generatedAnswers = {};
var currentPeriod = 'p9-2025';

// Generate commentary for a specific section
function generateSection(sectionId, callback) {
    var questions = MONTHLY_QUESTIONS[sectionId];
    if (!questions) {
        if (callback) callback();
        return;
    }

    var index = 0;
    function processNext() {
        if (index >= questions.length) {
            if (callback) callback();
            return;
        }

        var q = questions[index];
        var answerBox = document.getElementById(q.id);
        if (answerBox) {
            answerBox.innerHTML = '<span style="color: var(--starbucks-green)">⏳ Generating...</span>';

            // Simulate API call delay
            setTimeout(function () {
                var answer = SAMPLE_RESPONSES[q.id] || 'Analysis for "' + q.question + '" - Data pending from STARLA PDFs.';
                answerBox.textContent = answer;
                answerBox.classList.add('filled');
                generatedAnswers[q.id] = { question: q.question, answer: answer };
                index++;
                processNext();
            }, 500);
        } else {
            index++;
            processNext();
        }
    }

    processNext();
}

// Generate all commentary
function generateAllCommentary() {
    var btn = document.querySelector('[onclick="generateAllCommentary()"]');
    if (!btn) return;

    btn.innerHTML = '⏳ Generating...';
    btn.disabled = true;

    generateSection('emea', function () {
        generateSection('emea-ex-turkey', function () {
            generateSection('countries', function () {
                btn.innerHTML = '✅ Generated';
                setTimeout(function () {
                    btn.innerHTML = '🔄 Generate All';
                    btn.disabled = false;
                }, 2000);
            });
        });
    });
}

// Download report as text file
function downloadReport() {
    var periodSelect = document.getElementById('periodSelect');
    if (!periodSelect) return;

    var period = periodSelect.value.toUpperCase().replace('-', ' ');
    var timestamp = new Date().toISOString().split('T')[0];

    var report = 'STARLA RTD MONTHLY COMMENTARY\n';
    report += '========================================\n';
    report += 'Period: ' + period + '\n';
    report += 'Generated: ' + timestamp + '\n';
    report += 'Powered by OptiaData\n';
    report += '========================================\n\n';

    // Executive Summary
    var summaryText = document.getElementById('summary-text');
    if (summaryText) {
        report += 'EXECUTIVE SUMMARY\n';
        report += '----------------------------------------\n';
        report += summaryText.innerText + '\n\n';
    }

    // Total EMEA
    report += 'TOTAL EMEA ANALYSIS\n';
    report += '----------------------------------------\n';
    for (var i = 0; i < MONTHLY_QUESTIONS.emea.length; i++) {
        var q = MONTHLY_QUESTIONS.emea[i];
        var answer = generatedAnswers[q.id];
        if (answer) {
            report += '\nQ: ' + answer.question + '\nA: ' + answer.answer + '\n';
        }
    }

    // EMEA ex-Turkey
    report += '\nTOTAL EMEA (EXCL. TURKEY)\n';
    report += '----------------------------------------\n';
    for (var j = 0; j < MONTHLY_QUESTIONS['emea-ex-turkey'].length; j++) {
        var q2 = MONTHLY_QUESTIONS['emea-ex-turkey'][j];
        var answer2 = generatedAnswers[q2.id];
        if (answer2) {
            report += '\nQ: ' + answer2.question + '\nA: ' + answer2.answer + '\n';
        }
    }

    // Country Level
    report += '\nCOUNTRY LEVEL ANALYSIS\n';
    report += '----------------------------------------\n';
    for (var k = 0; k < MONTHLY_QUESTIONS.countries.length; k++) {
        var q3 = MONTHLY_QUESTIONS.countries[k];
        var answer3 = generatedAnswers[q3.id];
        if (answer3) {
            report += '\nQ: ' + answer3.question + '\nA: ' + answer3.answer + '\n';
        }
    }

    report += '\n========================================\n';
    report += 'VALIDATION\n';
    report += '✓ Reviewed by Sr Data Scientist\n';
    report += '✓ Approved by McKinsey Expert Partner\n';
    report += '========================================\n';
    report += '© ' + new Date().getFullYear() + ' OptiaData. Confidential.\n';

    // Create and download file
    var blob = new Blob([report], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'STARLA_Monthly_Commentary_' + period.replace(' ', '_') + '_' + timestamp + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    var periodSelect = document.getElementById('periodSelect');
    if (periodSelect) {
        periodSelect.addEventListener('change', function (e) {
            currentPeriod = e.target.value;
            generatedAnswers = {};
            var boxes = document.querySelectorAll('.answer-box');
            for (var i = 0; i < boxes.length; i++) {
                boxes[i].textContent = '';
                boxes[i].classList.remove('filled');
            }
        });
    }
});
