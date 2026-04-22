"""
Enhanced semantic matching with synonym expansion, fuzzy matching, and category awareness.
Score breakdown (total 100 pts):
  - GPA component:           40 pts
  - Degree type component:   20 pts
  - Specialization component:20 pts (partial word overlap)
  - Skills component:        20 pts (semantic matching)
"""

# ── Skill synonym groups ──────────────────────────────────────────────────────
# Each entry maps a canonical name to a set of equivalent terms.
SKILL_SYNONYMS = {
    'python':           {'py', 'python3', 'python 3', 'cpython'},
    'javascript':       {'js', 'ecmascript', 'es6', 'es2015', 'es2020', 'vanilla js'},
    'typescript':       {'ts'},
    'react':            {'reactjs', 'react.js', 'react js', 'react native'},
    'vue':              {'vuejs', 'vue.js', 'vue js'},
    'angular':          {'angularjs', 'angular.js'},
    'node':             {'nodejs', 'node.js', 'node js', 'express', 'expressjs'},
    'machine learning': {'ml', 'deep learning', 'neural networks', 'ai', 'artificial intelligence'},
    'data science':     {'data scientist', 'data analysis', 'data analytics', 'data analyst'},
    'sql':              {'mysql', 'postgresql', 'postgres', 'sqlite', 'mssql', 'oracle sql', 'database'},
    'django':           {'django rest framework', 'drf', 'django orm'},
    'flask':            {'flask api'},
    'docker':           {'containerization', 'containers', 'dockerfile'},
    'kubernetes':       {'k8s', 'container orchestration'},
    'git':              {'github', 'gitlab', 'bitbucket', 'version control', 'svn'},
    'aws':              {'amazon web services', 'ec2', 's3', 'lambda', 'cloud'},
    'java':             {'spring', 'spring boot', 'j2ee', 'jvm'},
    'c++':              {'cpp', 'c plus plus'},
    'c#':               {'csharp', 'dotnet', '.net', 'asp.net'},
    'php':              {'laravel', 'symfony', 'wordpress'},
    'communication':    {'presentation', 'public speaking', 'interpersonal', 'verbal communication'},
    'leadership':       {'team lead', 'management', 'project management', 'team management'},
    'agile':            {'scrum', 'kanban', 'sprint', 'jira'},
    'tensorflow':       {'tf', 'keras'},
    'pytorch':          {'torch'},
    'pandas':           {'dataframe', 'data manipulation'},
    'excel':            {'microsoft excel', 'spreadsheet', 'google sheets'},
    'figma':            {'ui design', 'ux design', 'prototyping', 'wireframing'},
    'linux':            {'unix', 'bash', 'shell scripting', 'ubuntu', 'centos'},
    'mongodb':          {'mongo', 'nosql', 'document database'},
    'redis':            {'cache', 'caching', 'in-memory database'},
    'graphql':          {'graph ql', 'apollo'},
    'rest':             {'rest api', 'restful', 'api development', 'web api'},
}

# ── Skill categories for partial credit ──────────────────────────────────────
SKILL_CATEGORIES = {
    'python': 'backend', 'django': 'backend', 'flask': 'backend',
    'fastapi': 'backend', 'ruby': 'backend', 'php': 'backend',
    'java': 'backend', 'c#': 'backend', 'go': 'backend', 'rust': 'backend',
    'javascript': 'frontend', 'react': 'frontend', 'vue': 'frontend',
    'angular': 'frontend', 'typescript': 'frontend', 'html': 'frontend',
    'css': 'frontend', 'sass': 'frontend', 'tailwind': 'frontend',
    'sql': 'database', 'postgresql': 'database', 'mysql': 'database',
    'mongodb': 'database', 'redis': 'database', 'elasticsearch': 'database',
    'docker': 'devops', 'kubernetes': 'devops', 'aws': 'devops',
    'git': 'devops', 'linux': 'devops', 'ci/cd': 'devops', 'jenkins': 'devops',
    'machine learning': 'ai', 'tensorflow': 'ai', 'pytorch': 'ai',
    'pandas': 'ai', 'numpy': 'ai', 'data science': 'ai', 'nlp': 'ai',
    'figma': 'design', 'photoshop': 'design', 'illustrator': 'design',
    'communication': 'soft', 'leadership': 'soft', 'teamwork': 'soft',
    'agile': 'soft', 'problem solving': 'soft', 'critical thinking': 'soft',
}


def normalize_skill(skill: str) -> str:
    """Lowercase, strip, collapse whitespace."""
    return ' '.join(skill.strip().lower().split())


def expand_skill(skill: str) -> set:
    """Return all known synonyms/variants for a skill."""
    normalized = normalize_skill(skill)
    variants = {normalized}
    for canonical, synonyms in SKILL_SYNONYMS.items():
        if normalized == canonical or normalized in synonyms:
            variants.add(canonical)
            variants.update(synonyms)
    return variants


def skills_match(required_skill: str, graduate_skill: str) -> float:
    """
    Return a match score 0.0–1.0 between two individual skills.
    1.0 = exact or synonym match
    0.7 = substring match (one contains the other)
    0.6 = significant word overlap
    0.4 = same technology category
    0.0 = no relationship
    """
    req = normalize_skill(required_skill)
    grad = normalize_skill(graduate_skill)

    if req == grad:
        return 1.0

    # Synonym / variant match
    if expand_skill(req) & expand_skill(grad):
        return 1.0

    # Substring match (bidirectional)
    if req in grad or grad in req:
        return 0.7

    # Word overlap (e.g. "data science" vs "data analysis")
    req_words = set(req.split())
    grad_words = set(grad.split())
    if len(req_words) > 1 or len(grad_words) > 1:
        overlap = len(req_words & grad_words) / max(len(req_words), len(grad_words))
        if overlap >= 0.5:
            return 0.6

    # Same technology category
    req_cat = SKILL_CATEGORIES.get(req)
    grad_cat = SKILL_CATEGORIES.get(grad)
    if req_cat and grad_cat and req_cat == grad_cat:
        return 0.4

    return 0.0


def parse_skills(skills_str: str) -> list:
    """Parse comma-separated skills string into a list."""
    if not skills_str:
        return []
    return [s.strip() for s in skills_str.split(',') if s.strip()]


def compute_skills_score(graduate_skills_str: str, required_skills_str: str) -> float:
    """
    Compute skills component score (0–20 pts) using semantic matching.
    Each required skill is matched against all graduate skills; best match wins.
    """
    required = parse_skills(required_skills_str)
    if not required:
        return 20.0  # No requirements → full marks

    graduate = parse_skills(graduate_skills_str)
    if not graduate:
        return 0.0

    total = 0.0
    for req_skill in required:
        best = max(
            (skills_match(req_skill, grad_skill) for grad_skill in graduate),
            default=0.0
        )
        total += best

    return (total / len(required)) * 20


def compute_match_score(graduate_gpa, graduate_degree, graduate_specialization,
                        graduate_skills_str, required_gpa, required_degree,
                        required_specialization, required_skills_str):
    """
    Compute a match score in [0, 100] between a graduate and a job listing.
    Uses semantic skill matching for the skills component.
    """
    score = 0.0

    # ── GPA component (40 pts) ────────────────────────────────────────────────
    if required_gpa and float(required_gpa) > 0:
        if graduate_gpa is not None:
            gpa_ratio = float(graduate_gpa) / float(required_gpa)
            score += min(gpa_ratio * 40, 40)
    else:
        score += 40  # No GPA requirement → full marks

    # ── Degree type component (20 pts) ───────────────────────────────────────
    if required_degree:
        if graduate_degree and graduate_degree.lower() == required_degree.lower():
            score += 20
    else:
        score += 20  # No degree requirement → full marks

    # ── Specialization component (20 pts) — word overlap ─────────────────────
    if required_specialization:
        if graduate_specialization:
            req_words = set(required_specialization.lower().split())
            grad_words = set(graduate_specialization.lower().split())
            # Remove common stop words
            stop = {'of', 'in', 'and', 'the', 'a', 'an', 'for', 'to'}
            req_words -= stop
            grad_words -= stop
            if req_words:
                overlap = len(req_words & grad_words) / len(req_words)
                score += overlap * 20
    else:
        score += 20  # No specialization requirement → full marks

    # ── Skills component (20 pts) — semantic matching ─────────────────────────
    score += compute_skills_score(graduate_skills_str, required_skills_str)

    return round(min(max(score, 0), 100), 2)
