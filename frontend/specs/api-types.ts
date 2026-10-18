/** A calendar date serialized by the API as YYYY-MM-DD. */
export type ISODateString = string;

/** Operation types supported by the financial metrics API. */
export type OperationType = "income" | "outcome";

/** Business groups supported by the financial metrics API. */
export type BusinessType = "B2B" | "B2C";

/** Categories supported by financial movements. */
export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

/** Available filter values and the overall date bounds of the dataset. */
export interface FacetsResponse {
  /** Operation types present in the dataset: `income` and/or `outcome`. */
  operation_types: OperationType[];
  /** Business groups present in the dataset: `B2B` and/or `B2C`. */
  business_types: BusinessType[];
  /** Categories present across the dataset; the API does not split these by business group. */
  categories: Category[];
  /** Earliest available movement date, formatted as YYYY-MM-DD. */
  min_date: ISODateString;
  /** Latest available movement date, formatted as YYYY-MM-DD. */
  max_date: ISODateString;
}

/** A period flagged by the anomalies endpoint. */
export interface AlertEntry {
  /** Period key, formatted as YYYY-MM for monthly grouping or as returned for the selected grouping. */
  period: string;
  /** Recorded outcome total for the period, in the dataset's currency. */
  outcome_total: number;
  /** Average outcome of preceding periods used by the current API as its baseline. */
  baseline_average: number;
  /** Relative increase over the baseline, represented as a ratio (for example, 0.3 means 30%). */
  increase_ratio: number;
}

/** The alerts endpoint returns a list directly; it has no object wrapper. */
export type AlertsResponse = AlertEntry[];

/** A category total returned by the top-categories endpoint. */
export interface CategoryEntry {
  /** Financial movement category. */
  category: Category;
  /** Operation type used to calculate this total: `income` or `outcome`. */
  operation_type: OperationType;
  /** Sum for this category in the selected group and date range, in the dataset's currency. */
  total_amount: number;
}

/** The top-categories endpoint returns a list directly; it has no object wrapper. */
export type TopCategoriesResponse = CategoryEntry[];