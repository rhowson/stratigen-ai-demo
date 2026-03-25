import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from './db.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static frontend in production (Railway)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'missing-key-prevent-crash' });

// ─── Scrape & Extract Company Profile ──────────────────────────
app.post('/api/scrape-company', async (req, res) => {
  try {
    const { website } = req.body;
    if (!website) return res.status(400).json({ error: 'Website URL is required' });

    // Normalise URL
    let url = website.trim();
    if (!url.startsWith('http')) url = 'https://' + url;

    // Fetch website HTML
    let htmlText = '';
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; StratiGenAI/1.0)',
          'Accept': 'text/html',
        },
        signal: AbortSignal.timeout(10000),
      });
      const html = await response.text();
      // Strip HTML to text (simple approach)
      htmlText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8000); // Limit to ~8k chars for token efficiency
    } catch (fetchErr) {
      console.log('Website fetch failed, using company name only:', fetchErr.message);
      htmlText = `Could not fetch website. Company URL: ${url}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a business analyst. Extract structured company information from the provided website content. Return JSON with these fields:
{
  "description": "2-3 sentence company description",
  "tagline": "company tagline or value proposition",
  "products": ["list of products/solutions offered"],
  "services": ["list of services offered"],
  "specialisations": ["industry specialisations or sectors they focus on"],
  "locations": ["office locations if mentioned"],
  "teamSize": "estimated team size if mentioned, or 'Unknown'",
  "founded": "year founded if mentioned, or 'Unknown'",
  "clientTypes": ["types of clients they serve"],
  "keyDifferentiators": ["what makes them unique, max 3"]
}
If information is not available, use reasonable inferences from context or return empty arrays/Unknown.`
        },
        {
          role: 'user',
          content: `Extract company information from this website content:\n\n${htmlText}`
        }
      ]
    });

    const profile = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, profile });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Failed to analyse company', details: err.message });
  }
});

// ─── Competitor Analysis ───────────────────────────────────────
app.post('/api/competitor-analysis', async (req, res) => {
  try {
    const { companyName, services, specialisations, description } = req.body;
    if (!companyName) return res.status(400).json({ error: 'Company name is required' });

    const context = [
      `Company: ${companyName}`,
      description ? `Description: ${description}` : '',
      services?.length ? `Services: ${services.join(', ')}` : '',
      specialisations?.length ? `Specialisations: ${specialisations.join(', ')}` : '',
    ].filter(Boolean).join('\n');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a competitive intelligence analyst specialising in the recruitment industry. 
STRICT RULE: Use UK English spelling at all times (e.g., prioritise, organisational, programme, centre, labour).
Given a company profile, identify their top 5 competitors. Return JSON:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "competitor.com",
      "description": "Brief 1-sentence description",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1"],
      "marketPosition": "Leader | Challenger | Niche | Emerging",
      "overlapAreas": ["areas where they compete directly"],
      "threatLevel": "High | Medium | Low"
    }
  ],
  "marketInsights": "2-3 sentences about the competitive landscape",
  "strategicRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`
        },
        {
          role: 'user',
          content: `Analyse competitors for this recruitment company:\n\n${context}`
        }
      ]
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, analysis });
  } catch (err) {
    console.error('Competitor analysis error:', err.message);
    res.status(500).json({ error: 'Failed to analyse competitors', details: err.message });
  }
});

// ─── Map Pain Point to Capabilities (AI) ───────────────────────
app.post('/api/map-pain-point', async (req, res) => {
  try {
    const { text, capabilityNames } = req.body;
    if (!text || !capabilityNames) return res.status(400).json({ error: 'Text and capabilities are required' });

    // Ensure we avoid overwhelming the context with the entire model
    // Just passing a clean list of Level 2 capability objects: { id, name, l1, l0 }
    
    const context = `
Capabilities available for mapping:
${JSON.stringify(capabilityNames, null, 2)}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1, // extremely low for analytical precision
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert business architect. Your task is to map a user's pain point strictly to the most directly impacted Level 2 capabilities.
Rules:
1. ONLY map to capabilities where there is a clear, direct process link.
2. DO NOT map to everything remotely related. Typically 1-3 capabilities maximum.
3. Return ONLY a JSON object containing an array of capability IDs.
Format:
{
  "mappedCapabilityIds": ["capability-id-1", "capability-id-2"]
}`
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nPain Point:\n"${text}"\n\nWhich capability IDs are directly impacted?`
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, mappedCapabilityIds: result.mappedCapabilityIds || [] });
  } catch (err) {
    console.error('Pain point mapping error:', err.message);
    res.status(500).json({ error: 'Failed to map pain point', details: err.message });
  }
});

// ─── Project Database Endpoints ──────────────────────────────

// GET all projects (summarised)
app.get('/api/projects', async (req, res) => {
  try {
    const db = await getDb();
    const projects = await db.all(`SELECT id, name, created_at, updated_at FROM projects ORDER BY updated_at DESC`);
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// GET single project state
app.get('/api/projects/:id', async (req, res) => {
  try {
    const db = await getDb();
    const project = await db.get(`SELECT * FROM projects WHERE id = ?`, [req.params.id]);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true, project: { ...project, state: JSON.parse(project.state_json) } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
});

// POST new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, state } = req.body;
    if (!name || !state) return res.status(400).json({ error: 'Name and state are required' });

    const db = await getDb();
    const id = uuidv4();
    await db.run(
      `INSERT INTO projects (id, name, state_json) VALUES (?, ?, ?)`,
      [id, name, JSON.stringify(state)]
    );
    res.json({ success: true, projectId: id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

// PUT update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { name, state } = req.body;
    const db = await getDb();
    const id = req.params.id;

    const updates = [];
    const params = [];
    
    if (name) { updates.push('name = ?'); params.push(name); }
    if (state) { updates.push('state_json = ?'); params.push(JSON.stringify(state)); }
    
    if (updates.length === 0) return res.status(400).json({ error: 'Nothing to update' });
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const result = await db.run(`UPDATE projects SET ${updates.join(', ')} WHERE id = ?`, params);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
});

// ─── AI-Powered Fix Generation ─────────────────────────────────
app.post('/api/generate-fixes', async (req, res) => {
  try {
    const { companyProfile, companyName, objectives, impactedCapabilities, painsByCapability, maturityScores } = req.body;
    
    if (!impactedCapabilities || impactedCapabilities.length === 0) {
      return res.status(400).json({ error: 'No impacted capabilities provided' });
    }

    console.log(`[AI Fixes] Generating fixes for ${impactedCapabilities.length} capabilities for ${companyName}...`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.5,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a world-class Strategic Management Consultant specializing in the recruitment industry. 
Your task is to generate high-impact, deeply contextual "fixes" for business capabilities.

STRICT RULE: Use UK English spelling at all times (e.g., standardise, optimise, organisational, programme).

You will be provided with:
1. Company Context: Description, products, services, geography, and market position.
2. Strategic Objectives: The specific goals and mission statement.
3. Capability Gaps: Level 2 capabilities with current maturity and user-reported pain points.

Your output must be:
- PERSONALIZED: Use the company name ("${companyName}") naturally within the recommendations.
- MARKET-AWARE: Reference specific geographic or market nuances (e.g., UK labor laws, US healthcare staffing trends).
- DATA-DRIVEN: Include "Real-world Examples" of leading companies (e.g., Hays, Randstad) or technology products (e.g., Bullhorn, Vincere, LinkedIn Recruiter, TextKernel) that excel in this specific capability.

For EACH capability, generate:
- process: Concrete steps to standardize or optimize. Reference specific methodologies.
- people: Training, hiring, or organizational changes. Mention specific roles or skills.
- technology: Specific software, integrations, or AI tools to implement. NAME REAL PRODUCTS.
- data: Metrics to track, data quality improvements, or dashboards.

Rules:
1. ALIGN WITH STRATEGY: Support the provided Strategic Objectives.
2. BE SPECIFIC: Avoid generic advice. Mention specific tools and companies.
3. BE CONCISE: Max 2 rich bullet points per dimension.
4. OUTPUT JSON format:
{
  "fixes": [
    {
      "capabilityId": "string-id",
      "capabilityName": "string",
      "l0Name": "string",
      "l1Name": "string",
      "currentMaturity": number,
      "targetMaturity": number,
      "dimensions": {
        "process": ["bullet with market context"],
        "people": ["bullet with roles"],
        "technology": ["bullet naming real products/examples"],
        "data": ["bullet with specific metrics"]
      }
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Company: ${companyName}\nProfile: ${JSON.stringify(companyProfile)}\nStrategic Objectives: ${JSON.stringify(objectives)}\n\nImpacted Capabilities:\n${JSON.stringify(impactedCapabilities.map(c => ({
            ...c,
            painPoints: painsByCapability[c.l2Id] || [],
            currentMaturity: maturityScores[c.l2Id] || 1
          })))}`
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, fixes: result.fixes || [] });
  } catch (err) {
    console.error('Fix generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate AI fixes', details: err.message });
  }
});

// ─── AI-Powered Work Package Generation ────────────────────────
app.post('/api/generate-work-packages', async (req, res) => {
  try {
    const { companyName, l1Domain, l0Domain, fixes, objectives, companyProfile } = req.body;

    console.log(`[AI Work Packages] Generating consulting package for ${l1Domain} (${companyName})...`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a Senior transformation Programme Manager and Strategic Consultant.
Your task is to synthesize a group of capability fixes into a single, cohesive, formal Work Package.

STRICT RULE: Use UK English spelling at all times (e.g., standardise, optimise, organisational, programme, centre, labour).

You will be provided with:
1. Company & Strategy: Name, profile, and strategic objectives.
2. Fixes: A list of capabilities and their specific multidimensional recommendations (People, Process, Tech, Data).

Return a JSON object:
{
    "workPackage": {
      "id": "formal-wp-id",
      "name": "Professional name for this package",
      "l1Domain": "${l1Domain}",
      "l0Domain": "${l0Domain}",
    "description": "High-level summary of the transformation (2 sentences).",
    "keyActivities": ["4-5 high-impact activities to execute"],
    "keyOutputs": ["3-4 tangible deliverables"],
    "resourcesRequired": ["Roles and specific skills needed"],
    "benefits": ["3-4 strategic benefits aligned with company objectives"],
    "priorityScore": number (1-10 based on urgency and gap),
    "priority": "High" | "Medium" | "Low" (based on score: 8+ High, 5-7 Medium, <5 Low),
    "fixes": [] // Mirror the input fixes back
  }
}`
        },
        {
          role: 'user',
          content: `Company: ${companyName}\nStrategic Objectives: ${JSON.stringify(objectives)}\nProfile: ${JSON.stringify(companyProfile)}\n\nL1 Domain: ${l1Domain}\nL0 Domain: ${l0Domain}\n\nUnderlying Fixes:\n${JSON.stringify(fixes)}`
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, workPackage: result.workPackage });
  } catch (err) {
    console.error('Work package generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate work packages', details: err.message });
  }
});

// ─── AI Use Case Analysis (GPT-powered) ──────────────────────
app.post('/api/generate-ai-analysis', async (req, res) => {
  try {
    const { company, capabilities, painPoints } = req.body;
    if (!capabilities || capabilities.length === 0) {
      return res.status(400).json({ error: 'No impacted capabilities provided' });
    }

    // Build a compact context summary for the prompt
    const capSummaries = capabilities.map(c => ({
      id: c.capabilityId,
      name: c.capabilityName,
      l0: c.l0Name,
      l1: c.l1Name,
      painPoints: c.painPoints || [],
    }));

    console.log(`[AI Analysis] Starting GPT-4o analysis for ${capabilities.length} capabilities...`);
    const startTime = Date.now();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an AI transformation strategist specialising in the recruitment industry. 
STRICT RULE: Use UK English spelling at all times (e.g., standardise, optimise, organisational, programme, centre, labour).
For each business capability provided, identify the most impactful AI enhancement opportunity.
Classify each opportunity into one of three levels:
- Level 1 (Prompt Engineering): Simple AI-assisted tasks — co-pilot style, human in the loop. E.g. AI-drafted emails, summarisation, assisted screening.
- Level 2 (Workflow Automation): Multi-step AI workflows that partially automate processes. E.g. automated CV parsing pipeline, AI-scheduled interviews, smart candidate shortlisting.
- Level 3 (Agentic AI): Autonomous AI agents that own an end-to-end process with minimal human intervention. E.g. fully autonomous sourcing agent, AI-negotiated offer management.

For each capability, return ONE primary use case at the most appropriate level based on its pain points and maturity.
CRITICAL: Keep 'valueAndBenefits' and 'processImpact' to ONE concise sentence each. Keep 'nextSteps' to a list of max 3 very short bullet points. Do not write long paragraphs.

Return a JSON object:
{
  "opportunities": [
    {
      "capabilityId": "string",
      "capabilityName": "string",
      "l0Name": "string",
      "l1Name": "string",
      "level": 1 | 2 | 3,
      "type": "short label e.g. 'Co-Pilot Screening' or 'Autonomous Sourcing Agent'",
      "description": "1 sentence description of the specific AI enhancement",
      "valueAndBenefits": "1 sentence explanation of business value/benefits",
      "processImpact": "1 sentence description of process changes",
      "nextSteps": ["Very short step 1", "Very short step 2", "Very short step 3"],
      "tools": ["list of 2-3 specific AI tools or platforms relevant to this use case"],
      "estimatedImpact": "Low | Medium | High",
      "implementationComplexity": "Low | Medium | High"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Company: ${company || 'Recruitment Agency'}

Impacted Capabilities and their Pain Points:
${JSON.stringify(capSummaries, null, 2)}

For each capability, identify the single best AI use case with level classification.`
        }
      ]
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[AI Analysis] Completed in ${duration}s. Parsing response...`);

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, opportunities: result.opportunities || [] });
  } catch (err) {
    console.error('[AI Analysis] Error:', err.message);
    res.status(500).json({ error: 'Failed to generate AI analysis', details: err.message });
  }
});

// ─── AI Execution Plan Generation ─────────────────────────────
app.post('/api/generate-ai-execution-plan', async (req, res) => {
  try {
    const { companyName, companyProfile, workPackage, objectives } = req.body;

    console.log(`[AI Execution Plan] Generating strategy for ${workPackage.name} (${companyName})...`);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.6,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a Senior Digital Transformation Strategist and AI Implementation Consultant.
Your task is to create a granular, boardroom-ready "AI Execution Plan" for a specific Work Package.

STRICT RULE: Use UK English spelling at all times (e.g., standardise, optimise, organisational, programme, centre, labour).

Focus on the AI components within the work package and assess how AI is used to solve the underlying pain points.

Return a JSON object:
{
  "plan": {
    "workPackageId": "${workPackage.id}",
    "workPackageName": "${workPackage.name}",
    "strategicContext": "1 sentence on why this AI initiative is critical for the North Star vision.",
    "analysis": {
      "strategic": { "process": "...", "people": "...", "technology": "..." },
      "legal": { "process": "...", "people": "...", "technology": "..." },
      "ethical": { "process": "...", "people": "...", "technology": "..." },
      "financial": { "process": "...", "people": "...", "technology": "..." }
    },
    "implementationRoadmap": {
      "level1": {
        "title": "Direct LLM Prompting",
        "prompt": "Provide a specific, ready-to-use, professional LLM prompt to address a core task in this package."
      },
      "level2": {
        "title": "Sequential Workflow",
        "steps": [
          { "task": "Step description", "prompt": "Prompt for this step", "hitl": "Human-in-the-loop / Regulatory control point" }
        ]
      },
      "level3": {
        "title": "Autonomous AI Agent",
        "agentRole": "Professional persona of the agent",
        "keyTasks": ["3-4 tasks for end-to-end delivery"],
        "intervention": "Description of why human intervention is minimal"
      }
    },
    "executionOutline": {
      "decisions": ["List of key choices"],
      "artefacts": ["Output documents/models"],
      "technologies": ["Tools/Stacks"],
      "dataRequirements": ["Data sets/Standards"]
    }
  }
}

Content Guidelines:
- Analysis: Keep each perspective (People, Process, Tech) to 1 concise, high-impact sentence to make space for the Solutions.
- Level 1: Generate a literal "Copy-Paste" style prompt.
- Level 2: Define a logical flow of 3-4 steps. Ensure HITL points address the Legal/Ethical constraints.
- Level 3: Focus on sophisticated agentic behavior (e.g., self-correction, tool use).
- Use UK English (standardise, optimise, etc.).`
        },
        {
          role: 'user',
          content: `Company: ${companyName}\nProfile: ${JSON.stringify(companyProfile)}\n\nWork Package: ${JSON.stringify(workPackage)}`
        }
      ]
    });

    const result = JSON.parse(completion.choices[0].message.content);
    res.json({ success: true, plan: result.plan });
  } catch (err) {
    console.error('Execution plan generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate execution plan', details: err.message });
  }
});

// New Endpoint: Generate Detailed AI Spec
app.post('/api/generate-ai-spec', async (req, res) => {
  const { level, suggestion, workPackageName, context, guardrails } = req.body;

  try {
    const systemPrompt = `You are an elite AI Solutions Architect. Your task is to expand a high-level AI implementation suggestion into a detailed, technical specification for a professional environment.
    
    Level ${level} Implementation Focus:
    ${level === 1 ? 'Focus on a single, high-performance LLM PROMPT.' : level === 2 ? 'Focus on a PROMPT CHAIN / WORKFLOW with Human-in-the-loop checkpoints.' : 'Focus on an AUTONOMOUS AGENT PERSONA with strict guardrails.'}
    
    Structure your response as a JSON object with:
    - role: Define who the AI is (e.g., "You are an expert recruitment copywriter").
    - task: Clear, action-oriented verbs (e.g., "Summarize candidate CVs against these 5 criteria...").
    - context: Provide 2-3 paragraphs of background information, goals, and constraints. This MUST be a plain string, not an object. Include any provided Guardrails.
    - formatStyle: Define output structure (Table, JSON, Email) and tone (Professional, Empathetic).
    - examples: A few-shot sample showing the desired style/output.
    ${level === 2 ? '- promptChain: Array of steps, each with a specific sub-prompt.' : ''}
    ${level === 3 ? '- agentConfig: { persona: string, tools: string[], redLines: string[] }' : ''}

    Incorporate these company Guardrails (Red Lines):
    ${(guardrails || []).map(g => `- ${g}`).join('\n')}

    Context: Improving ${workPackageName}.
    Strategic Context: ${JSON.stringify(context)}
    Suggestion: ${suggestion}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate a detailed Level ${level} Spec for: ${suggestion}` }
      ],
      response_format: { type: "json_object" }
    });

    res.json({ success: true, spec: JSON.parse(completion.choices[0].message.content) });
  } catch (error) {
    console.error('AI Spec Generation Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate AI spec' });
  }
});


// ─── Catch-all: serve frontend (Railway SPA support) ───────────
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    const indexPath = path.join(distPath, 'index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(200).send('Stratigen AI API is running. Build frontend with npm run build.');
      }
    });
  }
  next();
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✦ Stratigen AI Server running on port ${PORT}`);
});
