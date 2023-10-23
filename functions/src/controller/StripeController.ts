import { ApiResponse, stripeApi } from '../integrations/stripe';

const getSessionResult = async (sessionId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await stripeApi.get<ApiResponse<any>>(
    `checkout/sessions/${sessionId}`
  );
  return response.data;
};

const StripeController = {
  getSessionResult,
};

export default StripeController;
