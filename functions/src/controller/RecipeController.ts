/* eslint-disable no-useless-catch */
import functions = require('firebase-functions');
import OpenAI from 'openai';
import firebase from '..';
import { User } from '../types/user';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const GPT_KEY = functions.config().gpt.api_key;

const openai = new OpenAI({
  apiKey: GPT_KEY, // defaults to process.env["OPENAI_API_KEY"]
});

const response = async (text: string) => {
  try {
    const prompt = `Create a recipe according to the instructions: ${text}.
    Make sure to include all the required fields in the schema for the JSON.
    Be creative with the name of the dish and be very specific about the instructions.
    Be like a professional chef and write specifics about each instruction.
    Do not add ingredients that the user didn't specify in the prompt they have!
    All you may add is vegetable oil, salt and pepper!`;
    //Define the JSON Schema by creating a schema object
    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            'Title of the dish. Be creative with the title, making it sound delicious',
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

    const recipeJson = JSON.parse(generatedText);
    const imageURL = await generateImage(recipeJson);
    recipeJson.img = imageURL;

    return recipeJson;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const generateImage = async (recipeJSON: any) => {
  try {
    const response = await openai.images.generate({
      prompt: `Create an image for this: This is my recipe in format, create a top view of a beautiful plate in a nicely put wooden table background with a studio light . Do it in realistic style.
    
    Title: ${recipeJSON.title}`,
      n: 1,
      size: '1024x1024',
    });
    const image_url = response.data[0].url;
    const responseImg = await axios.get(image_url as string, {
      responseType: 'arraybuffer',
    });
    const filename = `${uuidv4()}.jpg`;
    const file = firebase.storage.file(`recipesCovers/${filename}`);
    await file.save(responseImg.data, {
      metadata: {
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
    });

    const downloadURL = await file.getSignedUrl({
      action: 'read',
      expires: '01-01-2100', // Adjust the expiration date as needed
    });

    console.log(downloadURL);
    return downloadURL;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const validateUser = async (userId: string) => {
  const currentUserId = userId;
  const collectionId = 'users';
  const maxRecipes = 20;

  const userQuery = await firebase.db
    .collection(collectionId)
    .doc(currentUserId)
    .get();

  if (userQuery.exists) {
    const user: User = userQuery.data();
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
