/**
 * STARLA PDF Extraction Script
 * Uses GPT-4 Vision to interpret charts and tables from STARLA reports
 * 
 * Powered by OptiaData
 */

require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// PDF directories
const PDF_BASE_PATH = 'c:/Dev/starbucks';
const OUTPUT_PATH = path.join(__dirname, '../data');

// Extraction prompt optimized for STARLA RTD reports
const EXTRACTION_PROMPT = `You are extracting data from a Starbucks STARLA RTD (Ready-to-Drink) market report PDF page.

Extract ALL data visible in this page and return it as structured JSON.

Focus on:
1. MARKET SHARE DATA: Brand shares (Starbucks, Monster, Red Bull, Costa, others)
2. VOLUME DATA: Units sold, liters, cases
3. VALUE DATA: Revenue, sales value
4. GROWTH RATES: Period-over-period changes, YoY growth
5. CHANNEL DATA: Convenience, grocery, foodservice splits
6. TREND DATA: Any historical trend charts or tables

For each data point, extract:
- Metric name
- Value (number)
- Unit (%, liters, EUR, etc.)
- Period (if visible)
- Comparison (vs last period, vs year ago)

Return ONLY valid JSON in this format:
{
    "page_type": "market_share|volume|value|channel|trend|summary",
    "country": "extracted country name",
    "period": "extracted period (e.g. P7 2025)",
    "brands": {
        "starbucks": {
            "share": number or null,
            "share_change": number or null,
            "volume": number or null,
            "volume_change": number or null,
            "value": number or null,
            "value_change": number or null
        },
        // same for other brands
    },
    "category_totals": {
        "total_volume": number or null,
        "total_value": number or null,
        "category_growth": number or null
    },
    "channels": {
        "convenience": { "share": number, "growth": number },
        "grocery": { "share": number, "growth": number },
        "foodservice": { "share": number, "growth": number }
    },
    "raw_tables": [
        { "description": "table description", "data": [[...]] }
    ],
    "key_insights": ["list of insights visible on page"]
}

If a value is not visible on this page, use null.
Be precise with numbers - do not estimate or round.`;

/**
 * Convert PDF page to base64 image
 * Note: In production, you'd use a library like pdf-poppler or pdf2pic
 */
async function pdfPageToImage(pdfPath, pageNumber) {
    // Placeholder - in production, implement with:
    // const pdf2pic = require('pdf2pic');
    // or use pdf-poppler

    console.log(`Converting page ${pageNumber} of ${pdfPath} to image...`);

    // For demo, return null - actual implementation needed
    return null;
}

/**
 * Extract data from a PDF page using GPT-4 Vision
 */
async function extractPageWithVision(imageBase64) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-vision-preview',
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: EXTRACTION_PROMPT },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:image/png;base64,${imageBase64}`,
                                detail: 'high'
                            }
                        }
                    ]
                }
            ],
            max_tokens: 4000
        });

        const content = response.choices[0].message.content;

        // Parse JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return { error: 'Could not parse JSON from response', raw: content };
    } catch (error) {
        console.error('Vision extraction error:', error);
        return { error: error.message };
    }
}

/**
 * Process a single STARLA PDF report
 */
async function processPDF(pdfPath) {
    console.log(`\nProcessing: ${pdfPath}`);

    const fileName = path.basename(pdfPath, '.pdf');
    const extractedData = {
        fileName,
        extractedAt: new Date().toISOString(),
        pages: []
    };

    // For demo purposes, return simulated data
    // In production, iterate through PDF pages

    console.log('✓ PDF processed (simulated)');
    return extractedData;
}

/**
 * Find all STARLA PDFs and process them
 */
async function extractAllPDFs() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║   STARLA PDF Extraction                                       ║');
    console.log('║   Powered by OptiaData + GPT-4 Vision                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_PATH)) {
        fs.mkdirSync(OUTPUT_PATH, { recursive: true });
    }

    // Find all period folders
    const periods = fs.readdirSync(PDF_BASE_PATH)
        .filter(dir => dir.match(/^P\d+ - 20\d{2}$/))
        .map(dir => path.join(PDF_BASE_PATH, dir));

    console.log(`Found ${periods.length} period folders\n`);

    const allData = {};

    for (const periodPath of periods) {
        const periodName = path.basename(periodPath);
        console.log(`\n📁 Processing ${periodName}...`);

        const pdfs = fs.readdirSync(periodPath)
            .filter(f => f.endsWith('.pdf') && !f.includes('Format'))
            .map(f => path.join(periodPath, f));

        allData[periodName] = {};

        for (const pdfPath of pdfs) {
            const country = extractCountryFromFilename(path.basename(pdfPath));
            const data = await processPDF(pdfPath);
            allData[periodName][country] = data;
        }
    }

    // Save consolidated data
    const outputFile = path.join(OUTPUT_PATH, 'starla_data.json');
    fs.writeFileSync(outputFile, JSON.stringify(allData, null, 2));
    console.log(`\n✓ Data saved to ${outputFile}`);

    return allData;
}

/**
 * Extract country name from STARLA filename
 */
function extractCountryFromFilename(filename) {
    // STARLA_RTD - 2025 - P7 - Germany.pdf
    const match = filename.match(/- ([^-]+)\.pdf$/);
    if (match) {
        return match[1].trim().toLowerCase().replace(/\s+/g, '-');
    }
    return 'unknown';
}

// Run if called directly
if (require.main === module) {
    extractAllPDFs()
        .then(() => console.log('\n✓ Extraction complete'))
        .catch(err => console.error('Extraction failed:', err));
}

module.exports = { extractAllPDFs, extractPageWithVision };
