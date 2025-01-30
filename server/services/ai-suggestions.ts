import OpenAI from "openai";
import type { Workflow } from "@db/schema";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface OptimizationSuggestion {
  type: 'performance' | 'reliability' | 'security' | 'design';
  suggestion: string;
  rationale: string;
}

export async function analyzeWorkflow(workflow: Workflow): Promise<OptimizationSuggestion[]> {
  try {
    const prompt = `Analyze this workflow and provide optimization suggestions:
    
Workflow Name: ${workflow.name}
Description: ${workflow.description}
Definition: ${JSON.stringify(workflow.definition, null, 2)}

Provide specific suggestions for improving this workflow in terms of:
1. Performance optimization
2. Reliability improvements
3. Security considerations
4. Design patterns and best practices

Format each suggestion with a type (performance/reliability/security/design), the suggestion itself, and a brief rationale.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "You are an expert workflow optimization assistant. Analyze workflows and provide specific, actionable suggestions for improvements." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Parse the response and extract suggestions
    const suggestions = response.choices[0].message.content!
      .split('\n\n')
      .filter(s => s.trim())
      .map(suggestion => {
        const [type, ...rest] = suggestion.split(':').map(s => s.trim());
        const [suggestionText, rationale] = rest.join(':').split('Rationale:').map(s => s.trim());
        
        return {
          type: type.toLowerCase() as OptimizationSuggestion['type'],
          suggestion: suggestionText,
          rationale: rationale || 'No rationale provided'
        };
      });

    return suggestions;
  } catch (error) {
    console.error('Error analyzing workflow:', error);
    throw new Error('Failed to generate workflow suggestions');
  }
}
