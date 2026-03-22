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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
          content: `You are a competitive intelligence analyst specialising in the recruitment industry. Given a company profile, identify their top 5 competitors. Return JSON:
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

// ─── Catch-all: serve frontend (Railway SPA support) ───────────
app.get('/{*splat}', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('Stratigen AI API is running. Build frontend with npm run build.');
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✦ Stratigen AI Server running on port ${PORT}`);
});
