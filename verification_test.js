import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
const testUser = {
  name: 'Test Engineer',
  email: `test_${Date.now()}@aicruit.com`,
  password: 'password123',
  role: 'candidate'
};

const runTest = async () => {
  try {
    console.log('--- Phase 1: Creating Test User ---');
    const signupRes = await axios.post(`${API_URL}/signup`, testUser);
    const token = signupRes.data.user.token;
    console.log('✅ User registered successfully');

    console.log('\n--- Phase 2: Updating Profile with Parsed Data ---');
    const updateData = {
      skills: ['Autopilot', 'Neural Networks', 'SpaceX'],
      experience: 8
    };

    const updateRes = await axios.put(`${API_URL}/profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (updateRes.data.success) {
      const updated = updateRes.data.user;
      console.log('✅ Profile updated successfully');
      console.log('Updated Skills:', updated.skills);
      console.log('Updated Experience:', updated.experience);

      // Verify skills are merged/present
      const hasSkills = updateData.skills.every(s => updated.skills.includes(s));
      if (hasSkills && updated.experience === 8) {
        console.log('\n🚀 ALL TESTS PASSED: Profile automation is working correctly!');
      } else {
        console.error('❌ Data mismatch in update');
      }
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) console.error('Error Details:', error.response.data);
  } finally {
    process.exit();
  }
};

runTest();
