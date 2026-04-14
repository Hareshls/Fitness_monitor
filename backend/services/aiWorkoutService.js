const axios = require('axios');

/**
 * AI Workout Recommendation Service
 * Calls Groq Cloud AI for personalized suggestions
 */
const getRecommendation = async (userData) => {
    const { fitness_goal, activity_level, weight, height, age } = userData;
    const apiKey = process.env.GROQ_API_KEY;

    // Fallback logic if API Key is not provided
    if (!apiKey) {
        console.warn('GROQ_API_KEY missing. Using fallback logic.');
        return getFallbackRecommendation(fitness_goal, activity_level);
    }

    try {
        const prompt = `Trainer: Generate 4 workouts for ${age || 'N/A'}yr, ${weight || 'N/A'}kg, ${height || 'N/A'}cm, Goal: ${fitness_goal}, Level: ${activity_level}. Return ONLY a JSON array of strings like ["Exercise - Reps/Time"].`;

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.6,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const content = response.data.choices[0].message.content;
        const match = content.match(/\[.*\]/s);
        return match ? JSON.parse(match[0]) : JSON.parse(content);
    } catch (error) {
        console.error('AI Error:', error.message);
        return getFallbackRecommendation(fitness_goal, activity_level);
    }
};

const getFallbackRecommendation = (goal, level) => {
    const plans = {
        weight_loss: ['20 min running', '3 sets jumping jacks', '15 squats', '10 min cycling'],
        muscle_gain: ['10 sets pushups', '3 sets pullups', '4 sets bench press', '3 sets squats'],
        default: ['15 min yoga', '20 min jogging', '3 sets plank', '10 min brisk walking']
    };
    
    const rec = plans[goal] || plans.default;
    return level === 'low' ? rec.map(i => `Beginner: ${i}`) : 
           level === 'high' ? rec.map(i => `Intense: ${i}`) : rec;
};

module.exports = {
    getRecommendation
};
