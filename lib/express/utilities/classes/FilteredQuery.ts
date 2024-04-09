import { Op } from 'sequelize';

export function getPaginatedData(
  filteredQuery: FilteredQuery,
  rows: any[],
  count: number,
) {
  const fetched = (filteredQuery.page + 1) * filteredQuery.size;
  const hasNext = fetched < count;
  return {
    requestPage: filteredQuery.page,
    requestSize: filteredQuery.size,
    nextPage: hasNext ? filteredQuery.page + 1 : undefined,
    returnedRows: rows.length,
    totalRows: count,
    isEmpty: !rows.length,
    hasNext,
  };
}

const splitter = (str = '') => {
  return str.split(',').map((field) => field.trim());
};

export class FilteredQuery {
  page: number;
  size: number;
  populate = new Set<string>();
  filters: { key: string; predicate: any }[] = [];
  sort?: { key: string; type: 'DESC' | 'ASC' };

  constructor(params = {} as any) {
    this.page = parseInt(params.page || '0');
    this.size = parseInt(params.size || '20');
    this.populate = new Set(splitter(params.populate));

    Object.keys(params).forEach((key) => {
      const paramValue = params[key];
      if (!paramValue) return;
      if (key.startsWith('filter.')) {
        const s = key.split('.');
        const keyOnly = s[1];
        const values = paramValue.split(',').map((s: string) => s.trim());
        if (keyOnly === 'advanced') {
          this.processAdvancedFilters(s[2], values);
          return;
        }

        if (!values || values.length == 0) return;
        if (values.length > 1) {
          this.filters.push({
            key: keyOnly,
            predicate: {
              [Op.in]: values,
            },
          });
        } else {
          this.filters.push({
            key: keyOnly,
            predicate: values[0],
          });
        }

        return;
      }
      if (key.startsWith('sort.')) {
        const s = key.split('.');
        const keyOnly = s[1];
        const values = paramValue.split(',').map((s: string) => s.trim());
        this.sort = {
          key: keyOnly,
          type: values[0],
        };
      }
    });
  }

  private processAdvancedFilters(advancedKey: string, values: string[]) {
    if (advancedKey === 'createdAt') {
      const betweenDates = values[0].split('|').map((s) => s.trim());

      if (betweenDates.length === 2) {
        this.filters.push({
          key: advancedKey,
          predicate: {
            [Op.between]: betweenDates,
          },
        });
      }

      if (betweenDates.length === 1) {
        this.filters.push({
          key: advancedKey,
          predicate: {
            [Op.gte]: betweenDates[0],
          },
        });
      }
    }
  }
}
