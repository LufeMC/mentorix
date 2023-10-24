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

interface EventDataObject {
  id: string;
  object: string;
  account_country: string;
  account_name: string;
  account_tax_ids: null;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  amount_shipping: number;
  application: null;
  application_fee_amount: null;
  attempt_count: number;
  attempted: boolean;
  auto_advance: boolean;
  automatic_tax: AutomaticTax;
  billing_reason: string;
  charge: null;
  collection_method: string;
  created: number;
  currency: string;
  custom_fields: null;
  customer: string;
  customer_address: null;
  customer_email: null;
  customer_name: null;
  customer_phone: null;
  customer_shipping: null;
  customer_tax_exempt: string;
  customer_tax_ids: string[];
  default_payment_method: null;
  default_source: null;
  default_tax_rates: [];
  description: null;
  discount: null;
  discounts: [];
  due_date: null;
  effective_at: null;
  ending_balance: null;
  footer: null;
  from_invoice: null;
  hosted_invoice_url: null;
  invoice_pdf: null;
  last_finalization_error: null;
  latest_revision: null;
  lines: Record<string, any>; // You can specify a more specific type if needed
  livemode: boolean;
  metadata: Record<string, any>;
  next_payment_attempt: null;
  number: null;
  on_behalf_of: null;
  paid: boolean;
  paid_out_of_band: boolean;
  payment_intent: null;
  payment_settings: Record<string, any>;
  period_end: number;
  period_start: number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount: number;
  quote: null;
  receipt_number: null;
  rendering: null;
  rendering_options: null;
  shipping_cost: null;
  shipping_details: null;
  starting_balance: number;
  statement_descriptor: null;
  status: string;
  status_transitions: Record<string, any>;
  subscription: string;
  subscription_details: Record<string, any>;
  subtotal: number;
  subtotal_excluding_tax: number;
  tax: null;
  test_clock: null;
  total: number;
  total_discount_amounts: [];
  total_excluding_tax: number;
  total_tax_amounts: [];
  transfer_data: null;
  webhooks_delivered_at: number;
}

export type Event = {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: {
    object: EventDataObject;
    previous_attributes: {
      auto_advance: boolean;
      next_payment_attempt: number;
    };
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: null;
    idempotency_key: null;
  };
  type: string;
};
