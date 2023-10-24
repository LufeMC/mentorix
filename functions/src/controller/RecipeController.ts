/* eslint-disable no-useless-catch */
import functions = require('firebase-functions');
import OpenAI from 'openai';
import db from '..';
import { TempUser } from '../types/tempUser';
import { User } from '../types/user';

const GPT_KEY = functions.config().gpt.api_key;

const openai = new OpenAI({
  apiKey: GPT_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const response = async (text: string) => {
  try {
    const prompt = `return a recipe for ${text}. Make sure to include all
    the required fields in the schema for the JSON. Be creative with the name
    of the dish and be very specific about the instructions. Be like a
    professional chef and write specifics about each instruction.
    Also, make sure each ingredient have the quantity and name as specified
    in the schema. Finally, make sure the recipe has every field specified.
    DO NOT LET anything out!`;
    //Define the JSON Schema by creating a schema object
    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'Title of the dish. Be creative with the title, making it sound delicious',
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
          items: {
            type: 'object',
            properties: {
              ingredient: {
                type: 'string',
                description: 'Ingredient name',
              },
              quantity: {
                type: 'string',
                description: 'Amount needed',
              },
            },
          },
        },
        instructions: {
          type: 'array',
          description:
            'Steps to prepare the recipe. Be specific and detailed about each step',
          items: { type: 'string' },
        },
      },
    };

    //Note the updated model and added functions and function_call lines
    //Note that we pass our schema object to parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0613',
      messages: [
        { role: 'system', content: 'You are a successful chef.' },
        { role: 'user', content: prompt },
      ],
      functions: [{ name: 'set_recipe', parameters: schema }],
      function_call: { name: 'set_recipe' },
    });

    const generatedText =
      completion.choices[0].message.function_call!.arguments;

    return JSON.parse(generatedText);
  } catch (err) {
    throw err;
  }
};

const validateUser = async (userId: string, tempUserId: string) => {
  const currentUserId = userId ?? tempUserId;
  const collectionId = userId ? 'users' : 'tempUsers';
  const maxRecipes = userId ? 20 : 5;

  const userQuery = await db.collection(collectionId).doc(currentUserId).get();

  if (userQuery.exists) {
    const user: User | TempUser = userQuery.data();
    if (
      user.recipesGenerated < maxRecipes ||
      (userId && (user as User).premium)
    ) {
      return {
        success: true,
        message: '',
      };
    }

    return {
      success: false,
      message: "You don't have more recipes this month",
    };
  }

  return {
    success: false,
    message: "This user doesn't exist",
  };
};

/*
Export
*/
export const RecipeController = {
  response,
  validateUser,
};
