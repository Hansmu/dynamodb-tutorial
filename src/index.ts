import {getSingleItem, paginatedRead} from "./read-operations";

// const wrapper = async () => {
//     const lastEvaluatedKey = await paginatedRead(undefined);
//     console.log('The lastEvaluatedKey', lastEvaluatedKey);
//     const newLastEvaluatedKey = await paginatedRead(lastEvaluatedKey as any);
//     console.log('The next lastEvaluatedKey', newLastEvaluatedKey);
// };
//
// wrapper();