import { useState } from 'react';
import { uploadResume } from '../services/resumeService.js';

const SimpleResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file first.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await uploadResume(file);
            if (data.success) {
                setResult(data.data);
            } else {
                setError(data.message || 'Error parsing resume');
            }
        } catch (err) {
            setError(err.message || 'Failed to upload resume to backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ color: '#333' }}>Resume Analyst (Minimal)</h2>
            <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Select Resume (PDF or TXT):</label>
                    <input 
                        type="file" 
                        accept=".pdf,.txt" 
                        onChange={handleFileChange}
                        style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={loading || !file}
                    style={{ 
                        backgroundColor: '#007bff', 
                        color: 'white', 
                        padding: '0.75rem 1.5rem', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Analyzing...' : 'Upload & Analyze →'}
                </button>
            </form>

            {error && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {result && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '8px' }}>
                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '0.5rem' }}>Analysis Results</h3>
                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <div>
                            <strong>File:</strong> {result.fileName}
                        </div>
                        <div>
                            <strong>Estimated Experience:</strong> {result.yearsExperience} years
                        </div>
                        <div>
                            <strong>Skills Detected:</strong>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem' }}>
                                {result.skills.map((skill, index) => (
                                    <span key={index} style={{ backgroundColor: '#007bff', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                        {skill}
                                    </span>
                                ))}
                                {result.skills.length === 0 && <span style={{ color: '#666' }}>None detected</span>}
                            </div>
                        </div>
                        {result.contact?.email && (
                            <div>
                                <strong>Contact:</strong> {result.contact.email} {result.contact.phone && `| ${result.contact.phone}`}
                            </div>
                        )}
                        <div>
                            <strong>Summary Prep:</strong>
                            <p style={{ fontStyle: 'italic', color: '#555', marginTop: '0.25rem' }}>"{result.summary}..."</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleResumeUpload;
