import { AugmentedRequest, RESTDataSource } from "@apollo/datasource-rest";
import { LocalitiesModel } from "@/models/localities";

export class LocalityAPI extends RESTDataSource {
  baseURL = "https://gavg8gilmf.execute-api.ap-southeast-2.amazonaws.com/";

  willSendRequest(_path: string, request: AugmentedRequest) {
    request.headers["Authorization"] = `Bearer ${process.env.API_TOKEN}`;
  }

  async getLocalities(q: string) {
    return this.get<LocalitiesModel>('staging/postcode/search.json', {
      params: { q }
    })
  }
}