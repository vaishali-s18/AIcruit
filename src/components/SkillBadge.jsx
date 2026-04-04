import './SkillBadge.css';

function SkillBadge({ skill }) {
  const skillIcons = {
    'React': '⚛️',
    'Node.js': '🟢',
    'TypeScript': '🔷',
    'MongoDB': '🍃',
    'AWS': '☁️',
    'Docker': '🐳',
    'JavaScript': '🟨',
    'CSS': '🎨',
    'Python': '🐍',
    'Java': '☕',
  };

  return (
    <span className="skill-badge">
      {skillIcons[skill] || '📌'} {skill}
    </span>
  );
}

export default SkillBadge;
