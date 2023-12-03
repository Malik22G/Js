type SubscriptionPlan = {
  id: string;
  product: SubscriptionProduct;
  unit_amount: number;
  currency: string;
  recurring: { [key: string]: string[] };
};

type SubscriptionProduct = {
  id: string;
  name: string;
  tier: string;
};

type PlaceSubscription = {
  uuid: string;
  place_id: string;
  stripe_subscription_id: string;
  subscription_tier: string;
  subscription_start: number;
  subscription_end: number;
  is_auto_renew: boolean;
  status: "active" | "trial" | "canceled";
  last_payment_date?: number;
};
