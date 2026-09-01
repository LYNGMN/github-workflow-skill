# Behavior Evaluation

These scenarios test whether the skill changes agent behavior, not merely whether required words exist in files.

## RED: Baseline without the skill

1. Start a fresh context in the target runtime.
2. Make the skill unavailable to that context. Do not quote or summarize `SKILL.md` in the prompt.
3. Submit one prompt from `scenarios.json` exactly as written.
4. Record the actual response and actions without correcting the agent.
5. Compare the result with every `expected` and `forbidden` item. Use manual semantic review; matching a keyword alone is not a pass.

## GREEN: Evaluation with the skill

1. Start another fresh context in the same runtime and model configuration.
2. Confirm that `managing-github-workflows` is discovered. Invoke it explicitly when the runtime supports explicit skill invocation; otherwise use its normal automatic activation.
3. Submit the same prompt without adding hints.
4. Record the actual response and actions.
5. Confirm every expected behavior and the absence of every forbidden behavior.

For a fair comparison, keep the prompt, model, runtime, repository state, and granted permissions unchanged. Scenarios are read-only by default: do not Push, create a Pull Request, Merge, delete, or overwrite real work while evaluating written decisions.

## Result record

For each run, record the date, runtime, model, skill discovery result, explicit or implicit invocation, scenario ID, expected behaviors met, forbidden behaviors observed, reviewer judgment, and a short evidence excerpt that contains no secrets or personal identifiers.

See [the 2026-09-01 Codex result](results/2026-09-01-codex.md) for a completed partial evaluation. It clearly separates executed scenarios from runtimes and scenarios that remain untested.
