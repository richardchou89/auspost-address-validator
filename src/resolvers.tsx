export const resolvers = {
  Query: {
    localities: async (_, { postcode, suburb, state }, { dataSources }) => {
      const results = await dataSources.localityAPI.getLocalities(`${suburb} ${postcode}`);

      if (Array.isArray(results.localities.locality)) {
        const filteredLocalities = results.localities.locality.filter(locality => locality.state === state);

        return {
          message: filteredLocalities.length === 0 ? `The suburb ${suburb} does not exist in the state ${state}` : `The postcode, suburb, and state input are valid`,
          items: filteredLocalities
        };
      } else if (results.localities.locality !== undefined) {
        const filteredLocalities = [results.localities.locality].filter(locality => locality.state === state);

        return {
          message: filteredLocalities.length === 0 ? `The suburb ${suburb} does not exist in the state ${state}` : `The postcode, suburb, and state input are valid`,
          items: filteredLocalities
        };
      }

      return {
        message: `The postcode ${postcode} does not match the suburb ${suburb}`,
        items: []
      }
    },
  },
}