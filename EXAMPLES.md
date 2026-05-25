# Usage Examples

Real-world scenarios showing how to use the WP Expert skill pack.

## Example 1: Reviewing a Plugin for Security & WordPress.org Compliance

**Scenario**: A client submitted a plugin for WordPress.org review and you need to audit it for security, performance, and guideline compliance.

### Step 1: Discover the Repository

```bash
bash wp-expert/scripts/wp-context.sh /path/to/plugin
```

This shows:
- Plugin entry point and bootstrap
- Hooks and filters defined
- Database tables or options
- Active theme dependencies

### Step 2: Load the Right References

Based on the task, load in order:

1. **Primary**: `plugin-guidelines-review.md`
   - What does WordPress.org require?
   - What will cause rejection?

2. **Supporting**: `review-checklists.md`
   - Check security authorization, nonces, sanitization
   - Check performance: query count, autoload options
   - Check code duplication and testability

3. **Supporting**: `performance-and-security.md`
   - Is caching implemented correctly?
   - Any SQL injection risks?
   - Proper use of `prepare()` for dynamic SQL?

### Step 3: Validate the Code

```bash
bash wp-expert/scripts/wp-validate.sh /path/to/plugin
```

This checks:
- PHP syntax errors
- WordPress coding standards (if PHPCS available)
- File organization issues

### Step 4: Document Findings

Based on the checklist, find:
- **P0 findings** (security exploits, data loss)
- **P1 findings** (likely bugs, performance failures)
- **P2 findings** (maintainability, UX issues)
- **P3 findings** (cleanup, consistency)

**Example finding:**
```
P1: Missing nonce verification in AJAX handler
File: plugin/src/admin/ajax-handler.php line 42
Impact: CSRF vulnerability in admin settings save
Fix: Add wp_verify_nonce() check before processing $_POST data
```

### Step 5: Recommend or Block

After review:
- ✅ **Approve**: If no P0/P1 findings and all P2 items are addressed
- ⚠️ **Request changes**: If P1 findings exist or compliance gaps
- ❌ **Reject**: If exploitable security issues or deliberate guideline violations

---

## Example 2: Converting a Design into an FSE Block Theme

**Scenario**: A designer handed you a Figma design and you need to build a custom block theme for WordPress 6.0+.

### Step 1: Analyze the Design

- Color palette and typography
- Layout patterns (hero, grid, cards, etc.)
- Interactive elements
- Responsive breakpoints

### Step 2: Create a Design-to-FSE Map

Create `theme-design-map.md`:

```markdown
# Theme Design Map

## Colors
- Primary: #0073aa
- Secondary: #FF6B6B
- Neutral: #F5F5F5

## Typography
- Headings: Inter Bold
- Body: Inter Regular (16px, line-height 1.6)

## Layout Patterns
- Hero: Full-width image + centered text overlay
- Grid: 3-column on desktop, 2-column on tablet, 1 on mobile
- Card: Image + title + description + CTA button
```

### Step 3: Generate theme.json

```bash
bash wp-expert/scripts/fse-design-map.sh theme-design-map.md
```

This outputs:
- `theme.json` structure with colors, typography, spacing
- Core block style names
- Responsive breakpoint definitions

### Step 4: Load Implementation Reference

1. **Primary**: `custom-block-theme-from-design.md`
   - Map design colors to CSS variables
   - Use core blocks, not custom HTML
   - Create patterns for repeated layouts

2. **Supporting**: `theme-and-block-editor.md`
   - Block compatibility and attributes
   - Editor vs. frontend parity
   - Template hierarchy

3. **Supporting**: `visual-parity-regression.md`
   - How to verify design matches across editor and frontend
   - Screenshot comparison workflow

### Step 5: Build Incrementally

```
theme/
├── theme.json (colors, typography, spacing)
├── functions.php (minimal: enqueue, support)
├── parts/
│   ├── header.html
│   ├── footer.html
│   └── sidebar.html
├── patterns/
│   ├── hero.php
│   ├── grid-3-col.php
│   └── card-with-cta.php
└── styles.css
```

### Step 6: Test & Iterate

- Open Site Editor in WordPress admin
- Check each layout against design (use `visual-parity-regression.md`)
- Test responsive breakpoints (mobile, tablet, desktop)
- Verify frontend matches editor view

### Step 7: Deploy

- Test with sample posts and pages
- Check block editor performance
- Verify all core blocks render correctly
- Create child theme documentation for clients

---

## Example 3: Setting Up CI/CD with GitHub Actions

**Scenario**: Your WordPress plugin needs automated testing, linting, and releases to WordPress.org.

### Step 1: Plan the Workflow

1. **Primary**: `standards-ci-github.md`
   - What checks should run on every PR?
   - What triggers a release?
   - How do we deploy to WordPress.org?

2. **Supporting**: `build-tooling.md`
   - Composer install for production
   - npm build steps if needed

### Step 2: Create GitHub Actions Workflow

`.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  phpcs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: php-actions/phpcs@v1
        with:
          standards: WordPress

  phpstan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: php-actions/phpstan@v1
        with:
          memory_limit: 256M

  phpunit:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        php: ['7.4', '8.0', '8.1']
    steps:
      - uses: actions/checkout@v3
      - uses: php-actions/phpunit@v1
        with:
          php_version: ${{ matrix.php }}
          version: latest
```

### Step 3: Validate Dependency Hygiene

Load: `production-dependency-discipline.md`

```bash
# Ensure dev dependencies don't ship to production
composer install --no-dev --optimize-autoloader
zip -r plugin.zip .
```

### Step 4: Set Up WordPress.org Deployment

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to WordPress.org
on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: WordPress Plugin Deploy
        uses: 10up/action-wordpress-plugin-deploy@stable
        with:
          generate-zip: true
        env:
          SVN_USERNAME: ${{ secrets.SVN_USERNAME }}
          SVN_PASSWORD: ${{ secrets.SVN_PASSWORD }}
```

### Step 5: Verify Release Artifacts

```bash
bash wp-expert/scripts/wporg-release-verify.sh ./svn-checkout 1.0.0
```

Checks:
- `trunk/` has latest code
- `tags/1.0.0/` has the release
- `assets/` has banner/icon
- No development files in production ZIP

---

## Example 4: Refactoring to Remove Duplicate Code

**Scenario**: A plugin has 3 nearly identical API integrations. Time to consolidate.

### Step 1: Identify Duplication

Files:
- `src/integrations/stripe.php` (300 lines)
- `src/integrations/paypal.php` (310 lines)
- `src/integrations/square.php` (295 lines)

Duplication areas:
- Request/response handling
- Webhook verification
- Error logging
- Rate limiting

### Step 2: Load Reference

1. **Primary**: `duplicate-code-modularity-review.md`
   - What's safe to extract?
   - What differences will each integration need?
   - Will abstraction hide important domain logic?

2. **Supporting**: `plugin-architecture.md`
   - Service layer for integrations
   - Dependency injection patterns

### Step 3: Design Abstraction

Create base class:

```php
namespace Plugin\Integrations;

abstract class BasePaymentProvider {
  protected string $api_key;
  protected string $api_endpoint;
  
  abstract public function create_payment( $amount, $metadata );
  abstract public function verify_webhook( $payload, $signature );
  
  protected function make_request( $method, $path, $data = [] ) {
    // Shared request logic
  }
  
  protected function log_event( $type, $message, $context = [] ) {
    // Shared logging
  }
}
```

Then:

```php
class StripeIntegration extends BasePaymentProvider {
  public function create_payment( $amount, $metadata ) {
    // Stripe-specific logic only
  }
}
```

### Step 4: Validate Quality Improvements

The refactor succeeds if:
- ✅ Tests improve (easier to mock, test each provider independently)
- ✅ Reliability improves (shared logic tested once, not 3 times)
- ✅ Maintainability improves (add new provider: just extend base class)
- ✅ Change is narrow (only extraction, no behavior changes)

### Step 5: Test Thoroughly

```bash
bash wp-expert/scripts/wp-validate.sh /path/to/plugin

# Run full test suite
vendor/bin/phpunit

# Verify each provider still works
wp eval 'do_action( "plugin_test_stripe_integration" );'
wp eval 'do_action( "plugin_test_paypal_integration" );'
wp eval 'do_action( "plugin_test_square_integration" );'
```

---

## Example 5: Debugging a Production Performance Issue

**Scenario**: A WordPress site is slow during peak traffic (10 queries/sec). Database is maxed out.

### Step 1: Map the Runtime

```bash
bash wp-expert/scripts/wp-context.sh /path/to/site
```

Discover:
- Active plugins
- Theme (custom/standard)
- Database tables
- Autoloaded options (dangerous if large)
- Scheduled cron hooks

### Step 2: Load Troubleshooting Reference

1. **Primary**: `troubleshooting-operations.md`
   - How to diagnose slow queries?
   - What logs to check?
   - What metrics matter?

2. **Supporting**: `observability-incident-response.md`
   - Set up monitoring (New Relic, Query Monitor)
   - Create runbook for future incidents

### Step 3: Identify Bottleneck

Run checks:

```bash
# Check for expensive autoloaded options
wp option list --autoload=on | sort -k2 -n | tail

# Check query count
wp query all | grep -c "SELECT"

# Look for repeated queries
wp debug-log tail | grep -c "SELECT.*users"
```

Common causes:
- **Large autoloaded options** → Move to transients
- **Unbounded queries** → Add LIMIT, pagination
- **Repeated queries** → Add object caching
- **Slow JOIN** → Check indexes

### Step 4: Plan the Fix

Example fix: Site checks user capabilities in every request

```php
// BEFORE: Called 1000s of times, no caching
function get_user_role_data( $user_id ) {
  $user = get_user_by( 'id', $user_id ); // Query every time
  return $user->roles;
}

// AFTER: Cache for 5 minutes
function get_user_role_data( $user_id ) {
  $cache_key = "user_roles_{$user_id}";
  $roles = wp_cache_get( $cache_key );
  
  if ( false === $roles ) {
    $user = get_user_by( 'id', $user_id );
    $roles = $user->roles;
    wp_cache_set( $cache_key, $roles, '', 5 * MINUTE_IN_SECONDS );
  }
  
  return $roles;
}
```

### Step 5: Deploy & Monitor

```bash
# Deploy the fix
git push origin fix/performance

# Monitor query count
while true; do
  wp eval 'echo get_num_queries();'
  sleep 10
done

# Create runbook for next incident
cp RUNBOOK_TEMPLATE.md RUNBOOKS/2026-05-25-slow-query-incident.md
```

---

## When to Use Each Skill

### Use wp-expert When:
- ✅ Building WordPress plugins, themes, or custom code
- ✅ Reviewing code for security, performance, or quality
- ✅ Planning architecture for scale (multisite, migrations, caching)
- ✅ Setting up deployments, CI/CD, or releases
- ✅ Debugging production issues

### Use wp-contributor When:
- ✅ Contributing to WordPress Core
- ✅ Submitting patches to wordpress-develop
- ✅ Working on Gutenberg or block editor
- ✅ Contributing to WordPress.org or Meta projects
- ✅ Handling triage, tests, or documentation for upstream projects

---

## More Help

- **Common tasks**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **System setup**: See [SYSTEM_REQUIREMENTS.md](SYSTEM_REQUIREMENTS.md)
- **Adding your own examples**: See [CONTRIBUTING.md](CONTRIBUTING.md)
