#!/usr/bin/env python3
"""Write skillMatcher.ts"""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def write(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {rel_path} ({len(content)} chars)")

# ─── TASK 6: skillMatcher.ts ──────────────────────────────────────────────────
SKILL_MATCHER = """\
/**
 * Semantic skill matching utility — mirrors the Python matching logic.
 * Used by JobGapAnalyzer and SuccessPredictor for better matching.
 */

export const SKILL_SYNONYMS: Record<string, Set<string>> = {
  python:            new Set(['py', 'python3', 'python 3', 'cpython']),
  javascript:        new Set(['js', 'javascript', 'ecmascript', 'es6', 'es2015']),
  typescript:        new Set(['ts', 'typescript']),
  react:             new Set(['reactjs', 'react.js', 'react js']),
  node:              new Set(['nodejs', 'node.js', 'node js']),
  'machine learning':new Set(['ml', 'machine learning', 'deep learning', 'ai', 'artificial intelligence']),
  sql:               new Set(['mysql', 'postgresql', 'postgres', 'sqlite', 'mssql', 'oracle sql']),
  django:            new Set(['django rest framework', 'drf']),
  docker:            new Set(['containerization', 'containers']),
  git:               new Set(['github', 'gitlab', 'version control']),
  'data science':    new Set(['data scientist', 'data analysis', 'data analytics', 'data analyst']),
  java:              new Set(['spring', 'spring boot', 'j2ee']),
  'c++':             new Set(['cpp', 'c plus plus']),
  aws:               new Set(['amazon web services', 'ec2', 's3', 'lambda']),
  communication:     new Set(['presentation', 'public speaking', 'interpersonal']),
  leadership:        new Set(['team lead', 'management', 'project management']),
};

export const SKILL_CATEGORIES: Record<string, string> = {
  python: 'backend', django: 'backend', flask: 'backend', fastapi: 'backend',
  javascript: 'frontend', react: 'frontend', vue: 'frontend', angular: 'frontend', typescript: 'frontend',
  sql: 'database', postgresql: 'database', mysql: 'database', mongodb: 'database', redis: 'database',
  docker: 'devops', kubernetes: 'devops', aws: 'devops', git: 'devops',
  'machine learning': 'ai', tensorflow: 'ai', pytorch: 'ai', pandas: 'ai', numpy: 'ai',
};

export function normalizeSkill(skill: string): string {
  return skill.trim().toLowerCase();
}

export function expandSkill(skill: string): Set<string> {
  const normalized = normalizeSkill(skill);
  const variants = new Set<string>([normalized]);
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (normalized === canonical || synonyms.has(normalized)) {
      variants.add(canonical);
      synonyms.forEach(s => variants.add(s));
    }
  }
  return variants;
}

/**
 * Returns a match score 0.0–1.0 between two skills.
 * 1.0 = exact/synonym match
 * 0.7 = partial/substring match
 * 0.6 = word overlap
 * 0.4 = same category
 * 0.0 = no match
 */
export function skillsMatch(requiredSkill: string, graduateSkill: string): number {
  const req  = normalizeSkill(requiredSkill);
  const grad = normalizeSkill(graduateSkill);

  if (req === grad) return 1.0;

  const reqVariants  = expandSkill(req);
  const gradVariants = expandSkill(grad);
  for (const v of reqVariants) {
    if (gradVariants.has(v)) return 1.0;
  }

  if (req.includes(grad) || grad.includes(req)) return 0.7;

  const reqWords  = new Set(req.split(' ').filter(Boolean));
  const gradWords = new Set(grad.split(' ').filter(Boolean));
  if (reqWords.size > 1 && gradWords.size > 1) {
    let overlap = 0;
    reqWords.forEach(w => { if (gradWords.has(w)) overlap++; });
    const ratio = overlap / Math.max(reqWords.size, gradWords.size);
    if (ratio >= 0.5) return 0.6;
  }

  const reqCat  = SKILL_CATEGORIES[req];
  const gradCat = SKILL_CATEGORIES[grad];
  if (reqCat && gradCat && reqCat === gradCat) return 0.4;

  return 0.0;
}

export function parseSkills(skillsStr: string): string[] {
  if (!skillsStr) return [];
  return skillsStr.split(',').map(s => s.trim()).filter(Boolean);
}

/**
 * Compute skills match score (0–100) between two comma-separated skill strings.
 */
export function computeSkillsScore(graduateSkillsStr: string, requiredSkillsStr: string): number {
  const required = parseSkills(requiredSkillsStr);
  if (required.length === 0) return 100;

  const graduate = parseSkills(graduateSkillsStr);
  if (graduate.length === 0) return 0;

  let totalScore = 0;
  for (const reqSkill of required) {
    const best = Math.max(...graduate.map(g => skillsMatch(reqSkill, g)), 0);
    totalScore += best;
  }
  return Math.round((totalScore / required.length) * 100);
}

/**
 * Returns matched, missing, and partial skill arrays for gap analysis.
 */
export interface SkillGapResult {
  matched:  string[];
  partial:  string[];
  missing:  string[];
  score:    number;
}

export function analyzeSkillGap(graduateSkillsStr: string, requiredSkillsStr: string): SkillGapResult {
  const required = parseSkills(requiredSkillsStr);
  const graduate = parseSkills(graduateSkillsStr);

  const matched: string[]  = [];
  const partial: string[]  = [];
  const missing: string[]  = [];

  for (const req of required) {
    let best = 0;
    for (const grad of graduate) {
      const s = skillsMatch(req, grad);
      if (s > best) best = s;
    }
    if (best >= 0.9)      matched.push(req);
    else if (best >= 0.4) partial.push(req);
    else                  missing.push(req);
  }

  const score = required.length > 0
    ? Math.round(((matched.length + partial.length * 0.5) / required.length) * 100)
    : 100;

  return { matched, partial, missing, score };
}
"""

write('src/utils/skillMatcher.ts', SKILL_MATCHER)
print("skillMatcher.ts done")
