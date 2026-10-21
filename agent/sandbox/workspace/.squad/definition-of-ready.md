# Definition of Ready

A ticket is ready to build when all of these hold:

- [ ] It has a user story with persona, capability, and benefit.
- [ ] It traces to a feature in `spec.md` (or is T-001 / infrastructure).
- [ ] Every acceptance criterion is in Given/When/Then form, observable, and testable.
- [ ] Error, empty, and edge cases are covered by acceptance criteria.
- [ ] Use cases list preconditions, main flow, alternative flows, and postconditions.
- [ ] Dependencies are listed and all of them are done.
- [ ] Technical notes name the modules or files involved, consistent with `architecture.md`.
- [ ] Test notes say what to cover at which test level.
- [ ] Out of scope is stated.
- [ ] The context pack exists and estimates at most ~150 changed lines (otherwise decompose).
- [ ] No open question requires a user decision.
