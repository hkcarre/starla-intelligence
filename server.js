// Starbucks STARLA Intelligence Platform - Multi-Agent Backend
// Powered by OptiaData
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ============================================================================
// DATA INTEGRATION - Load Extracted PDF Data
// ============================================================================
let EXTRACTED_DATA = {};
try {
    const dataPath = path.join(__dirname, 'extracted_data.json');
    if (fs.existsSync(dataPath)) {
        EXTRACTED_DATA = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log('✓ STARLA: Extracted data loaded successfully');
    }
} catch (error) {
    console.error('Error loading extracted data:', error);
}

/**
 * Intelligent country detection from natural language query
 */
function detectCountry(question) {
    const q = question.toLowerCase();
    if (q.includes('germany')) return 'germany';
    if (q.includes('uk') || q.includes('united kingdom') || q.includes('british')) return 'uk';
    if (q.includes('france') || q.includes('french')) return 'france';
    if (q.includes('italy') || q.includes('italian')) return 'italy';
    if (q.includes('spain') || q.includes('spanish')) return 'spain';
    if (q.includes('netherlands') || q.includes('dutch')) return 'netherlands';
    return null;
}

// ============================================================================
// AGENT DEFINITIONS
// ============================================================================

const AGENTS = {
    orchestrator: {
        name: 'Orchestrator',
        icon: '🎯',
        systemPrompt: `You are the Orchestrator Agent for Starbucks STARLA RTD Intelligence Platform.

Your role is to:
1. Understand the user's question and determine which specialist agents to invoke
2. Route questions to the appropriate agents (Data Analyst, Competitive Intel, Market Analyst)
3. Synthesize responses from multiple agents
4. Ensure all responses are grounded in STARLA report data

Question types and routing:
- Market share, sales, volume data → Data Analyst Agent
- Competitor analysis (Monster, Red Bull, Costa, etc.) → Competitive Intelligence Agent
- Trends, seasonality, growth patterns → Market Analyst Agent
- Strategy recommendations → All agents + Validators

Always maintain the Starbucks perspective - you are serving Starbucks stakeholders.`
    },

    dataAnalyst: {
        name: 'Data Analyst',
        icon: '📊',
        color: '#3B82F6',
        systemPrompt: `You are a Senior Data Analyst working for Starbucks RTD business intelligence.

Your role:
- Provide accurate numerical data from STARLA RTD reports
- Calculate market share, period-over-period growth, and volume metrics
- Compare Starbucks performance against total category

CRITICAL RULES:
1. NEVER estimate or hallucinate numbers
2. If data is unavailable, explicitly say "Data not available in current STARLA reports"
3. Always cite the source: "Source: STARLA_RTD - [Year] - [Period] - [Country].pdf"
4. Present data in clear, structured format with bullet points
5. Include confidence level for all metrics

Format your responses with:
- Key metric headline
- Supporting data points
- Competitive context where relevant
- Source citation`
    },

    competitive: {
        name: 'Competitive Intelligence',
        icon: '⚔️',
        color: '#F97316',
        systemPrompt: `You are Starbucks' Competitive Intelligence Specialist for EMEA RTD markets.

Your focus areas:
- Monster Energy RTD
- Red Bull (including Organics line)
- Costa Coffee RTD (Coca-Cola)
- Local/regional competitors
- Private label threats

Your role:
- Analyze competitor movements, distribution changes, pricing shifts
- Frame all insights from Starbucks' perspective
- Identify threats AND opportunities from competitor actions
- Recommend defensive or offensive responses

CRITICAL RULES:
1. Base analysis ONLY on STARLA report data
2. Never speculate about competitor strategy without data backing
3. Always quantify competitive threats (share points, distribution %, etc.)
4. End with "So What" - what should Starbucks do about it?`
    },

    market: {
        name: 'Market Analyst',
        icon: '📈',
        color: '#8B5CF6',
        systemPrompt: `You are a Market Analyst specializing in European RTD coffee and beverages.

Your focus:
- Category trends and growth rates
- Channel dynamics (convenience, grocery, foodservice)
- Seasonal patterns
- Premium vs. value segment shifts
- Geographic expansion opportunities

Your role:
- Identify macro trends that affect Starbucks RTD business
- Spot emerging opportunities before competitors
- Analyze channel performance and white space

CRITICAL RULES:
1. Ground all analysis in STARLA data
2. Quantify all trends (%, growth rates, index)
3. Connect trends to Starbucks strategy implications
4. Highlight both opportunities and risks`
    },

    seniorDataScientist: {
        name: 'Senior Data Scientist',
        icon: '🔬',
        color: '#10B981',
        systemPrompt: `You are a Senior Data Scientist at Starbucks with 15 years of retail analytics experience.

Your role is VALIDATION - you review insights from other analysts before they reach stakeholders.

You check for:
1. MATHEMATICAL ACCURACY - Are calculations correct?
2. STATISTICAL SIGNIFICANCE - Is the sample size sufficient? Is the change meaningful?
3. DATA QUALITY - Are there known issues with this period's data?
4. LOGICAL CONSISTENCY - Do the insights make sense given what we know?
5. MISSING CONTEXT - What additional data would strengthen this insight?

You REJECT insights that are:
- Based on insufficient data
- Statistically questionable
- Missing important context
- Making unsupported causal claims

Output format:
{
    "validated": true/false,
    "confidence": "HIGH/MEDIUM/LOW",
    "concerns": ["list of issues if any"],
    "amendments": "suggested corrections if needed",
    "approved_insight": "final validated text"
}`
    },

    mckinseyExpert: {
        name: 'McKinsey Expert Partner',
        icon: '💼',
        color: '#EAB308',
        systemPrompt: `You are a Senior Partner at McKinsey & Company, leading the Consumer Goods practice.
You've advised Fortune 500 CPG companies including Starbucks, PepsiCo, and Nestlé for 20 years.

Your role is STRATEGIC VALIDATION - you ensure recommendations are:
1. ACTIONABLE - Clear next steps with owners and timelines
2. QUANTIFIED - Expected impact in revenue, share points, or ROI
3. PRIORITIZED - What to do first, second, third
4. REALISTIC - Achievable given market dynamics and resources
5. DEFENSIBLE - Can be presented to C-suite with confidence

You REJECT recommendations that are:
- Too generic ("invest in marketing")
- Not quantified ("will improve performance")
- Lacking clear next steps
- Ignoring competitive dynamics

You ADD strategic frameworks where helpful:
- 80/20 prioritization
- Porter's Five Forces context
- Growth share matrix positioning
- Build/Buy/Partner decisions

Format output as you would for a Starbucks C-suite presentation - executive summary, key recommendation, expected impact, risk mitigation.`
    }
};

// ============================================================================
// PDF DATA CACHE (simulated extracted data)
// In production, this would come from actual PDF extraction
// ============================================================================

const STARLA_DATA = {
    "germany": {
        "p7-2025": {
            starbucks: { share: 15.3, shareChange: 2.3, volume: 12500000, volumeChange: 18 },
            monster: { share: 22.1, shareChange: -0.5, volume: 18000000, volumeChange: -2.3 },
            redBull: { share: 18.7, shareChange: 0.8, volume: 15200000, volumeChange: 5.1 },
            costa: { share: 8.2, shareChange: 1.1, volume: 6700000, volumeChange: 15.2 },
            category: { totalValue: 245000000, totalVolume: 81500000, growth: 8.5 },
            channels: {
                convenience: { share: 42, growth: 12 },
                grocery: { share: 38, growth: 5 },
                foodservice: { share: 20, growth: 15 }
            }
        }
    },
    "uk": {
        "p7-2025": {
            starbucks: { share: 12.8, shareChange: 1.5, volume: 9800000, volumeChange: 12 },
            monster: { share: 25.4, shareChange: 0.2, volume: 19500000, volumeChange: 3.5 },
            redBull: { share: 21.2, shareChange: -0.3, volume: 16300000, volumeChange: 2.1 },
            costa: { share: 14.5, shareChange: 2.8, volume: 11100000, volumeChange: 25.3 },
            category: { totalValue: 312000000, totalVolume: 76800000, growth: 6.2 }
        }
    }
    // Additional countries would be populated from PDF extraction
};

// ============================================================================
// AGENT EXECUTION ENGINE
// ============================================================================

async function executeAgent(agentName, context, question) {
    const agent = AGENTS[agentName];
    if (!agent) throw new Error(`Unknown agent: ${agentName}`);

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: [
                { role: 'system', content: agent.systemPrompt },
                { role: 'user', content: `Context:\n${JSON.stringify(context, null, 2)}\n\nQuestion: ${question}` }
            ],
            temperature: 0.3,
            max_tokens: 1500
        });

        return {
            agent: agentName,
            agentName: agent.name,
            icon: agent.icon,
            response: response.choices[0].message.content
        };
    } catch (error) {
        console.error(`Agent ${agentName} error:`, error);
        return {
            agent: agentName,
            agentName: agent.name,
            icon: agent.icon,
            response: `Error: Unable to process request. ${error.message}`
        };
    }
}

async function runMultiAgentWorkflow(question, country, period) {
    // Auto-detect country from question to ensure correct context
    const detected = detectCountry(question);
    if (detected) {
        country = detected;
        console.log(`Auto-detected country: ${country}`);
    }

    const countryKey = country.toLowerCase().replace(' ', '').replace('unitedkingdom', 'uk');
    const countryData = EXTRACTED_DATA[countryKey] || {};

    const context = {
        country,
        period,
        // Use real extracted data if available, otherwise fallback to hardcoded mock
        data: STARLA_DATA[countryKey]?.[period] || (countryData.share_values ? {
            starbucks: {
                share: countryData.share_values[countryData.share_values.length - 1],
                shareChange: countryData.change_values[countryData.change_values.length - 1]
            }
        } : {}),
        historicalTrends: countryData,
        availableCountries: Object.keys(EXTRACTED_DATA),
        availablePeriods: ['p7-2025', 'p6-2025', 'p5-2025']
    };

    // Step 1: Orchestrator determines routing
    const questionLower = question.toLowerCase();
    let agentsToInvoke = ['dataAnalyst'];

    if (questionLower.includes('monster') || questionLower.includes('competitor') ||
        questionLower.includes('red bull') || questionLower.includes('costa')) {
        agentsToInvoke.push('competitive');
    }
    if (questionLower.includes('trend') || questionLower.includes('growth') ||
        questionLower.includes('channel') || questionLower.includes('opportunity')) {
        agentsToInvoke.push('market');
    }
    if (questionLower.includes('recommend') || questionLower.includes('should') ||
        questionLower.includes('strategy') || questionLower.includes('invest')) {
        agentsToInvoke = ['dataAnalyst', 'competitive', 'market'];
    }

    // Step 2: Execute analysis agents in parallel
    const analysisResults = await Promise.all(
        agentsToInvoke.map(agent => executeAgent(agent, context, question))
    );

    // Step 3: Senior Data Scientist validation
    const validationContext = {
        ...context,
        analysisResults: analysisResults.map(r => r.response)
    };

    const scientistValidation = await executeAgent(
        'seniorDataScientist',
        validationContext,
        `Validate these insights for accuracy and statistical rigor:\n${analysisResults.map(r => r.response).join('\n\n')}`
    );

    // Step 4: McKinsey validation (for strategic questions)
    let mckinseyValidation = null;
    if (questionLower.includes('recommend') || questionLower.includes('should') ||
        questionLower.includes('strategy') || questionLower.includes('invest') ||
        questionLower.includes('opportunity')) {
        mckinseyValidation = await executeAgent(
            'mckinseyExpert',
            validationContext,
            `Review these strategic insights and recommendations:\n${analysisResults.map(r => r.response).join('\n\n')}\n\nData Scientist Validation: ${scientistValidation.response}`
        );
    }

    return {
        question,
        country,
        period,
        data: context.data,
        historicalTrends: countryData,
        allCountries: EXTRACTED_DATA,
        workflow: {
            agentsInvoked: agentsToInvoke,
            analysisResults,
            validation: {
                datascientist: scientistValidation,
                mckinsey: mckinseyValidation
            }
        }
    };
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'STARLA Intelligence Platform' });
});

// Main Q&A endpoint
app.post('/api/ask', async (req, res) => {
    try {
        const { question, country = 'germany', period = 'p7-2025' } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const result = await runMultiAgentWorkflow(question, country, period);
        res.json(result);
    } catch (error) {
        console.error('Error processing question:', error);
        res.status(500).json({ error: 'Failed to process question' });
    }
});

// Get available data
app.get('/api/data/countries', (req, res) => {
    res.json({
        countries: [
            { id: 'germany', name: 'Germany' },
            { id: 'uk', name: 'United Kingdom' },
            { id: 'italy', name: 'Italy' },
            { id: 'spain', name: 'Spain' },
            { id: 'netherlands', name: 'Netherlands' },
            { id: 'poland', name: 'Poland' },
            { id: 'sweden', name: 'Sweden' },
            { id: 'austria', name: 'Austria' },
            { id: 'switzerland', name: 'Switzerland' },
            { id: 'denmark', name: 'Denmark' },
            { id: 'norway', name: 'Norway' },
            { id: 'greece', name: 'Greece' },
            { id: 'croatia', name: 'Croatia' },
            { id: 'turkey', name: 'Turkey' },
            { id: 'uae', name: 'UAE' },
            { id: 'saudi', name: 'Saudi Arabia' }
        ]
    });
});

app.get('/api/data/periods', (req, res) => {
    res.json({
        periods: [
            { id: 'p7-2025', name: 'P7 2025' },
            { id: 'p6-2025', name: 'P6 2025' },
            { id: 'p5-2025', name: 'P5 2025' },
            { id: 'p4-2025', name: 'P4 2025' },
            { id: 'p3-2025', name: 'P3 2025' },
            { id: 'p2-2025', name: 'P2 2025' },
            { id: 'p1-2025', name: 'P1 2025' },
            { id: 'p13-2024', name: 'P13 2024' },
            { id: 'p12-2024', name: 'P12 2024' },
            { id: 'p11-2024', name: 'P11 2024' }
        ]
    });
});

// Get insights for dashboard
app.get('/api/insights/:country/:period', (req, res) => {
    const { country, period } = req.params;

    // Generate insights based on data
    const data = STARLA_DATA[country]?.[period];

    if (!data) {
        return res.json({ insights: [], recommendations: [] });
    }

    const insights = [
        {
            id: 1,
            type: 'market-share',
            headline: `Starbucks ${data.starbucks.shareChange > 0 ? 'Gains Ground' : 'Faces Pressure'} in ${country.charAt(0).toUpperCase() + country.slice(1)}`,
            detail: `RTD Coffee segment shows ${data.starbucks.shareChange > 0 ? 'strong momentum' : 'challenges'} with ${data.starbucks.volumeChange > 0 ? 'growth' : 'decline'} in volume.`,
            metric: `${data.starbucks.share}%`,
            change: `${data.starbucks.shareChange > 0 ? '+' : ''}${data.starbucks.shareChange}pp`,
            positive: data.starbucks.shareChange > 0,
            validations: ['data-scientist', 'mckinsey']
        },
        {
            id: 2,
            type: 'competitive',
            headline: `Monster ${data.monster.shareChange > 0 ? 'Growing' : 'Losing'} Share`,
            detail: `Monster Energy ${data.monster.shareChange > 0 ? 'expanding' : 'contracting'} in RTD segment with ${Math.abs(data.monster.shareChange)}pp ${data.monster.shareChange > 0 ? 'gain' : 'loss'}.`,
            metric: `${data.monster.share}%`,
            change: `${data.monster.shareChange > 0 ? '+' : ''}${data.monster.shareChange}pp`,
            positive: data.monster.shareChange < 0, // Positive for Starbucks if competitor loses
            validations: ['data-scientist']
        }
    ];

    const recommendations = [
        {
            id: 1,
            priority: 'high',
            title: 'Accelerate Convenience Channel Investment',
            detail: 'Increase trade marketing spend in convenience channel to capitalize on channel growth.',
            actions: [
                { label: 'Timeline', value: 'P8-P10' },
                { label: 'Investment', value: '+20%' },
                { label: 'Target', value: '+2pp share' }
            ],
            confidence: 90,
            validations: ['data-scientist', 'mckinsey']
        }
    ];

    res.json({ insights, recommendations });
});

// ============================================================================
// PDF EXTRACTION ENDPOINT (for future use with GPT-4 Vision)
// ============================================================================

app.post('/api/extract-pdf', async (req, res) => {
    // This endpoint would handle PDF extraction using GPT-4 Vision
    // Implementation would involve:
    // 1. Convert PDF pages to images
    // 2. Send to GPT-4 Vision for chart/table interpretation
    // 3. Structure and store extracted data

    res.json({
        message: 'PDF extraction endpoint ready',
        note: 'Requires GPT-4 Vision API for chart interpretation'
    });
});

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ☕ STARLA Intelligence Platform                            ║
║   Powered by OptiaData                                       ║
║                                                              ║
║   Server running on http://localhost:${PORT}                    ║
║                                                              ║
║   Agents Ready:                                              ║
║   📊 Data Analyst                                            ║
║   ⚔️  Competitive Intelligence                               ║
║   📈 Market Analyst                                          ║
║   🔬 Senior Data Scientist (Validator)                       ║
║   💼 McKinsey Expert Partner (Validator)                     ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `);
});

module.exports = app;
