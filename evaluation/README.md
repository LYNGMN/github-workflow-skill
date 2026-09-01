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

## Optional real Codex regression

The deterministic `npm test` contract remains the continuous integration (CI) gate because public CI may not have a Codex executable or model authentication. In an authenticated local Codex environment, run the optional real Codex explicit and implicit invocation regression at default and low reasoning:

```bash
npm run test:codex-invocation -- --mode all --reasoning default,low
```

The runner copies only the public skill entrypoint, references, metadata, READMEs, license, and contribution guide to an isolated temporary repository. It does not copy unrelated or untracked working-tree files. It disables persistent user instructions, uses an ephemeral read-only sandbox, limits each model call to three minutes, requires every English or Korean progress field to appear exactly once at the start of its own line, validates exact-state approval semantics, redacts personal paths and common token formats from errors, and removes the temporary repository. It does not call GitHub or mutate the source repository. A passing deterministic test does not claim that this optional model-dependent regression ran; record actual execution separately.

The runner also gives child processes an explicit allowlist instead of inheriting the parent shell environment. It keeps only basic process, locale, terminal, certificate, and Codex credential-location variables; blocks GitHub tokens, API keys, generic secret variables, and Git repository redirection variables; disables system and global Git configuration for the temporary repository; and tells model-generated shell commands to inherit no environment variables. Authentication must therefore already be available through the runtime's browser or system credential storage under the retained `HOME` or `CODEX_HOME`, not through an environment API key. Diagnostics redact both locations. Disabled skill paths are serialized as TOML basic strings so Windows backslashes remain valid. The result summary reports `"environment": "allowlisted"` when this boundary is active.

By default, the runner isolates the target skill from globally installed copies of `managing-github-workflows` and the broader legacy `managing-git-safely` skill. This makes the gate measure the public package under test instead of whichever global duplicate wins discovery. To diagnose real selection behavior when the broader skill is also visible, add `--with-overlap`:

```bash
npm run test:codex-invocation -- --mode implicit --reasoning low --with-overlap
```

The overlap diagnostic may fail before the target skill is activated. That result means routing or another installed skill's discovery description must be corrected; it does not prove that the target skill's response contract failed after activation.

## Result record

For each run, record the date, runtime, model, skill discovery result, explicit or implicit invocation, scenario ID, expected behaviors met, forbidden behaviors observed, reviewer judgment, and a short evidence excerpt that contains no secrets or personal identifiers.

See [the initial 2026-09-01 Codex result](results/2026-09-01-codex.md) for the original partial evaluation and [the invocation-contract regression](results/2026-09-01-implicit-contract-codex.md) for the isolated explicit and implicit Codex runs. Both records separate executed scenarios from runtimes and scenarios that remain untested.
