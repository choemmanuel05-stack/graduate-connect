"""
Job Matching Algorithm — Graduate-Connect
==========================================
Scores graduate-job compatibility based on:
  - Skills overlap        (45 pts)  per spec Appendix B.1
  - GPA threshold         (25 pts)
  - Degree match          (30 pts)

Total: 100 pts maximum.
"""
from .models import GraduateProfile, Job


def calculate_match_score(graduate: GraduateProfile, job: Job) -> float:
    """
    Returns a match score 0–100 between a graduate and a job.
    Mirrors the algorithm in Appendix B.1 of the specification.
    """
    score = 0.0

    # ── GPA matching (25 pts) ─────────────────────────────────────────────────
    if graduate.gpa is not None and job.required_gpa is not None:
        if graduate.gpa >= job.required_gpa:
            score += 25
    elif graduate.gpa is not None:
        # No GPA requirement — award partial points for having a good GPA
        if graduate.gpa >= 3.5:
            score += 20
        elif graduate.gpa >= 3.0:
            score += 12
        elif graduate.gpa >= 2.5:
            score += 6

    # ── Degree / specialisation matching (30 pts) ────────────────────────────
    if job.required_degree and graduate.degree:
        if graduate.degree.lower() == job.required_degree.lower():
            score += 30
        elif any(
            word in graduate.degree.lower()
            for word in job.required_degree.lower().split()
        ):
            score += 15  # Partial match
    elif graduate.degree:
        score += 10  # Base points for having any degree

    # ── Skills matching (45 pts) ──────────────────────────────────────────────
    if job.required_skills and graduate.skills:
        required = {s.strip().lower() for s in job.required_skills.split(',') if s.strip()}
        available = {s.strip().lower() for s in graduate.skills.split(',') if s.strip()}
        if required:
            overlap = len(required & available) / len(required)
            score += overlap * 45

    return min(round(score, 1), 100.0)


def get_recommended_jobs(graduate: GraduateProfile, limit: int = 10) -> list:
    """Returns top matching jobs for a graduate, sorted by score."""
    jobs = Job.objects.filter(status='open').select_related('employer')
    scored = [
        (calculate_match_score(graduate, job), job)
        for job in jobs
    ]
    scored = [(s, j) for s, j in scored if s > 20]
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[:limit]


def get_recommended_graduates(job: Job, limit: int = 20) -> list:
    """Returns top matching graduates for a job, sorted by score."""
    graduates = GraduateProfile.objects.filter(is_available=True)
    scored = [
        (calculate_match_score(grad, job), grad)
        for grad in graduates
    ]
    scored = [(s, g) for s, g in scored if s > 15]
    scored.sort(key=lambda x: x[0], reverse=True)
    return scored[:limit]
