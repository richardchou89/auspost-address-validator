'use server'

import { AddressFormType, addressFormSchema } from "@/lib/address-form-schema";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

export async function submitAddress(formData: AddressFormType) {
  console.log(`formData`, formData);

  try {
    /*
    const rawData: AddressFormType = {
      postcode: "",
      suburb: "",
      state: "",
    }
    */
    const validatedData = addressFormSchema.safeParse(formData);
    
    if (!validatedData.success) {
      return {
        success: false,
        message: 'Please fix the errors in the form',
        errors: validatedData.error.flatten().fieldErrors,
      }
    }

    const client = new ApolloClient({
      uri: "http://localhost:3000/api/graphql",
      cache: new InMemoryCache(),
    });
    
    const LOCALITIES = gql(`
      query GetLocalities($postcode: String!, $suburb: String!, $state: String!) {
        localities(postcode: $postcode, suburb: $suburb, state: $state) {
          message
          items {
            id
            postcode
            location
            latitude
            longitude
            state
            category
          }
        }
      }
    `);
    
    const response = await client
      .query({
        query: LOCALITIES,
        variables: {
          postcode: validatedData.data.postcode,
          suburb: validatedData.data.suburb,
          state: validatedData.data.state
        },
      });
    
    return {
      success: true,
      message: response.data.localities.message,
    }
  } catch {
    return {
      success: false,
      message: 'An unexpected error occurred',
    }
  }
}

