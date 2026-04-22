/**
 * Semantic skill matching utility — mirrors the Python jobs/matching.py logic.
 * Used by JobGapAnalyzer, SuccessPredictor, and the CV Builder.
 */

const SKILL_SYNONYMS: Record<string, string[]> = {
  python:           ['py', 'python3', 'python 3', 'cpython'],
  javascript:       ['js', 'ecmascript', 'es6', 'es2015', 'vanilla js'],
  typescript:       ['ts'],
  react:            ['reactjs', 'react.js', 'react js', 'react native'],
  vue:              ['vuejs', 'vue.js'],
  angular:          ['angularjs', 'angular.js'],
  node:             ['nodejs', 'node.js', 'express', 'expressjs'],
  'machine learning': ['ml', 'deep learning', 'neural networks', 'ai', 'artificial intelligence'],
  'data science':   ['data scientist', 'data analysis', 'data analytics', 'data analyst'],
  sql:              ['mysql', 'postgresql', 'postgres', 'sqlite', 'database'],
  django:           ['django rest framework', 'drf'],
  docker:           ['containerization', 'containers'],
  kubernetes:       ['k8s'],
  git:              ['github', 'gitlab', 'bitbucket', 'version control'],
  aws:              ['amazon web services', 'ec2', 's3', 'lambda', 'cloud'],
  java:             ['spring', 'spring boot'],
  'c++':            ['cpp', 'c plus plus'],
  'c#':             ['csharp', 'dotnet', '.net'],
  communication:    ['presentation', 'public speaking', 'interpersonal'],
  leadership:       ['team lead', 'management', 'project management'],
  agile:            ['scrum', 'kanban', 'sprint'],
  tensorflow:       ['tf', 'keras'],
  pytorch:          ['torch'],
  figma:            ['ui design', 'ux design', 'prototyping', 'wireframing'],
  linux:            ['unix', 'bash', 'shell scripting'],
  mongodb:          ['mongo', 'nosql'],
  rest:             ['rest api', 'restful', 'api development'],
};

const SKILL_CATEGORIES: Record<string, string> = {
  python: 'backend', django: 'backend', flask: 'backend', java: 'backend',
  'c#': 'backend', php: 'backend', go: 'backend', ruby: 'backend',
  javascript: 'frontend', react: 'frontend', vue: 'frontend', angular: 'frontend',
  typescript: 'frontend', html: 'frontend', css: 'frontend', tailwind: 'frontend',
  sql: 'database', postgresql: 'database', mysql: 'database', mongodb: 'database',
  redis: 'database', elasticsearch: 'database',
  docker: 'devops', kubernetes: 'devops', aws: 'devops', git: 'devops', linux: 'devops',
  'machine learning': 'ai', tensorflow: 'ai', pytorch: 'ai', pandas: 'ai', 'data science': 'ai',
  figma: 'design', photoshop: 'design', illustrator: 'design',
  communication: 'soft', leadership: 'soft', teamwork: 'soft', agile: 'soft',
};

function normalize(skill: string): string {
  return skill.trim().toLowerCase().replace(/\s+/g, ' ');
}

function expandSkill(skill: string): Set<string> {
  const n = normalize(skill);
  const variants = new Set<string>([n]);
  for (const [canonical, synonyms] of Object.entries(SKILL_SYNONYMS)) {
    if (n === canonical || synonyms.includes(n)) {
      variants.add(canonical);
      synonyms.forEach(s => variants.add(s));
    }
  }
  return variants;
}

/** Returns 0.0–1.0 match score between two individual skills */
export function skillsMatch(required: string, graduate: string): number {
  const req = normalize(required);
  const grad = normalize(graduate);

  if (req === grad) return 1.0;

  // Synonym match
  const reqV = expandSkill(req);
  const gradV = expandSkill(grad);
  for (const v of reqV) { if (gradV.has(v)) return 1.0; }

  // Substring match
  if (req.includes(grad) || grad.includes(req)) return 0.7;

  // Word overlap
  const reqW = new Set(req.split(' '));
  const gradW = new Set(grad.split(' '));
  if (reqW.size > 1 || gradW.size > 1) {
    const intersection = [...reqW].filter(w => gradW.has(w)).length;
    const overlap = intersection / Math.max(reqW.size, gradW.size);
    if (overlap >= 0.5) return 0.6;
  }

  // Category match
  const reqCat = SKILL_CATEGORIES[req];
  const gradCat = SKILL_CATEGORIES[grad];
  if (reqCat && gradCat && reqCat === gradCat) return 0.4;

  return 0.0;
}

export function parseSkills(skillsStr: string): string[] {
  if (!skillsStr) return [];
  return skillsStr.split(',').map(s => s.trim()).filter(Boolean);
}

export interface SkillMatchResult {
  skill: string;
  score: number;       // 0–1
  matchType: 'exact' | 'synonym' | 'partial' | 'category' | 'none';
  matchedWith?: string;
}

/** Analyze how well a graduate's skills match a list of required skills */
export function analyzeSkillMatch(
  graduateSkillsStr: string,
  requiredSkillsStr: string
): {
  matched: SkillMatchResult[];
  missing: string[];
  extra: string[];
  overallScore: number; // 0–100
} {
  const required = parseSkills(requiredSkillsStr);
  const graduate = parseSkills(graduateSkillsStr);

  if (required.length === 0) {
    return { matched: [], missing: [], extra: graduate, overallScore: 100 };
  }

  const matched: SkillMatchResult[] = [];
  const missing: string[] = [];

  for (const req of required) {
    let bestScore = 0;
    let bestGrad = '';
    for (const grad of graduate) {
      const s = skillsMatch(req, grad);
      if (s > bestScore) { bestScore = s; bestGrad = grad; }
    }

    const matchType =
      bestScore >= 1.0 ? 'exact' :
      bestScore >= 0.7 ? 'synonym' :
      bestScore >= 0.5 ? 'partial' :
      bestScore >= 0.3 ? 'category' : 'none';

    if (bestScore > 0) {
      matched.push({ skill: req, score: bestScore, matchType, matchedWith: bestGrad });
    } else {
      missing.push(req);
    }
  }

  const extra = graduate.filter(g =>
    !required.some(r => skillsMatch(r, g) > 0.3)
  );

  const totalScore = matched.reduce((sum, m) => sum + m.score, 0);
  const overallScore = Math.round((totalScore / required.length) * 100);

  return { matched, missing, extra, overallScore };
}
