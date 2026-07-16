import os
import json
import logging
import random
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini if key is provided
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

import re

def generate_mock_feedback(resume_text: str, job_description: str) -> dict:
    """Generates a smart, dynamic mock feedback based on actual JD and Resume content."""
    # List of common tech and office skill keywords to scan for
    tech_keywords = [
        "Python", "SQL", "Excel", "Google Sheets", "Postman", "REST", "API", "JSON", 
        "Frappe", "ERPNext", "ChatGPT", "Claude", "LLMs", "JavaScript", "HTML", "CSS",
        "React", "Docker", "Kubernetes", "AWS", "FastAPI", "Git", "GitHub", "System Design",
        "CI/CD", "Next.js", "Node.js", "Java", "C++", "No-code", "Automation", "Scripting"
    ]
    
    jd_lower = job_description.lower()
    resume_lower = resume_text.lower()
    
    # 1. Dynamically extract skills present in the Job Description
    jd_skills = []
    for skill in tech_keywords:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        # Special cases for strings with symbols/spaces
        if skill.lower() in ["c++", "ci/cd", "google sheets", "no-code"]:
            pattern = re.escape(skill.lower())
        if re.search(pattern, jd_lower):
            jd_skills.append(skill)
            
    # Default fallback skills if none from the list matched the JD
    if not jd_skills:
        jd_skills = ["Python", "SQL", "Excel", "JavaScript", "HTML", "CSS"]
        
    # Check candidate matching vs. missing skills
    matched_skills = []
    missing_skills = []
    for skill in jd_skills:
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if skill.lower() in ["c++", "ci/cd", "google sheets", "no-code"]:
            pattern = re.escape(skill.lower())
        if re.search(pattern, resume_lower):
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)
            
    # Create detailed missing skill suggestions
    missing_skills_formatted = []
    for skill in missing_skills:
        missing_skills_formatted.append({
            "skill": skill,
            "suggestion": f"Highlight any projects, coursework, or certifications related to {skill} on your resume, or build a simple portfolio project using {skill} to show familiarity."
        })

    # 2. Parse Experience requirements dynamically
    # Look for "X-Y years", "X+ years", "X years" in Job Description
    # We filter out matches that mention education/degree/course to distinguish experience from course duration
    exp_jd_matches = re.finditer(r'(\d+)\s*(?:-\s*(\d+))?\s*\+?\s*(?:year|yr)s?', jd_lower)
    required_exp_years = 0
    required_exp_str = "0 years"
    
    for m in exp_jd_matches:
        start = max(0, m.start() - 40)
        end = min(len(jd_lower), m.end() + 40)
        context = jd_lower[start:end]
        # Ignore education-related numbers (e.g. "4-year degree")
        if any(x in context for x in ["degree", "course", "education", "study", "program"]):
            continue
        
        # Accept if context mentions experience or hiring/requirement terms
        if any(x in context for x in ["experience", "work", "practice", "history", "background", "need", "require", "looking"]):
            val1 = int(m.group(1))
            val2 = m.group(2)
            if val2:
                required_exp_years = val1
                required_exp_str = f"{val1}-{val2} years"
            else:
                required_exp_years = val1
                required_exp_str = f"{val1}+ years"
            break
        
    # Look for candidate experience years in Resume
    exp_resume_matches = re.finditer(r'(\d+)\s*(?:-\s*(\d+))?\s*\+?\s*(?:year|yr)s?', resume_lower)
    candidate_exp_years = 0
    candidate_exp_str = "0-1 years"
    
    for m in exp_resume_matches:
        start = max(0, m.start() - 45)
        end = min(len(resume_lower), m.end() + 45)
        context = resume_lower[start:end]
        # Ignore education/graduation course lengths (e.g. "3-year course")
        if any(x in context for x in ["degree", "course", "education", "study", "college", "university", "graduation"]):
            continue
            
        if any(x in context for x in ["experience", "work", "professional", "history", "job", "position", "role", "industry"]):
            val1 = int(m.group(1))
            val2 = m.group(2)
            if val2:
                candidate_exp_years = int(val2)
                candidate_exp_str = f"{val1}-{val2} years"
            else:
                candidate_exp_years = val1
                candidate_exp_str = f"{val1}+ years"
            break
            
    # Apply user rule: if less than 1 year or not found, consider it 0-1 years (0 years)
    if candidate_exp_years < 1:
        candidate_exp_years = 0
        candidate_exp_str = "0-1 years"

    # Evaluate experience match
    exp_match = "yes"
    exp_feedback = ""
    exp_suggestions = []
    
    if required_exp_years == 0:
        exp_match = "yes"
        exp_feedback = "The job description does not list any specific experience requirements (0 years). Your entry-level background matches this position perfectly."
    elif candidate_exp_years >= required_exp_years:
        exp_match = "yes"
        exp_feedback = f"Your experience ({candidate_exp_str}) meets the requirement of {required_exp_str}."
    elif candidate_exp_years > 0:
        exp_match = "partial"
        exp_feedback = f"The role prefers {required_exp_str} of experience. Your resume indicates about {candidate_exp_str}."
        exp_suggestions.append("Detail key responsibilities in your projects to demonstrate a high level of autonomy.")
    else:
        exp_match = "no"
        exp_feedback = f"This position requires {required_exp_str} of experience, whereas your resume shows {candidate_exp_str}."
        exp_suggestions.append("Highlight any internships, college projects, or bootcamp experience as hands-on years of software development.")

    # 3. Parse Education requirements dynamically
    edu_degrees = ["bachelor", "master", "phd", "degree", "bs", "ms", "btech", "mtech", "mca", "bca", "diploma"]
    required_edu = "Not specified"
    found_edu_req = []
    
    for deg in edu_degrees:
        if deg in jd_lower:
            found_edu_req.append(deg.capitalize())
    if found_edu_req:
        required_edu = f"Degree in technical field (mentions {', '.join(found_edu_req[:2])})"
        
    found_cand_edu = []
    for deg in edu_degrees:
        if deg in resume_lower:
            found_cand_edu.append(deg.capitalize())
            
    candidate_edu_str = "Not specified in resume"
    if found_cand_edu:
        candidate_edu_str = f"Mentions {', '.join(found_cand_edu[:2])}"
        
    edu_match = "yes"
    edu_feedback = "Education requirements are fully met."
    
    if required_edu != "Not specified":
        has_edu_match = any(deg.lower() in resume_lower for deg in edu_degrees if deg in jd_lower)
        if has_edu_match:
            edu_match = "yes"
            edu_feedback = "Your education background matches the requirements listed in the job description."
        else:
            edu_match = "partial"
            edu_feedback = f"The job description mentions a preference for a {required_edu}, which was not explicitly found in your resume."
    else:
        edu_match = "yes"
        edu_feedback = "No specific education requirement is listed in the job description."

    # 4. Calculate Scores based on dynamic match values
    skills_total = len(jd_skills)
    skills_matched = len(matched_skills)
    skills_score = int((skills_matched / max(1, skills_total)) * 100)
    skills_score = max(40, min(100, skills_score))
    
    exp_score = 100 if exp_match == "yes" else (70 if exp_match == "partial" else 45)
    edu_score = 100 if edu_match == "yes" else 75
    formatting_score = random.randint(82, 94)
    
    overall_score = int((skills_score * 0.4) + (exp_score * 0.3) + (edu_score * 0.1) + (formatting_score * 0.2))
    
    suggestions = []
    if missing_skills:
        suggestions.append(f"Add missing keywords and skills identified in the job description: {', '.join(missing_skills[:3])}.")
    suggestions.append("Ensure your project section explicitly lists the libraries and tools you used (e.g. REST APIs, JSON, Python scripting).")
    if exp_match != "yes":
        suggestions.append("Detail responsibilities under relevant projects to showcase your practical coding/scripting experience.")
    suggestions.append("Check formatting, keep spacing consistent, and align bullet points.")

    return {
        "overall_score": overall_score,
        "sections": {
            "skills_match": {
                "score": skills_score,
                "feedback": f"Your resume matches {skills_matched} out of {skills_total} core skills and technologies identified in the job description."
            },
            "experience_match": {
                "score": exp_score,
                "feedback": exp_feedback
            },
            "formatting": {
                "score": formatting_score,
                "feedback": "The document structure is clear, but check spacing to make sure formatting is consistent."
            },
            "education_match": {
                "score": edu_score,
                "feedback": edu_feedback
            },
            "keywords": {
                "found": matched_skills,
                "missing": missing_skills
            },
            "skills_analysis": {
                "matched_skills": matched_skills,
                "missing_skills": missing_skills_formatted
            },
            "experience_analysis": {
                "required": required_exp_str,
                "candidate_has": candidate_exp_str,
                "match": exp_match,
                "feedback": exp_feedback,
                "suggestions": exp_suggestions
            },
            "education_analysis": {
                "required": required_edu,
                "candidate_has": candidate_edu_str,
                "match": edu_match,
                "feedback": edu_feedback
            }
        },
        "suggestions": suggestions,
        "is_mock": True
    }

async def analyze_resume_gemini(resume_text: str, job_description: str) -> dict:
    """
    Sends the resume and job description to Google Gemini 1.5 Flash to analyze.
    Falls back to mock analysis if the API key is not configured or fails.
    """
    if not settings.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY not configured. Falling back to mock evaluation.")
        return generate_mock_feedback(resume_text, job_description)
        
    prompt = f"""
    You are an expert resume reviewer, ATS (Applicant Tracking System) expert, and career coach.
    Analyze the following Resume against the Job Description. Perform a thorough comparison.
    
    Resume Content:
    ---
    {resume_text}
    ---
    
    Job Description:
    ---
    {job_description}
    ---
    
    Provide your evaluation in strict, valid JSON format with the following structure. Do not include any markdown backticks, raw text or code wrapper blocks outside the JSON:
    {{
        "overall_score": <int between 0 and 100>,
        "sections": {{
            "skills_match": {{
                "score": <int between 0 and 100>,
                "feedback": "<detailed feedback on how well the candidate's skills match the JD requirements>"
            }},
            "experience_match": {{
                "score": <int between 0 and 100>,
                "feedback": "<detailed feedback on work experience relevance>"
            }},
            "formatting": {{
                "score": <int between 0 and 100>,
                "feedback": "<detailed feedback on visual layout/formatting>"
            }},
            "education_match": {{
                "score": <int between 0 and 100>,
                "feedback": "<detailed feedback on whether education requirements are met>"
            }},
            "keywords": {{
                "found": ["<list of important JD keywords found in resume>"],
                "missing": ["<list of important JD keywords missing from resume>"]
            }},
            "skills_analysis": {{
                "matched_skills": ["<list of skills from JD that the candidate has>"],
                "missing_skills": [
                    {{
                        "skill": "<missing skill name>",
                        "suggestion": "<actionable suggestion on how to learn or add this skill, such as specific courses, certifications, or project ideas>"
                    }}
                ]
            }},
            "experience_analysis": {{
                "required": "<experience level/years required by JD, e.g. '3-5 years in backend development'>",
                "candidate_has": "<estimated experience from resume, e.g. '2 years as Software Developer'>",
                "match": "<'yes', 'partial', or 'no'>",
                "feedback": "<detailed analysis of the experience match or gap>",
                "suggestions": ["<list of 2-3 suggestions to strengthen experience section>"]
            }},
            "education_analysis": {{
                "required": "<education requirement from JD, e.g. 'Bachelor's in CS or related field'>",
                "candidate_has": "<education detected in resume, e.g. 'B.Tech in Information Technology'>",
                "match": "<'yes', 'partial', or 'no'>",
                "feedback": "<detailed analysis of the education match>"
            }}
        }},
        "suggestions": ["<list of 4-6 specific, highly-actionable improvement recommendations>"]
    }}
    
    Important rules:
    1. For skills_analysis.missing_skills, each entry MUST be an object with "skill" and "suggestion" keys.
    2. For experience_analysis.match and education_analysis.match, use ONLY "yes", "partial", or "no".
    3. Be specific and actionable in all feedback and suggestions.
    4. If the JD doesn't specify an education or experience requirement, mention that and assess based on role type.
    """
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = await model.generate_content_async(prompt)
        
        # Clean response if Gemini returned markdown code block wrappers
        text_content = response.text.strip()
        if text_content.startswith("```json"):
            text_content = text_content[7:]
        if text_content.startswith("```"):
            text_content = text_content[3:]
        if text_content.endswith("```"):
            text_content = text_content[:-3]
        text_content = text_content.strip()
        
        parsed_json = json.loads(text_content)
        parsed_json["is_mock"] = False
        return parsed_json
        
    except Exception as e:
        logger.error(f"Error during Gemini API call: {e}. Falling back to mock evaluation.")
        return generate_mock_feedback(resume_text, job_description)
