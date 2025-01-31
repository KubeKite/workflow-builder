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

// Fallback suggestions when AI service is unavailable
const fallbackSuggestions: OptimizationSuggestion[] = [
  {
    type: 'performance',
    suggestion: 'Consider adding parallel execution for independent tasks',
    rationale: 'Independent tasks can be executed simultaneously to reduce overall workflow execution time.'
  },
  {
    type: 'reliability',
    suggestion: 'Add error handling and retry mechanisms',
    rationale: 'Implement proper error handling and retries to make the workflow more resilient to temporary failures.'
  },
  {
    type: 'security',
    suggestion: 'Review data access permissions',
    rationale: 'Ensure each node only has access to the data it needs to operate.'
  },
  {
    type: 'design',
    suggestion: 'Optimize workflow structure',
    rationale: 'Consider grouping related tasks and minimizing dependencies between nodes.'
  }
];

export async function analyzeWorkflow(workflow: Workflow): Promise<OptimizationSuggestion[]> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, using fallback suggestions');
      return fallbackSuggestions;
    }

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
      model: "gpt-3.5-turbo",
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

    if (!response.choices[0]?.message?.content) {
      console.warn('No AI suggestions generated, using fallback suggestions');
      return fallbackSuggestions;
    }

    const suggestions = response.choices[0].message.content
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

    return suggestions.length > 0 ? suggestions : fallbackSuggestions;
  } catch (error: any) {
    console.error('Error analyzing workflow:', error);

    // For any error (including rate limits), use fallback suggestions
    console.warn('Using fallback suggestions due to error:', error.message);
    return fallbackSuggestions;
  }
}