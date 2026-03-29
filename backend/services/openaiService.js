import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const evaluateCandidate = async (studentProfile, jobRequirements) => {
  try {
    const prompt = `
      You are an expert technical recruiter AI. Evaluate the following candidate for the given job.
      
      Job Requirements:
      Role: ${jobRequirements.role}
      Minimum Qualifications: ${jobRequirements.minimumQualifications}
      Required Skills: ${jobRequirements.technicalSkillsRequired.join(', ')}

      Candidate Profile:
      College: ${studentProfile.collegeName}
      Degree/Major: ${studentProfile.degree} in ${studentProfile.major}
      Candidate Skills: ${studentProfile.skills.join(', ')}

      Analyze if the candidate is a good match based strictly on the required skills and their profile.
      Return exactly a JSON object (do not wrap it in markdown block) with the following exact structure:
      {
        "isGoodCandidate": boolean,
        "reasoning": "A concise paragraph explaining why they are a good fit or not.",
        "lackingSkills": ["skill1", "skill2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini model for speed and cost efficiency
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const parsedData = JSON.parse(response.choices[0].message.content);
    return parsedData;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    // Fallback in case of API limits or errors
    return {
      isGoodCandidate: false,
      reasoning: "AI Evaluation unavailable at this moment. Pending manual review.",
      lackingSkills: []
    };
  }
};

export const generateProfessionalSummary = async (profileData) => {
  try {
    const prompt = `
      You are an expert career counselor. Generate a concise, professional 3-sentence summary for a student based on these details:
      College: ${profileData.collegeName}
      Degree: ${profileData.degree} in ${profileData.major}
      Skills: ${profileData.skills.join(', ')}

      Return JUST the plain text summary, nothing else. Make it sound appealing to recruiters.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error (Summary):", error);
    return "A motivated student seeking opportunities to apply my skills and grow professionally.";
  }
};
