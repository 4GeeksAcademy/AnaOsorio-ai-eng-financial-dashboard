import type {
  BusinessType,
  ISODateString,
  OperationType,
} from "./api-types";

/** Optional date bounds for API queries. Omitted bounds leave that side unfiltered. */
export interface DateRangeFilter {
  /** Inclusive start date, serialized to the API as `start_date` in YYYY-MM-DD format. */
  startDate?: ISODateString;
  /** Inclusive end date, serialized to the API as `end_date` in YYYY-MM-DD format. */
  endDate?: ISODateString;
}

/** Query parameters for anomaly alerts. */
export interface AlertsParams extends DateRangeFilter {
  /** Alert threshold ratio from 0.01 to 1.0 inclusive; defaults to 0.3 in the dashboard. */
  threshold: number;
}

/** Query parameters for category totals used in the B2B vs B2C comparison. */
export interface TopCategoriesParams extends DateRangeFilter {
  /** Operation type to aggregate; the comparison uses `income`. */
  operation_type: OperationType;
  /** Maximum number of categories to return; valid API values are integers from 1 to 20. */
  limit: number;
  /** Business group to filter; pass `B2B` or `B2C` to request each comparison section. */
  business_type?: BusinessType;
}