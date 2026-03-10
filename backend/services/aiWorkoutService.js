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
        const prompt = `
            Act as a professional fitness trainer. 
            Generate a personalized workout plan for a user with these details:
            - Age: ${age || 'N/A'}
            - Weight: ${weight || 'N/A'}kg
            - Height: ${height || 'N/A'}cm
            - Goal: ${fitness_goal}
            - Activity Level: ${activity_level}

            Return EXACTLY a JSON array of 4 strings, each being a specific exercise with reps/duration.
            Example format: ["Running - 20 mins", "Pushups - 3 sets", "Squats - 15 reps", "Plank - 30s"]
            Do not include any other text, just the JSON array.
        `;

        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const content = response.data.choices[0].message.content;
        // Parse the JSON array from the response
        try {
            return JSON.parse(content);
        } catch (e) {
            // Sometimes models return text + JSON, try to extract array
            const match = content.match(/\[.*\]/s);
            if (match) return JSON.parse(match[0]);
            throw new Error('Failed to parse AI response');
        }
    } catch (error) {
        console.error('Groq API Error:', error.response?.data || error.message);
        return getFallbackRecommendation(fitness_goal, activity_level);
    }
};

// Original logic moved to fallback
const getFallbackRecommendation = (goal, level) => {
    let rec = [];
    if (goal === 'weight_loss') rec = ['20 min running', '3 sets jumping jacks', '15 squats', '10 min cycling'];
    else if (goal === 'muscle_gain') rec = ['10 sets pushups', '3 sets pullups', '4 sets bench press', '3 sets squats'];
    else rec = ['15 min yoga', '20 min jogging', '3 sets plank', '10 min brisk walking'];
    
    if (level === 'low') return rec.map(i => `Beginner: ${i}`);
    if (level === 'high') return rec.map(i => `Intense: ${i}`);
    return rec;
};

module.exports = {
    getRecommendation
};
