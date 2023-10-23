/* eslint-disable @typescript-eslint/no-explicit-any */
interface AutomaticTax {
  enabled: boolean;
  status: null | string;
}

interface ConsentCollection {
  promotions: string;
  terms_of_service: string;
}

interface Address {
  city: null | string;
  country: string;
  line1: null | string;
  line2: null | string;
  postal_code: string;
  state: null | string;
}

interface CustomerDetails {
  address: Address;
  email: string;
  name: string;
  phone: null | string;
  tax_exempt: string;
  tax_ids: string[];
}

interface CustomText {
  shipping_address: null | string;
  submit: null | string;
  terms_of_service_acceptance: null | string;
}

interface PhoneNumberCollection {
  enabled: boolean;
}

interface TotalDetails {
  amount_discount: number;
  amount_shipping: number;
  amount_tax: number;
}

export type CheckoutSession = {
  id: string;
  object: string;
  after_expiration: null | string;
  allow_promotion_codes: boolean;
  amount_subtotal: number;
  amount_total: number;
  automatic_tax: AutomaticTax;
  billing_address_collection: string;
  cancel_url: string;
  client_reference_id: null | string;
  client_secret: null | string;
  consent: null | string;
  consent_collection: ConsentCollection;
  created: number;
  currency: string;
  currency_conversion: null | string;
  custom_fields: any[]; // You can specify the type for custom_fields if needed
  custom_text: CustomText;
  customer: string;
  customer_creation: string;
  customer_details: CustomerDetails;
  customer_email: null | string;
  expires_at: number;
  invoice: string;
  invoice_creation: null | string;
  livemode: boolean;
  locale: string;
  metadata: Record<string, any>; // You can specify the type for metadata values if needed
  mode: string;
  payment_intent: null | string;
  payment_link: string;
  payment_method_collection: string;
  payment_method_configuration_details: null | string;
  payment_method_options: null | string;
  payment_method_types: string[];
  payment_status: string;
  phone_number_collection: PhoneNumberCollection;
  recovered_from: null | string;
  setup_intent: null | string;
  shipping_address_collection: null | string;
  shipping_cost: null | string;
  shipping_details: null | string;
  shipping_options: any[]; // You can specify the type for shipping_options if needed
  status: string;
  submit_type: string;
  subscription: string;
  success_url: string;
  total_details: TotalDetails;
  ui_mode: string;
  url: null | string;
};
