// Resume Parser & Screening Service
export const parseResumeContent = (text) => {
  const resume = {
    skills: [],
    experience: [],
    education: [],
    contact: {},
    summary: '',
    yearsExperience: 0,
    certifications: [],
    degree: null
  };

  const lowerText = text.toLowerCase();

  // Helper: Calculate years from date ranges (e.g., 2020 - 2023)
  const dateRangeRegex = /(?:20|19)\d{2}\s*[-–to\s]+\s*(?:20\d{2}|Present|Current|Now)/gi;
  const dateRanges = text.match(dateRangeRegex);
  let totalYears = 0;
  
  if (dateRanges) {
    dateRanges.forEach(range => {
      const years = range.match(/(?:20|19)\d{2}|Present|Current|Now/gi);
      if (years && years.length >= 2) {
        const start = parseInt(years[0]);
        const endStr = years[1].toLowerCase();
        const end = (endStr.includes('present') || endStr.includes('current') || endStr.includes('now')) 
          ? new Date().getFullYear() 
          : parseInt(years[1]);
        if (!isNaN(start) && !isNaN(end)) {
          totalYears += (end - start);
        }
      }
    });
  }
  
  // Explicit "X years of experience" check
  const expPattern = /(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?experience/i;
  const expMatch = text.match(expPattern);
  const explicitYears = expMatch ? parseInt(expMatch[1]) : 0;
  
  // Take the best guess
  resume.yearsExperience = Math.max(totalYears, explicitYears);

  // Comprehensive Industry Skill Dictionary (120+ Skills)
  const skillPatterns = [
    // Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'dart',
    // Frontend
    'react', 'vue.js', 'angular', 'next.js', 'svelte', 'tailwind', 'bootstrap', 'sass', 'html5', 'css3', 'jquery', 'flutter',
    // Backend
    'node.js', 'express', 'django', 'flask', 'spring boot', 'laravel', 'asp.net', 'fastapi', 'graphql', 'rest api', 'nest.js',
    // Databases
    'sql', 'postgresql', 'mongodb', 'mysql', 'redis', 'firebase', 'elasticsearch', 'oracle', 'sqlite', 'dynamodb', 'cassandra',
    // Cloud & DevOps
    'aws', 'google cloud', 'azure', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ci/cd', 'linux', 'nginx', 'devops', 'ansible',
    // Data Science & AI
    'machine learning', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'nlp', 'deep learning', 'tableau', 'power bi',
    // Tools & Version Control
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'figma', 'adobe xd', 'photoshop', 'illustrator', 'slack',
    // Soft Skills & Methodologies
    'agile', 'scrum', 'project management', 'leadership', 'communication', 'teamwork', 'critical thinking', 'problem solving',
    'time management', 'sdlc', 'unit testing', 'test automation', 'system design', 'architecture', 'documentation'
  ];

  // Certification Keywords
  const certPatterns = [
    'aws certified', 'google cloud certified', 'microsoft certified', 'azure certified', 'ccna', 'ccnp', 'comptia',
    'pmp', 'certified scrum master', 'itil', 'cissp', 'ceh', 'oracle certified', 'isc2', 'salesforce certified',
    'coursera', 'udemy', 'edx', 'simplilearn', 'nptel', 'guvi', 'hackerrank', 'leetcode'
  ];

  resume.skills = skillPatterns.filter(skill => lowerText.includes(skill));
  resume.certifications = certPatterns.filter(cert => lowerText.includes(cert));

  // Intern/Fresher Detection
  const fresherKeywords = ['intern', 'internship', 'associate', 'junior', 'fresher', 'trainee', 'student'];
  resume.isFresher = fresherKeywords.some(key => lowerText.includes(key));
  
  // Project Detection
  const projectKeywords = ['project', 'opensource', 'github', 'contribution', 'hackathon'];
  resume.hasProjects = projectKeywords.some(key => lowerText.includes(key));

  // Extract phone number
  const phoneMatch = text.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) resume.contact.phone = phoneMatch[0];

  // Email Extraction
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) resume.contact.email = emailMatch[0];

  // Degree Detection (Recognition of professional qualifications)
  const degreePatterns = ['b.e', 'b.tech', 'm.tech', 'mca', 'bca', 'm.sc', 'b.sc', 'mba', 'ph.d', 'bachelor', 'master'];
  resume.degree = degreePatterns.find(d => lowerText.includes(d.toLowerCase())) || null;

  // Education level extraction
  const educationKeywords = ['university', 'college', 'institute', 'school'];
  resume.educationData = educationKeywords.filter(edu => lowerText.includes(edu.toLowerCase()));

  // Extract summary (first paragraph-like content)
  const lines = text.split('\n').filter(line => line.trim());
  resume.summary = lines.slice(0, 3).join(' ').substring(0, 200);

  return resume;
};

export const screenResumeAgainstJob = (resume, job) => {
  // Score resume against job requirements
  const scores = {
    skillsMatch: 0,
    experienceMatch: 0,
    overallScore: 0,
    feedback: [],
    strengths: [],
    gaps: []
  };

  // Skills matching with Aliases (e.g. ReactJS maps to React)
  const jobSkills = job.requirements?.skills || [];
  const matchedSkills = resume.skills.filter(skill => {
    const s = skill.toLowerCase().replace(/js|(\.js)/g, '').trim();
    return jobSkills.some(jobSkill => {
      const js = jobSkill.toLowerCase().replace(/js|(\.js)/g, '').trim();
      return js.includes(s) || s.includes(js);
    });
  });

  scores.skillsMatch = jobSkills.length > 0
    ? Math.round((matchedSkills.length / jobSkills.length) * 100)
    : 50;

  if (scores.skillsMatch === 100) {
    scores.strengths.push('All required skills present in resume');
  } else if (scores.skillsMatch >= 70) {
    scores.strengths.push('Most required skills are present');
  } else {
    const missingSkills = jobSkills.filter(skill =>
      !matchedSkills.some(matched => matched.toLowerCase().includes(skill.toLowerCase()))
    );
    scores.gaps.push(`Missing skills: ${missingSkills.slice(0, 3).join(', ')}`);
  }

  // Experience matching
  const requiredExperience = job.requirements?.experience || 0;
  if (resume.yearsExperience >= requiredExperience) {
    scores.experienceMatch = 100;
    scores.strengths.push(`${resume.yearsExperience}+ years of experience (${requiredExperience}+ required)`);
  } else if (resume.yearsExperience >= requiredExperience - 1) {
    scores.experienceMatch = 85;
    scores.feedback.push(`Experience requirement: ${resume.yearsExperience} years provided, ${requiredExperience} required`);
  } else {
    scores.experienceMatch = Math.round((resume.yearsExperience / requiredExperience) * 100);
    scores.gaps.push(`${requiredExperience - resume.yearsExperience} years of experience needed`);
  }

  // Education & Degree Match Score
  let educationScore = 0;
  if (resume.degree) {
    educationScore = 100;
    scores.strengths.push(`Relevant Degree detected: ${resume.degree.toUpperCase()}`);
  }

  // Scoring Weights adjustment for Freshers/Entry Level
  const isEntryLevel = job.level === 'Entry Level' || job.level === 'Internship';
  let finalScore = 0;
  
  if (isEntryLevel) {
    // 80% split for Entry level (Skill + Education heavy)
    const combinedSkillEdu = (scores.skillsMatch * 0.7 + educationScore * 0.3);
    finalScore = Math.round((combinedSkillEdu * 0.8 + scores.experienceMatch * 0.2));
    
    if (resume.hasProjects) finalScore += 5;
    
    // Potential Status
    if (finalScore >= 70 && resume.yearsExperience < 1) {
      scores.recommendation = 'HIGH POTENTIAL - Skilled Fresher';
      scores.status = 'excellent';
    }
  } else {
    // 60/40 split for professional roles
    finalScore = Math.round((scores.skillsMatch * 0.6 + scores.experienceMatch * 0.4));
  }

  // Certification Bonus (Applies to all)
  if (resume.certifications.length > 0) {
    const certBonus = Math.min(resume.certifications.length * 3, 10); // Max 10% bonus
    finalScore += certBonus;
    scores.strengths.push(`${resume.certifications.length} Industry Certifications found`);
  }

  scores.overallScore = Math.min(finalScore, 100);

  // Generate recommendation
  if (scores.overallScore >= 80) {
    scores.recommendation = 'STRONG MATCH - Highly recommended for interview';
    scores.status = 'excellent';
  } else if (scores.overallScore >= 60) {
    scores.recommendation = 'GOOD MATCH - Consider for interview';
    scores.status = 'good';
  } else if (scores.overallScore >= 40) {
    scores.recommendation = 'MODERATE MATCH - May need assessment';
    scores.status = 'moderate';
  } else {
    scores.recommendation = 'WEAK MATCH - Does not meet requirements';
    scores.status = 'poor';
  }

  return scores;
};
