import db from '..';
import { ApiResponse, stripeApi } from '../integrations/stripe';
import { CheckoutSession } from '../types/stripe';
import { User } from '../types/user';

const getSessionResult = async (sessionId: string) => {
  const response = await stripeApi.get<ApiResponse<CheckoutSession>>(
    `checkout/sessions/${sessionId}`
  );
  return response.data;
};

const cancelPackage = async (customerId: string) => {
  customerId = 'cus_OsIxJJZdISvjM5';
  const userQuery = await db
    .collection('users')
    .where('customerId', '==', customerId)
    .get();

  if (userQuery.docs?.length) {
    const user: User = userQuery.docs[0].data();
    user.customerId = '';

    await db.collection('users').doc(userQuery.docs[0].id).update(user);
  }
};

const StripeController = {
  getSessionResult,
  cancelPackage,
};

export default StripeController;
