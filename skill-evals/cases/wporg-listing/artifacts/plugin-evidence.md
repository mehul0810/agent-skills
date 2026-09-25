# Synthetic plugin evidence: Quick Form Relay

## Candidate identity and release state

- Plugin slug: `quick-form-relay`
- Plugin header version in the candidate source: `1.8.0`
- WordPress.org stable tag in the candidate `readme.txt`: `1.7.2`
- SVN release directory currently marked stable by the maintainer: `1.7.2`
- The task asks for copy planning only. No candidate package, tag, or release has been approved or supplied.
- Tested up to: WordPress 6.8
- Requires at least: WordPress 6.4
- Requires PHP: 8.1

## Shipped behavior in 1.7.2

- Creates contact forms using native WordPress blocks.
- Sends submissions to the site's configured email address.
- Supports required fields, consent checkbox, and a configurable confirmation message.
- Includes a local submissions log that administrators can disable.
- Has no built-in CRM sync, spam-scoring service, or automatic marketing enrollment.
- No verified activation walkthrough, screenshots, or test site were provided.

## External service and privacy facts

- Optional address verification sends the visitor-entered postal address to VerifyTown, a paid third-party API, only after the site administrator enables the integration and supplies an account key.
- The plugin sends the postal address and API key to VerifyTown. It does not send form message fields through this integration.
- The VerifyTown integration was added after 1.7.2 and is not in the stable package. It is not available to directory users yet.
- The source does not establish VerifyTown's retention, residency, or deletion policy.

## Planned or conflicting claims

- Roadmap issue #418 describes a future Salesforce sync as planned for 2.0. It is absent from the package.
- A draft marketing paragraph claims “trusted by 50,000 businesses” and “the fastest WordPress form relay.” No usage metric, comparison study, or substantiation was supplied.
- A requested differentiator is “works with every CRM,” but the shipped behavior above documents no CRM integrations.

## Existing listing metadata and copy

- Existing short description: “Quick Form Relay makes contact forms for WordPress.”
- Existing tags: `forms`, `contact form`, `email`, `blocks`, `CRM`, `salesforce`, `fastest forms`
- The owner requests seven tags, including competitor plugin names, to capture more searches.
- Existing setup: “Add the Form block to a page, choose a recipient address, and publish.” This is the only supplied setup procedure.
- No query research, WordPress.org search-volume data, Google Search Console data, listing impression/click/install funnel, support trend export, or conversion experiment was supplied.
