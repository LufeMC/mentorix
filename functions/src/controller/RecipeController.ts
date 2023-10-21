import functions = require('firebase-functions');
import OpenAI from 'openai';

const GPT_KEY = functions.config().gpt.api_key;

const openai = new OpenAI({
  apiKey: GPT_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const response = async (text: string) => {
  try {
    const prompt = `return a recipe for ${text}`;
    //Define the JSON Schema by creating a schema object
    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Descriptive title of the dish',
        },
        preparationTime: {
          type: 'string',
          description: 'Preparation time for the dish',
        },
        cookingTime: {
          type: 'string',
          description: 'Cooking time for the dish',
        },
        ingredients: {
          type: 'array',
          items: { type: 'string' },
        },
        instructions: {
          type: 'array',
          description: 'Steps to prepare the recipe.',
          items: { type: 'string' },
        },
      },
    };

    //Note the updated model and added functions and function_call lines
    //Note that we pass our schema object to parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        { role: 'system', content: 'You are a helpful recipe assistant.' },
        { role: 'user', content: prompt },
      ],
      functions: [{ name: 'set_recipe', parameters: schema }],
      function_call: { name: 'set_recipe' },
    });

    const generatedText =
      completion.choices[0].message.function_call!.arguments;

    return { generatedText };
  } catch (err) {
    throw err;
  }
};

/*
Export
*/
export const TravelAgentController = {
  response,
};
