export interface SchemaConfigs {
  softDelete?: boolean;
  uniques?: any[];
  returnDuplicate?: boolean;
  fillables?: any[];
  updateFillables?: any[];
  hiddenFields?: string[];
  searchQuery?: (
    query: string,
  ) => [{ title: { $regex: RegExp; $options: 'i' } }, { description: { $regex: RegExp; $options: 'i' } }];
}
// searchQuery = (q) => {
//     const regex = new RegExp(q);
//     return [
//       { title: { $regex: regex, $options: 'i' } },
//       { description: { $regex: regex, $options: 'i' } },
//     ];
//   };