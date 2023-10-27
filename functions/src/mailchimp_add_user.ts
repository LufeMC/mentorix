import functions = require('firebase-functions');
import Mailchimp = require('mailchimp-api-v3');
import { logger } from 'firebase-functions';
import md5 = require('md5');
import * as crypto from 'crypto';

const mailchimpApiKey = functions.config().mailchimp.api_key;
const mailchimpListId = functions.config().mailchimp.listid;

const mailchimp = new Mailchimp(mailchimpApiKey);

const findUserMD5 = (email: string) => {
  const emailLower = email.toLowerCase();
  const md5 = crypto
    .createHash('md5')
    .update(emailLower, 'utf-8')
    .digest('hex');
  return md5;
};

export const mailchimp_handler = async ({ user, plan_renewed = false }) => {
  const email = user.email;
  const name = user.name;
  const premium = user.premium;
  const renewed = user.renewed;

  logger.log(email);

  if (!mailchimp) {
    logger.log('mailchimp not active');
    return 'mailchimp not active';
  }

  if (!email) {
    logger.log('email not found');
    return 'email not found';
  }

  let text = '';
  let tagName = name ? 'Signed up' : 'Subscribed';

  if (!renewed && premium) {
    tagName = 'Cancelled';
  } else if (renewed || premium) {
    if (!plan_renewed) {
      tagName = 'Premium';
    } else {
      tagName = 'Plan_renewed';
    }
  }

  try {
    const userMD5 = findUserMD5(email);

    const existingUser = await mailchimp.get(
      `/lists/${mailchimpListId}/members/${userMD5}`
    );

    if (existingUser) {
      await mailchimp.put(
        `/lists/${mailchimpListId}/members/${userMD5}?skip_merge_validation=true`,
        {
          email_address: email,
          merge_fields: {
            FNAME: name ?? '',
          },
          status: 'subscribed',
        }
      );

      logger.log('updated');
      text += 'updated';
    } else {
      await mailchimp.post(
        `/lists/${mailchimpListId}/members?skip_merge_validation=true`,
        {
          email_address: email,
          merge_fields: {
            FNAME: name ?? '',
          },
          status: 'subscribed',
        }
      );

      logger.log('subscribed');
      text += 'subscribed';
    }
  } catch (err) {
    logger.log(`Subscriber error: ${err}`);
    return `Subscriber error: ${err}. API Key: ${mailchimpApiKey}, listID: ${mailchimpListId}`;
  }

  try {
    await mailchimp.post(
      `/lists/${mailchimpListId}/members/${md5(email)}/tags`,
      {
        tags: [{ name: tagName, status: 'active' }],
      }
    );
    logger.log('tags added');
    text += '. tags added';
    return text;
  } catch (err) {
    logger.log(`Tags error: ${err}`);
    return `Tags error: ${err}`;
  }
};
