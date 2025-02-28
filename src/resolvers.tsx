export const resolvers = {
  Query: {
    localities: async (_, { q }, { dataSources }) => {
      const results = await dataSources.localityAPI.getLocalities(q);

      if (Array.isArray(results.localities.locality)) {
        return { items: results.localities.locality };
      }

      return results.localities.locality
    },
  },
  LocalitiesResult: {
    __resolveType(obj) {
      console.log(`obj`, obj)
      if (Array.isArray(obj.items)) {
        return "LocalityList";
      }
      if (obj.id) {
        return "Locality";
      }
      return null;
    },
  },
}