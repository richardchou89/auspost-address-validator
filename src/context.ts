import { LocalityAPI } from "./datasources/locality-api";

export type DataSourceContext = {
  dataSources: {
    localityAPI: LocalityAPI
  };
};