## Implement the following functionalities

- Add a simple login screen. Send the token with every API call from one central place, not from each call.
- Show the task list from GET /api/tasks: title, assignee, status and due date.
- Add a status filter. The filter must be sent to the API; do not filter in the browser.
- On each task that is not DONE, add a Move to next status button. After it succeeds, refresh the list. If the API refuses the change, show its message.
- Keep the server calls in a separate service, and show simple loading and error messages.
