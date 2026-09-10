# Provia Skills

Country-aware skills for designing, structuring, validating and improving Provia workflows. Angola is the primary business context; output language and jurisdiction remain explicit choices.

This repository is the source and community home. **Downloads, installation and the user guide live only in [Provia documentation](https://docs.provia.ao/guides/provia-skills).** The Portuguese guide is at https://docs.provia.ao/pt/guides/provia-skills.

Fourteen skills cover process discovery, workflow design, information modeling, forms, YAML packages, review, rollout, automation, AI actions, triage, improvement, controls, knowledge and change planning. They use supplied documents and exports. No connector, telemetry, authentication or Provia mutations are included.

## Maintainer checks

Node 20.11+ and Python 3 are sufficient. No runtime npm installation is needed.

```sh
npm test
node scripts/check-contract.mjs
python3 scripts/build-release.py --output /path/to/staging
```

To refresh the contract, use an authorized local Provia checkout with dependencies installed:

```sh
node scripts/build-contract.mjs /path/to/processonrails
node scripts/check-contract.mjs /path/to/processonrails
npm test
```

The build bundles only the needed validation functions and records their source hashes and third-party licenses. Review contract changes and run the product’s contract tests before releasing; public CI does not need the private application repository. Do not copy application secrets, records or deployment configuration here.

See CONTRIBUTING.md for changes and CHANGELOG.md for the initial release scope. A source commit does not update a documentation download; maintainers promote an explicitly reviewed archive and metadata together.
