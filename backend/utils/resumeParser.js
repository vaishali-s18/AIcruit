// Backend Version of Resume Parser (Adapted for Node.js)
export const parseResumeContent = (text) => {
  const resume = {
    skills: [],
    experience: [],
    education: [],
    contact: {},
    summary: '',
    yearsExperience: 0,
    certifications: [],
    degree: null,
    isFresher: false,
    hasProjects: false
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
  
  resume.yearsExperience = Math.max(totalYears, explicitYears);

  // Skill Dictionary
  const skillPatterns = [
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'dart',
    'react', 'vue.js', 'angular', 'next.js', 'svelte', 'tailwind', 'bootstrap', 'sass', 'html5', 'css3', 'jquery', 'flutter',
    'node.js', 'express', 'django', 'flask', 'spring boot', 'laravel', 'asp.net', 'fastapi', 'graphql', 'rest api', 'nest.js',
    'sql', 'postgresql', 'mongodb', 'mysql', 'redis', 'firebase', 'elasticsearch', 'oracle', 'sqlite', 'dynamodb', 'cassandra',
    'aws', 'google cloud', 'azure', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ci/cd', 'linux', 'nginx', 'devops', 'ansible',
    'machine learning', 'data science', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'nlp', 'deep learning', 'tableau', 'power bi',
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'figma', 'adobe xd', 'photoshop', 'illustrator', 'slack',
    'agile', 'scrum', 'project management', 'leadership', 'communication', 'teamwork', 'critical thinking', 'problem solving',
    'time management', 'sdlc', 'unit testing', 'test automation', 'system design', 'architecture', 'documentation'
  ];

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

  const phoneMatch = text.match(/(\d{3}[-.\s]?\d{3}[-.\s]?\d{4})/);
  if (phoneMatch) resume.contact.phone = phoneMatch[0];

  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) resume.contact.email = emailMatch[0];

  const degreePatterns = ['b.e', 'b.tech', 'm.tech', 'mca', 'bca', 'm.sc', 'b.sc', 'mba', 'ph.d', 'bachelor', 'master'];
  resume.degree = degreePatterns.find(d => lowerText.includes(d.toLowerCase())) || null;

  const lines = text.split('\n').filter(line => line.trim());
  resume.summary = lines.slice(0, 3).join(' ').substring(0, 200);

  return resume;
};
