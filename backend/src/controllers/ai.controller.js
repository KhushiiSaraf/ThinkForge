const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
console.log('API KEY:', process.env.GEMINI_API_KEY);
/**
 * @name generateController
 * @route POST /api/ai/generate
 * @desc Generate content from a prompt
 * @access Private
 */
async function generateController(req, res) {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.status(200).json({ text });
    } catch (error) {
        console.error('Error in generateController:', error);
        res.status(500).json({ message: 'AI generation failed' });
    }
}

/**
 * @name rewriteController
 * @route POST /api/ai/rewrite
 * @desc Rewrite selected text with a given instruction
 * @access Private
 */
async function rewriteController(req, res) {
    const { selectedText, instruction } = req.body;

    if (!selectedText || !instruction) {
        return res.status(400).json({ message: 'selectedText and instruction are required' });
    }

    try {
        const prompt = `Rewrite the following text according to this instruction: "${instruction}"\n\nText: "${selectedText}"\n\nReturn only the rewritten text, nothing else.`
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        res.status(200).json({ text });
    } catch (error) {
        console.error('Error in rewriteController:', error);
        res.status(500).json({ message: 'AI rewrite failed' });
    }
}

module.exports = { generateController, rewriteController };