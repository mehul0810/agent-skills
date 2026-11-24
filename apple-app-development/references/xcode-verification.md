# Xcode verification

**Discover once.** Inspect the repository's documented entry point, build phases, schemes/test actions, package manifests, plugins and dependencies before running project code. Prefer the existing workspace over opening a nested project that omits its dependencies. Read the target's deployment settings and check *runnable destinations*, not just installed SDKs. If the active directory is Command Line Tools but full Xcode is installed, use a verified `DEVELOPER_DIR` for this command/session, not a machine-wide switch. No installer, external MCP service, trust override or developer account is required just to inspect the setup. [Apple's command-line tools](https://developer.apple.com/documentation/xcode/xcode-command-line-tool-reference)

```sh
xcode-select -p
xcodebuild -version
xcodebuild -list -workspace "$workspace"
xcodebuild -workspace "$workspace" -scheme "$scheme" -showdestinations
```

Use `-project "$project"` instead for a standalone project. For a pure Swift package, `swift test` exercises package logic on its host; it does not establish that the app builds or runs on an iPhone.

Name **one destination per behavior you intend to compare**, even in a plan. For an adaptive iPad/Mac editor: an available iPad Simulator (or test iPad) in narrow and wide windows, and the native macOS "My Mac" destination with a keyboard. If discovery hasn't run, label both as proposed and leave model/OS unverified. After running, replace those descriptions with the observed device/runtime and macOS version. "Both targets" hides which input and windowing behavior the test would exercise.

**Choose a test that can fail for the reported problem.** Keep existing XCTest coverage. On supporting toolchains, use Swift Testing for new logic tests; use XCTest/XCUIAutomation for UI interaction and XCTest metrics or Instruments for performance. For a persistence change, launch, save, terminate and reopen on the same disposable store; include a failed or cancelled write. For UI, operate the real control and observe the resulting state. A seed, a preview, a screenshot, or an assertion that an element exists alone can't prove the interaction. [Apple's testing guidance](https://developer.apple.com/documentation/xcode/adding-tests-to-your-xcode-project)

**Read failures without replaying the build.** Use new log and result paths inside a private task directory, a concrete destination from discovery and the repo's test plan where applicable. Preserve the actual exit status even when filtering logs. In macOS zsh, `status` is read-only: capture into `build_status`, not `status`. If adapting the wrapper, first try a cheap failing producer with a successful reader, not a full simulator run. For example, with shell variables bound to verified inputs:

```sh
(
  umask 077
  build_status=0; summary_status=0
  xcodebuild test -workspace "$workspace" -scheme "$scheme" \
    -destination "$destination" -resultBundlePath "$result" >"$log" 2>&1 || build_status=$?
  xcrun xcresulttool get test-results summary --path "$result" || summary_status=$?
  [ "$build_status" -eq 0 ] || exit "$build_status"
  exit "$summary_status"
)
```

The reader's success only means it could read the bundle. Check the producing command, test counts, skips, failures, configuration and destination; zero tests, an unexpected skip, or a stale bundle isn't a pass. Keep the original log beside **this run's** bundle. If a summary parses but omits the failing action, or the bundle is incomplete, missing or unreadable, use the matching original log for the affected diagnostic before considering a rerun. Never substitute an older green bundle. Keep logs and attachments private: they can contain app data.

**State the boundary.** A compiled SDK target isn't a running simulator. A simulator run isn't on-device performance, camera/sensor fidelity, battery, or spatial comfort. Name the host for a native Mac run. If no matching runtime or physical device is available, continue with the supported build/logic tests, mark the missing observation, and give the exact next check. Don't install runtimes, reset shared simulators, change signing, or use a personal device just to turn a gap green. [Device Hub](https://developer.apple.com/documentation/xcode/device-hub) and [Apple's GPU simulator limits](https://developer.apple.com/documentation/metal/developing-metal-apps-that-run-in-simulator)
