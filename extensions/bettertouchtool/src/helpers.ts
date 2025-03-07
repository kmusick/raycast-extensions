import { getPreferenceValues } from "@raycast/api";
import { BTT_NOT_RUNNING_ERROR } from "./constants";

/**
 * Generates a BTT URL scheme for triggering a named trigger
 * @param name The name of the trigger to run
 * @returns The URL string to trigger the named action
 */
export function getUrlForNamedTrigger(name: string): string {
  const { bttSharedSecret: secret } = getPreferenceValues();
  const params = [`trigger_name=${encodeURIComponent(name)}`];
  if (secret) {
    params.push(`shared_secret=${encodeURIComponent(secret)}`);
  }
  return `btt://trigger_named/?${params.join("&")}`;
}

/**
 * Generates an AppleScript command for triggering a named trigger in BTT
 * @param name The name of the trigger to run
 * @returns The AppleScript command string
 */
export function getAppleScriptForNamedTrigger(name: string): string {
  const { bttSharedSecret: secret } = getPreferenceValues();
  const secretParam = secret ? ` shared_secret ${JSON.stringify(secret)}` : "";

  return `tell application "BetterTouchTool"
  trigger_named_async_without_response ${JSON.stringify(name)}${secretParam}
end tell`;
}

/**
 * Generates an AppleScript command for revealing a trigger in the BTT UI
 * @param uuid The UUID of the trigger to reveal
 * @returns The AppleScript command string
 */
export function getRevealInUIAppleScript(uuid: string): string {
  const { bttSharedSecret: secret } = getPreferenceValues();
  const secretParam = secret ? ` shared_secret ${JSON.stringify(secret)}` : "";

  return `tell application "BetterTouchTool"
  reveal_element_in_ui ${JSON.stringify(uuid)}${secretParam}
end tell`;
}

/**
 * Checks if an error message indicates that BTT is not running
 * @param error The error message to check
 * @returns True if the error indicates BTT is not running
 */
export function isBTTNotRunningError(error: string): boolean {
  return error.includes(BTT_NOT_RUNNING_ERROR);
}
