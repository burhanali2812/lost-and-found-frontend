import { createContext, useState } from 'react';

export const BrandContext = createContext();
export const BrandProvider = ({children}) =>{
    const[selectedBrands, setSelectedBrands] = useState([]);

    return(
        <BrandContext.Provider value = {{selectedBrands, setSelectedBrands}}>
            {children}
        </BrandContext.Provider>
    )
}