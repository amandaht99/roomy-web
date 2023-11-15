import { Property } from "@/components/property-info";
import React, { createContext, useState, useContext, ReactNode } from "react";

type PropertiesContextType = {
  properties: Property[] | [];
  setProperties: React.Dispatch<React.SetStateAction<Property[] | []>>;
  filtersApplied: boolean;
  setFiltersApplied: React.Dispatch<React.SetStateAction<boolean>>;
};

const PropertiesContext = createContext<PropertiesContextType | undefined>(
  undefined
);

type PropertiesProviderProps = {
  children: ReactNode;
};

export const PropertiesProvider: React.FC<PropertiesProviderProps> = ({
  children,
}) => {
  const [properties, setProperties] = useState<Property[] | []>([]);
  const [filtersApplied, setFiltersApplied] = useState<boolean>(false);

  return (
    <PropertiesContext.Provider
      value={{ properties, setProperties, filtersApplied, setFiltersApplied }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = (): PropertiesContextType => {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error("useProperties must be used within a PropertiesProvider");
  }
  return context;
};
