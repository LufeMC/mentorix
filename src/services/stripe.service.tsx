import { CheckoutSession } from '../types/stripe';
import { ApiResponse, api } from './api.service';

const retrieveCheckoutSession = async (checkoutSessionId: string) => {
  const response = await api.get<ApiResponse<CheckoutSession>>(`stripe/${checkoutSessionId}`);

  return response.data as unknown as CheckoutSession;
};

const StripeService = {
  retrieveCheckoutSession,
};

export default StripeService;
