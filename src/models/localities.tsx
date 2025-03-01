import { LocalityModel } from "./locality";

export type LocalitiesModel = {
  localities: { locality: LocalityModel | [LocalityModel] | undefined }
};