export const resolvers = {
  Query: {
    localities: async (_, { q, state }, { dataSources }) => {
      const results = await dataSources.localityAPI.getLocalities(q);

      if (Array.isArray(results.localities.locality)) {
        return results.localities.locality;
      } else if (results.localities.locality !== undefined) {
        return [results.localities.locality]
      }

      return [];
    },
  },
}