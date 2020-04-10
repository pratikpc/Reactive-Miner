  import { createContext } from 'react';

export const csvContext = createContext({
    csv: null,
    fetchCsv: (csv) => {}
});