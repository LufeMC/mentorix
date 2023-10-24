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

export type Event = {
  id: string;
  object: string;
  api_version: string;
  created: number;
  data: Data;
  livemode: boolean;
  pending_webhooks: number;
  request: Request;
  type: string;
};

interface Data {
  object: Subscription;
  previous_attributes?: PreviousAttributes;
}

interface Subscription {
  id: string;
  object: string;
  application: null;
  application_fee_percent: null;
  automatic_tax: AutomaticTax;
  billing_cycle_anchor: number;
  billing_thresholds: null;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  cancellation_details: CancellationDetails;
  collection_method: string;
  created: number;
  currency: string;
  current_period_end: number;
  current_period_start: number;
  customer: string;
  days_until_due: null;
  default_payment_method: string;
  default_source: null;
  default_tax_rates: any[];
  description: null;
  discount: null;
  ended_at: null;
  items: Items;
  latest_invoice: string;
  livemode: boolean;
  metadata: any;
  next_pending_invoice_item_invoice: null;
  on_behalf_of: null;
  pause_collection: null;
  payment_settings: PaymentSettings;
  pending_invoice_item_interval: null;
  pending_setup_intent: null;
  pending_update: null;
  plan: Plan;
  quantity: number;
  schedule: null;
  start_date: number;
  status: string;
  test_clock: null;
  transfer_data: null;
  trial_end: null;
  trial_settings: TrialSettings;
  trial_start: null;
}

interface AutomaticTax {
  enabled: boolean;
}

interface CancellationDetails {
  comment: null;
  feedback: string | null;
  reason: string | null;
}

interface Items {
  object: string;
  data: SubscriptionItem[];
  has_more: boolean;
  total_count: number;
  url: string;
}

interface SubscriptionItem {
  id: string;
  object: string;
  billing_thresholds: null;
  created: number;
  metadata: any;
  plan: Plan;
  price: Price;
  quantity: number;
  subscription: string;
  tax_rates: any[];
}

interface Plan {
  id: string;
  object: string;
  active: boolean;
  aggregate_usage: null;
  amount: number;
  amount_decimal: string;
  billing_scheme: string;
  created: number;
  currency: string;
  interval: string;
  interval_count: number;
  livemode: boolean;
  metadata: any;
  nickname: null;
  product: string;
  tiers_mode: null;
  transform_usage: null;
  trial_period_days: null;
  usage_type: string;
}

interface Price {
  id: string;
  object: string;
  active: boolean;
  billing_scheme: string;
  created: number;
  currency: string;
  custom_unit_amount: null;
  livemode: boolean;
  lookup_key: null;
  metadata: any;
  nickname: null;
  product: string;
  recurring: Recurring;
  tax_behavior: string;
  tiers_mode: null;
  transform_quantity: null;
  type: string;
  unit_amount: number;
  unit_amount_decimal: string;
}

interface Recurring {
  aggregate_usage: null;
  interval: string;
  interval_count: number;
  trial_period_days: null;
  usage_type: string;
}

interface PaymentSettings {
  payment_method_options: null;
  payment_method_types: null;
  save_default_payment_method: string;
}

interface TrialSettings {
  end_behavior: {
    missing_payment_method: string;
  };
}

interface PreviousAttributes {
  cancel_at?: number;
  cancel_at_period_end?: boolean;
  canceled_at?: number;
  cancellation_details?: CancellationDetails;
}

interface Request {
  id: string | null;
  idempotency_key: string;
}
