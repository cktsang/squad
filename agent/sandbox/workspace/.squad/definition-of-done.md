# Definition of Done

A ticket is done when all of these hold:

- [ ] Every acceptance criterion is implemented and proven by a test that fails if the behavior breaks.
- [ ] Format check, lint, typecheck, all tests, and build pass (latest test report is PASS).
- [ ] No new warnings, `TODO`s without a ticket ID, debug output, or commented-out code.
- [ ] The change follows `architecture.md` conventions and project layout.
- [ ] No changes outside the ticket's scope.
- [ ] No secrets, credentials, or personal data in code, config, or logs.
- [ ] Reviewer verdict is APPROVE; security verdict is PASS when a security review was required.
- [ ] README and CHANGELOG reflect the change.
- [ ] The change is committed on its own `squad/<ticket-id>-…` branch with a message referencing the ticket ID.
- [ ] When tickets live on GitHub: the branch is pushed and a pull request is open, linking the issue with `Closes #<issue>`.
