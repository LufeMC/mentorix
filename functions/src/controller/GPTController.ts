import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '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',
});

export async function createQuestions(
  trancript: string,
  numberOfQuestions: number
) {
  try {
    const prompt = `Create JSON based on the transcript and the schema. All the values must be in brazilian portuguese.`;

    const schema = {
      type: 'object',
      properties: {
        overallTopic: {
          type: 'string',
          description: 'Name of the main topic the transcript is about',
        },
        questions: {
          type: 'array',
          description: `${numberOfQuestions} questions in the style of ENEM about the transcript.`,
          items: {
            type: 'string',
            description: `Question in the style of ENEM about the transcript. Do not add an prefix number to the question. Note the student do not have access to the transcript, so never mention the text. If you must do so, add the text itself to the question.`,
          },
        },
      },
    };

    //Note the updated model and added functions and function_call lines
    //Note that we pass our schema object to parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        { role: 'system', content: `Transcript: ${trancript}` },
        { role: 'user', content: prompt },
      ],
      functions: [{ name: 'create_questions', parameters: schema }],
      function_call: { name: 'create_questions' },
    });

    const generatedText =
      completion.choices[0].message.function_call!.arguments;

    const pdfJSON = JSON.parse(generatedText);

    return pdfJSON;
  } catch (err) {
    throw err;
  }
}

export async function createEvaluation(
  answer: string,
  question: string,
  trancript: string
) {
  try {
    const prompt = `Create JSON based on the question, answer, transcript and the schema. All the values must be in brazilian portuguese.`;

    const schema = {
      type: 'object',
      properties: {
        right: {
          type: 'string',
          description: 'REQUIRED - What the answer got right',
        },
        wrong: {
          type: 'string',
          description: 'REQUIRED - What the answer got wrong',
        },
        extra: {
          type: 'string',
          description: 'REQUIRED - Extra information about the topic',
        },
      },
    };

    //Note the updated model and added functions and function_call lines
    //Note that we pass our schema object to parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: `Transcript: ${trancript} ---------- Question: ${question} ---------- Answer: ${answer}`,
        },
        { role: 'user', content: prompt },
      ],
      functions: [{ name: 'create_questions', parameters: schema }],
      function_call: { name: 'create_questions' },
    });

    const generatedText =
      completion.choices[0].message.function_call!.arguments;

    const pdfJSON = JSON.parse(generatedText);

    return pdfJSON;
  } catch (err) {
    throw err;
  }
}

export async function createExampleAnswer(question: string, trancript: string) {
  try {
    const prompt = `Create JSON based on the question, transcript and the schema. All the values must be in brazilian portuguese.`;

    const schema = {
      type: 'object',
      properties: {
        exampleAnswer: {
          type: 'string',
          description:
            'REQUIRED - Example answer to the question in 200 words max',
        },
      },
    };

    //Note the updated model and added functions and function_call lines
    //Note that we pass our schema object to parameters
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-0125-preview',
      messages: [
        {
          role: 'system',
          content: `Transcript: ${trancript} ---------- Question: ${question}`,
        },
        { role: 'user', content: prompt },
      ],
      functions: [{ name: 'create_questions', parameters: schema }],
      function_call: { name: 'create_questions' },
    });

    const generatedText =
      completion.choices[0].message.function_call!.arguments;

    const pdfJSON = JSON.parse(generatedText);

    return pdfJSON;
  } catch (err) {
    throw err;
  }
}
