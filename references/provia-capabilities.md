# Provia capability baseline

Baseline: workflow contract revision recorded in contracts/workflow-v1/contract-lock.json. This is implementation evidence, not proof of the version deployed in a customer environment.

A Workflow defines a repeatable process. An Incident is one execution of a workflow. An Action is one step. Entities hold reusable business records, metadata holds structured case values, tags classify records, and pages/files/comments provide explanation and evidence. Explain “incident” as a process case when the business context is not emergency response.

Supported action types: Standard, Decision, Sub-workflow, Notification, Wait, HTTP Request and Form Fill. AI agents are assignees on Standard actions. Decisions have named outcomes: continue, cancel the incident, trigger another workflow or return to an action. Do not promise arbitrary BPMN gateways or automatic value-based branching. Standard actions should say what evidence proves completion.

Manual, email, webhook and schedule triggers are portable. Form intake creates an incident through a separately configured form. Form Fill collects answers inside an incident. Single responses may map values; multiple responses remain separate for review and cannot map competing values to incident metadata. Form definitions and links require setup outside YAML.

Sequential execution enforces predecessors; parallel work is appropriate only for independent tasks. Sub-workflows have input/output mappings and parent cancellation/timeout behavior. Notifications inform recipients; waits depend on time, metadata or a webhook; HTTP calls need an allowed destination and configured secrets.

Publication creates an active workflow version. New incidents use the active design. Existing actions are instantiated, but metadata validation can still consult workflow-level configuration. Treat incompatible field changes as a risk to check for open incidents. There is no general side-by-side version comparison or one-click rollback. Re-importing YAML creates a new draft lineage, not restored history.

Groups support ownership and assignment, but assignmentStrategy is not portable in the pinned YAML contract. AI and reports depend on plan, permissions and settings. Ask AI is read-only. Report schedules may be stored, but scheduled report delivery is not implemented in this baseline. Workdays skip weekends, not public holidays.

This downloadable plugin has no connector, credentials or network integration with Provia. It works with user-supplied procedures, exports and record snapshots. It does not create records, publish workflows, send notifications, configure AI profiles, or continuously monitor work. Do not reuse the internal AI skill catalog as an installation path for this external plugin.

For YAML work, read workflow-yaml.md and execute the bundled validator. Keep an explicit setup handover for organization references and nonportable resources. For up-to-date product navigation use https://docs.provia.ao/ and verify environment differences with the user’s actual UI.
