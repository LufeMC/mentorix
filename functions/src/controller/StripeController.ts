import firebase from '..';
import { ApiResponse, stripeApi } from '../integrations/stripe';
import { mailchimp_handler } from '../mailchimp_add_user';
import { CheckoutSession } from '../types/stripe';
import { User } from '../types/user';

let updating = false;

const getSessionResult = async (sessionId: string) => {
  const response = await stripeApi.get<ApiResponse<CheckoutSession>>(
    `checkout/sessions/${sessionId}`
  );
  return response.data;
};

const cancelPackage = async (customerId: string) => {
  if (!updating) {
    updating = true;
    const userQuery = await firebase.db
      .collection('users')
      .where('customerId', '==', customerId)
      .get();

    if (userQuery.docs?.length) {
      const user: User = userQuery.docs[0].data();
      user.renewed = false;
      await mailchimp_handler({ user });

      await firebase.db
        .collection('users')
        .doc(userQuery.docs[0].id)
        .update(user);
    }

    updating = false;
  }
};

const renewPackage = async (customerId: string) => {
  if (!updating) {
    updating = true;
    const userQuery = await firebase.db
      .collection('users')
      .where('customerId', '==', customerId)
      .get();

    if (userQuery.docs?.length) {
      const user: User = userQuery.docs[0].data();
      user.renewed = true;
      await mailchimp_handler({ user, plan_renewed: true });

      await firebase.db
        .collection('users')
        .doc(userQuery.docs[0].id)
        .update(user);
    }

    updating = false;
  }
};

const StripeController = {
  getSessionResult,
  cancelPackage,
  renewPackage,
};

export default StripeController;
