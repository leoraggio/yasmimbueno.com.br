# AGENTS.md

## Code comments

Only add comments when they provide relevant information that cannot be
inferred from reading the code alone. Do not use comments to narrate or restate
the code.

## Testing

The landing page is guarded by a committed-baseline visual regression suite:
`npm run test:visual`. Any change that alters what the page renders will turn it
red. That is not a failure to route around — either the change was wrong, or the
baselines belong in the same commit as the change that justifies them. See
`docs/visual-regression.md`.

`npm run typecheck` and `npm run lint` are the other two gates.

## Agent skills

### Issue tracker

Issues live as GitHub issues in `leoraggio/yasmimbueno.com.br`, managed via the
`gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each label string equal to its name. See
`docs/agents/triage-labels.md`.

### Domain docs

Single-context — `CONTEXT.md` and `docs/adr/` at the repo root. See
`docs/agents/domain.md`.
