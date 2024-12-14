import type { SelectLegacyPaystub } from '../mysql/db.model';


export interface ILegacyPaystubSearchResult {
  data: SelectLegacyPaystub[];
  pagination: {
      total: number;
      offset: number;
      limit: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
  };
}