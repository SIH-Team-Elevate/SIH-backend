# SIH Team Elevates Backend structure
## About
## Schema

this is a basic representation of the MongoDB schema, whereas hyperledger is suppose to store the present location and filled status of the dumster and other information related to shovel and dumster

| User        |       | Dumpster    |       | Shovel   |       | Queries                          |
|-------------|-------|-------------|-------|----------|-------|----------------------------------|
| _id         |       | _id         |       | _id      |       | _id                              |
| email       |       | id          |       | name     |       | user                             |
| name        |       | name        |       | size     |       | description/status/response      |
| password    |       | capacity    |       | worker   |       |                                   |
| total       |       | driver      |       |          |       |                                   |
| type        |       |             |       |          |       |                                   |
| autho       |       |             |       |          |       |                                   |
| lastLogin   |       |             |       |          |       |                                   |
| History     |       |             |       |          |       |                                   |
| queries ⟶   |       |             |       |          |       |                                   |
| equipment   |       |             |       |          |       |                                   |
| onModel     |       |             |       |          |       |                                   |

*The folder structure can be found in backend/database/


## API endpoints and their description

1. **POST /frontend/authenticate**
   - *Description*: Authenticates a user based on their email and password.
   - *Request Body*: `{ "email": "user@example.com", "password": "userpassword" }`
   - *Response*:
     - Successful authentication: `{ success: true, message: 'Authentication succeeded.', autho: 'generatedToken', type: 'userType' }`
     - Failed authentication: `{ success: false, message: 'Authentication failed. User not found.' }` or `{ success: false, message: 'Authentication failed. Wrong password.' }`

2. **POST /frontend/register**
   - *Description*: Registers a new user.
   - *Request Body*: `{ "name": "UserName", "email": "user@example.com", "password": "userpassword", "type": "userType" }`
   - *Response*:
     - Successful registration: `{ success: true, message: 'Register succeeded', autho: 'generatedToken', type: 'userType' }`
     - Failed registration: `{ success: false, message: 'Register failed' + errorMessage }`

3. **Middleware: Token Authentication**
   - *Description*: Verifies token for authentication.
   - *Parameters*: `req.body.autho`, `req.query.autho`, `req.headers['x-access-token']`
   - *Response*:
     - Failed to authenticate token: `{ success: false, message: 'Failed to authenticate token.' }`
     - No token provided: `{ success: false, message: 'No token provided.' }`
     - Success (if authenticated): Proceeds to the next middleware or endpoint.

4. **GET /frontend/users**
   - *Description*: Retrieves users based on type and/or name.
   - *Query Parameters*: `type`, `name`, `autho`
   - *Response*: `{ success: true, message: 'Get users succeeded', users: [user1, user2, ...] }` or `{ success: false, message: 'Get users failed' + errorMessage }`

5. **DELETE /frontend/queries/:id**
   - *Description*: Deletes a query by ID.
   - *Parameters*: `id` (query ID), `autho`
   - *Response*: `{ success: true, message: 'Delete queries succeeded', query: deletedQuery }` or `{ success: false, message: 'Delete queries failed' + errorMessage }`

6. **PUT /frontend/queries/:id**
   - *Description*: Updates a query's status by ID.
   - *Parameters*: `id` (query ID), `autho`
   - *Response*: `{ success: true, message: 'Update queries succeeded', query: updatedQuery }` or `{ success: false, message: 'Update queries failed' + errorMessage }`

7. **POST /frontend/queries**
   - *Description*: Creates a new query and associates it with a user.
   - *Request Body*: `{ "user": "userID", "description": "Query description" }`
   - *Parameters*: `autho`
   - *Response*: `{ success: true, message: 'Post queries succeeded', query: newQuery }` or `{ success: false, message: 'Post queries failed' + errorMessage }`

8. **GET /frontend/queries**
   - *Description*: Retrieves queries with a specific status.
   - *Parameters*: `status`, `autho`
   - *Response*: `{ success: true, message: 'Get queries succeeded', queries: [query1, query2, ...] }` or `{ success: false, message: 'Get queries failed' + errorMessage }`
*the folder structure can be explored as backend/router
*The backend is also suppose to serve the statics i.e. build of react i.e the admin page
