# Content management

## Creating 

1. **Trigger:** For a selected file

2. **Get file properties:**
    - Returns all properties about a file

## Updating content

## Creat

# Flows from the si

# Contact Form to Dataverse Workflow

## Power Automate Flow Steps

1. **Trigger:** When an HTTP request is received
   - Accepts POST requests from the React contact form.

2. **Parse JSON:**
   - Use the following schema in the Parse JSON action:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "email": { "type": "string" },
    "subject": { "type": "string" },
    "message": { "type": "string" },
    "timestamp": { "type": "string" }
  },
  "required": ["name", "email", "subject", "message"]
}
```

3. **Add a new row to Dataverse:**
   - Map the parsed fields to the appropriate columns in your Dataverse table (e.g., Name, Email, Subject, Message, Timestamp).

4. **(Optional) Further Actions:**
   - Send a confirmation email to the submitter.
   - Notify a team via Teams or email.
   - Log the submission or trigger additional business logic.

5. **Response:**
   - Return a 200 OK response with a success message or error details for the frontend.

---

## Example Request Body

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "subject": "Inquiry",
  "message": "I would like more information about your services.",
  "timestamp": "2026-01-07T12:34:56Z"
}
```

---

## Security Tips
- Require a shared secret or API key in the request header and validate it in the flow.
- Validate and sanitize all input fields before writing to Dataverse.

---

_This document serves as a reference for the contact form to Dataverse workflow using Power Automate._
