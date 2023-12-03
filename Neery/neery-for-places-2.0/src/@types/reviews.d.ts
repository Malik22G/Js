type ReviewFormData = {
  food: number;
  service: number;
  value: number;
  review: string;
  hearSource?: string;
  other?: string;
  isAnonymous?: boolean;
};

type CustomerReviewResponse = {
  customerName: string;
  placeName: string;
  count: number;
  date: string;
  time: string;
};
