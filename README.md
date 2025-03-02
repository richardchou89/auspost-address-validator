**IMPORTANT**

To run this app locally, add `.env` to root directory, with below env vars:

```
// AusPost bearer token
API_TOKEN=     
GRAPHQL_URL=http://localhost:3000/api/graphql
```

This project has been deployed to Vercel. Test it [here](https://lawpath-konami99s-projects.vercel.app/).

It can also be started from local.

# Requirements

1. Latest Nextjs (15.2.0)
2. Nodejs 20 or above

# Local installation

1. Clone into your local
2. Add `.env` to root dir
3. `npm install`
4. `npm run dev`

The app should start running on port 3000.

![image](https://github.com/user-attachments/assets/39982ab0-5294-4656-8df1-2a3de187d7cf)

Frontend (http://localhost:3000/):

![image](https://github.com/user-attachments/assets/d429272e-258b-45cc-801f-c6b14ec3ef7e)

GraphQL server (http://localhost:3000/api/graphql)

![image](https://github.com/user-attachments/assets/c7b5ee3a-aeb9-498a-b1ff-b9a6f6c4ae8c)

An example query:

```
query  {
  localities(postcode: "2000", suburb: "Sydney south", state: "NSW") {
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
```

# Basic structure

![image](https://github.com/user-attachments/assets/ed633131-5f51-4a01-b9c5-0d023973c7d7)

Frontend: frontend is a standard Nextjs app.

GraphQL server: is mounted on API routes by using `@as-integrations/next` package.

Proxy: proxy class is created by extending `RESTDataSource` from `@apollo/datasource-rest` package.

REST endpoint: AusPost API.

# Workflow

![image](https://github.com/user-attachments/assets/ee063a98-d89d-4455-8032-69462fe22d9e)

1. When user enters postcode, suburb and state and clicks submit, the form will be validated client-side and then posted to server component (`submitAddress`).

2. Server component (`submitAddress`) will validate form server-side, and then use Apollo client to call GraphQL server.

3. GraphQL server will call REST API through proxy (`LocalityAPI`)

4. REST API returns response, and the proxy transforms response to GraphQL.

5. Server component returns GraphQL to UI for display.

# How search is done

If we pass all parameters (postcode, suburb, state) to AusPost API, we can't tell whether postcode and suburb mismatch, or suburb and state mismatch.

My approach is to only pass postcode and suburb to the API. If response if empty, we know postcode and suburb mismatch.

Then do filtering of state (NSW, VIC, TAS...etc) in resolver. If result is empty, we know suburb and state mismatch.

# Video walkthrough

https://github.com/user-attachments/assets/1e4ab181-f9b5-45c2-8f1d-209ddbe80096

### REST API intermittent failure

The REST endpoint returns errors intermittently:
```
{
    "error": "Internal Server Error"
}
```
This is properly handled in the code. UI will display `an unexpected error occurred`.

# Form validation

Form validation is done client-side and server-side, by `zod`.

To test server-side validation, uncomment

```
/*
const rawData: AddressFormType = {
  postcode: "",
  suburb: "",
  state: "",
}
*/
```
and `const validatedData = addressFormSchema.safeParse(rawData);`.

# Design

This project was styled by using Tailwindcss, and is responsive.

Mobile view:

![image](https://github.com/user-attachments/assets/33e1fd93-327a-44af-86c5-15577023a97a)

Desktop view:

![image](https://github.com/user-attachments/assets/79554e2c-7966-4019-92a3-92063e51373a)

# Tests

E2E tests and UI tests are written to ensure the app behave as expected. Libraries used: `jest` and `react-testing-library`.

To run test:

```
npm run test
```

![image](https://github.com/user-attachments/assets/1b50fa05-bc52-43a9-8f45-f400356314ca)

Due to intermittent failures of AusPost API, sometimes tests might fail. If given more time, this can be handled properly.
