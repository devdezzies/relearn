import OpenAI from "openai";

// Initialize the OpenAI client with Alibaba Dashscope API configuration
const openai = new OpenAI({
  apiKey: "sk-cf2fde10b6754318ac4e2763f6034dc5",
  baseURL: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
  dangerouslyAllowBrowser: true,
});

// System prompt for STEM teaching
const STEM_SYSTEM_PROMPT = `You are an AI assistant specialized in teaching STEM (Science, Technology, Engineering, and Mathematics) concepts. 
Your goal is to provide clear, accurate, and engaging explanations of complex topics in a way that's accessible to learners of all levels.

Guidelines:
1. Break down complex concepts into simpler components
2. Use analogies and real-world examples to illustrate abstract ideas
3. Provide visual descriptions when explaining spatial or visual concepts
4. Encourage critical thinking and problem-solving approaches
5. Be patient and supportive, especially with challenging topics
6. When appropriate, suggest hands-on experiments or activities that can reinforce learning
7. Cite reliable sources when providing factual information
8. Acknowledge when multiple valid perspectives or approaches exist
9. Be able to adjust explanations based on the learner's level of understanding

Remember that your primary goal is to foster understanding and curiosity about STEM subjects.`;

// Function to generate a chat completion
export async function generateChatCompletion(messages: any[]) {
  try {
    // Add the system prompt as the first message if it's not already there
    if (messages.length === 0 || messages[0].role !== "system") {
      messages = [
        { role: "system", content: STEM_SYSTEM_PROMPT },
        ...messages
      ];
    }

    const completion = await openai.chat.completions.create({
      model: "qwen-max", // Using the model specified in the example
      messages: messages,
      top_p: 0.8,
      temperature: 0.7
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat completion:", error);
    throw error;
  }
}

export default openai;
