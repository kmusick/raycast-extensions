import { Tool } from "@raycast/api";
import { runNamedTriggerAppleScript, runNamedTriggerUrl } from "../api";
import { Result } from "../types";

type Input = {
  /**
   * The exact name of the Named Trigger to run.
   *
   * IMPORTANT: You MUST use the search-named-triggers tool first to find the correct name of the trigger.
   * The name MUST MATCH EXACTLY what is returned by search-named-triggers - this includes:
   * - Exact capitalization (uppercase/lowercase)
   * - Exact spacing
   * - Exact punctuation
   * - Exact special characters
   *
   * DO NOT modify the name in any way from what search-named-triggers returns, regardless of what the user inputs.
   *
   * For example, if search-named-triggers returns "My-Trigger_Name!", you MUST use "My-Trigger_Name!"
   * (NOT "my-trigger_name!", "My Trigger Name", "mytriggername", etc.)
   *
   * Note: Do not make assumptions about whether a trigger is enabled or disabled.
   * Simply run the trigger by name without commenting on its enabled status.
   */
  name: string;

  /**
   * Optional override for the run type. By default, the value is determined by
   * user preferences. URL may also be referred to as "HTTP" or "URL Scheme".
   * AppleScript may also be referred to as "JXA" or "JavaScript" or "Script".
   */
  runType?: "URL" | "AppleScript";
};

export const confirmation: Tool.Confirmation<Input> = async (input) => {
  return {
    message: `Are you sure you want to run the Named Trigger "${input.name}"${input.runType ? ` with run type "${input.runType}"` : ""}?`,
  };
};

export default async function tool(input: Input): Promise<Result<void>> {
  if (input.runType === "AppleScript") {
    return await runNamedTriggerAppleScript(input.name);
  } else {
    try {
      await runNamedTriggerUrl(input.name);
      return { status: "success" };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return { status: "error", error: errorMessage };
    }
  }
}
