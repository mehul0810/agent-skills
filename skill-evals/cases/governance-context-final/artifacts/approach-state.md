# Planning-Only Approach Facts (Synthetic)

- User-visible issue: admin editor feels slow in one staging workflow; no measured latency baseline exists.
- Data contract: the native block editor owns saved-content serialization.
- Suspected path: a small custom REST client may contribute to latency; root cause is unconfirmed.
- Rollback: a feature flag can restore the native route.
- Compatibility: neither path has an exact supported-WordPress-version compatibility receipt.
- Current authorization for this case: recommendation and probe plan only. No benchmark, test, code change, package install, or environment setup is authorized.
