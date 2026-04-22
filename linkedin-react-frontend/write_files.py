#!/usr/bin/env python3
"""Script to write all GraduateConnect feature files."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def write(rel_path, content):
    full = os.path.join(BASE, rel_path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {rel_path} ({len(content)} chars)")

# ─── TASK 2: jobs/matching.py ─────────────────────────────────────────────────
MATCHING_PY = '''\
"""
Enhanced semantic matching with synonym expansion and fuzzy matching.
"""

SKILL_SYNONYMS = {
    'python': {'py', 'python3', 'python 3', 'cpython'},
    'javascript': {'js', 'javascript', 'ecmascript', 'es6', 'es2015'},
    'typescript': {'ts', 'typescript'},
    'react': {'reactjs', 'react.js', 'react js'},
    'node': {'nodejs', 'node.js', 'node js'},
    'machine learning': {'ml', 'machine learning', 'deep learning', 'ai', 'artificial intelligence'},
    'sql': {'mysql', 'postgresql', 'postgres', 'sqlite', 'mssql', 'oracle sql'},
    'django': {'django rest framework', 'drf'},
    'docker': {'containerization', 'containers'},
    'git': {'github', 'gitlab', 'version control'},
    'data science': {'data scientist', 'data analysis', 'data analytics', 'data analyst'},
    'java': {'spring', 'spring boot', 'j2ee'},
    'c++': {'cpp', 'c plus plus'},
    'aws': {'amazon web services', 'ec2', 's3', 'lambda'},
    'communication': {'presentation', 'public speaking', 'interpersonal'},
    'leadership': {'team lead', 'management', 'project management'},
}

SKILL_CATEGORIES = {
    'python': 'backend', 'django': 'backend', 'flask': 'backend', 'fastapi': 'backend',
    'javascript': 'frontend', 'react': 'frontend', 'vue': 'frontend', 'angular': 'frontend', 'typescript': 'frontend',
    'sql': 'database', 'postgresql': 'database', 'mysql': 'database', 'mongodb': 'database', 'redis': 'database',
    'docker': 'devops', 'kubernetes': 'devops', 'aws': 'devops', 'git': 'devops',
    'machine learning': 'ai', 'tensorflow': 'ai', 'pytorch': 'ai', 'pandas': 'ai', 'numpy': 'ai',
}


def normalize_skill(skill: str) -> str:
    return skill.strip().lower()


def expand_skill(skill: str) -> set:
    """Return a set of all synonyms/variants for a skill."""
    normalized = normalize_skill(skill)
    variants = {normalized}
    for canonical, synonyms in SKILL_SYNONYMS.items():
        if normalized == canonical or normalized in synonyms:
            variants.add(canonical)
            variants.update(synonyms)
    return variants


def skills_match(required_skill: str, graduate_skill: str) -> float:
    """
    Return a match score 0.0-1.0 between two skills.
    1.0 = exact/synonym match
    0.7 = partial/substring match
    0.4 = same category
    0.0 = no match
    """
    req = normalize_skill(required_skill)
    grad = normalize_skill(graduate_skill)

    if req == grad:
        return 1.0

    req_variants = expand_skill(req)
    grad_variants = expand_skill(grad)
    if req_variants & grad_variants:
        return 1.0

    if req in grad or grad in req:
        return 0.7

    req_words = set(req.split())
    grad_words = set(grad.split())
    if len(req_words) > 1 and len(grad_words) > 1:
        overlap = len(req_words & grad_words) / max(len(req_words), len(grad_words))
        if overlap >= 0.5:
            return 0.6

    req_cat = SKILL_CATEGORIES.get(req)
    grad_cat = SKILL_CATEGORIES.get(grad)
    if req_cat and grad_cat and req_cat == grad_cat:
        return 0.4

    return 0.0


def parse_skills(skills_str: str) -> list:
    if not skills_str:
        return []
    return [s.strip() for s in skills_str.split(',') if s.strip()]


def compute_skills_score(graduate_skills_str: str, required_skills_str: str) -> float:
    """Compute skills component score (0-20 pts) using semantic matching."""
    required = parse_skills(required_skills_str)
    if not required:
        return 20.0

    graduate = parse_skills(graduate_skills_str)
    if not graduate:
        return 0.0

    total_score = 0.0
    for req_skill in required:
        best_match = max(
            (skills_match(req_skill, grad_skill) for grad_skill in graduate),
            default=0.0
        )
        total_score += best_match

    return (total_score / len(required)) * 20


def compute_match_score(graduate_gpa, graduate_degree, graduate_specialization,
                        graduate_skills_str, required_gpa, required_degree,
                        required_specialization, required_skills_str):
    """Compute a match score in [0, 100] with semantic skill matching."""
    score = 0.0

    # GPA component (40 pts)
    if required_gpa and float(required_gpa) > 0:
        if graduate_gpa is not None:
            gpa_ratio = float(graduate_gpa) / float(required_gpa)
            score += min(gpa_ratio * 40, 40)
    else:
        score += 40

    # Degree type component (20 pts)
    if required_degree:
        if graduate_degree and graduate_degree.lower() == required_degree.lower():
            score += 20
    else:
        score += 20

    # Specialization component (20 pts) with partial matching
    if required_specialization:
        if graduate_specialization:
            req_words = set(required_specialization.lower().split())
            grad_words = set(graduate_specialization.lower().split())
            overlap = len(req_words & grad_words) / max(len(req_words), 1)
            score += overlap * 20
    else:
        score += 20

    # Skills component (20 pts) semantic matching
    score += compute_skills_score(graduate_skills_str, required_skills_str)

    return round(min(max(score, 0), 100), 2)
'''

write('../jobs/matching.py', MATCHING_PY)
print("matching.py done")
