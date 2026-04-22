"""
Smart Job Matching Algorithm
Scores graduate-job compatibility based on skills, degree, GPA, and field of study.
"""
from .models import GraduateProfile, Job


def calculate_match_score(graduate: GraduateProfile, job: Job) -> float:
    """Returns a match score 0-100 between a graduate and a job."""
    score = 0.0

    # Skills match (40 points)
    if job.required_skills and graduate.skills:
        job_skills = {s.strip().lower() for s in job.required_skills.split(',')}
        grad_skills = {s.strip().lower() for s in graduate.skills.split(',')}
        if job_skills:
            overlap = len(job_skills & grad_skills) / len(job_skills)
            score += overlap * 40

    # Degree match (20 points)
    if job.required_skills:  # Use as proxy — in real app, job would have degree field
        score += 10  # Base points for having a degree

    # GPA bonus (15 points)
    if graduate.gpa:
        if graduate.gpa >= 3.5:
            score += 15
        elif graduate.gpa >= 3.0:
            score += 10
        elif graduate.gpa >= 2.5:
            score += 5

    # Field of study relevance (15 points)
    if graduate.field_of_study and job.required_skills:
        field_lower = graduate.field_of_study.lower()
        skills_lower = job.required_skills.lower()
        if any(word in skills_lower for word in field_lower.split()):
            score += 15

    # Availability bonus (10 points)
    if graduate.is_available:
        score += 10

    return min(round(score, 1), 100.0)


def get_recommended_jobs(graduate: GraduateProfile, limit: int = 10) -> list:
    """Returns top matching jobs for a graduate, sorted by score."""
    jobs = Job.objects.filter(status='open').select_related('employer')
    scored = []
    for job in jobs:
        score = calculate_match_score(graduate, job)
        if score > 20:  # Only include reasonable matches
            scored.append((score, job))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [(score, job) for score, job in scored[:limit]]


def get_recommended_graduates(job: Job, limit: int = 20) -> list:
    """Returns top matching graduates for a job, sorted by score."""
    graduates = GraduateProfile.objects.filter(is_available=True)
    scored = []
    for grad in graduates:
        score = calculate_match_score(grad, job)
        if score > 15:
            scored.append((score, grad))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [(score, grad) for score, grad in scored[:limit]]
