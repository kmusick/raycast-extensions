import { BTT_NOT_RUNNING_ERROR } from "../constants";

/**
 * Creates a standardized error message format for JXA script errors
 * Also includes the return statement for direct use in JXA scripts
 * @param errorMessage The error message to format
 * @param errorVariableName Optional variable name containing the error to append
 * @returns Complete return statement with formatted error string
 */
export function returnErrorText(errorMessage: string, errorVariableName?: string): string {
  const baseMessage = `return "error: ${errorMessage}`;
  if (errorVariableName) {
    return `${baseMessage}. Error: " + ${errorVariableName}`;
  }
  return `${baseMessage}"`;
}

/**
 * Checks if a response from a JXA script is an error
 * @param response The response string from a JXA script
 * @returns True if the response is an error
 */
export function isErrorResponse(response: string): boolean {
  return response.startsWith("error: ");
}

/**
 * Checks if the error is specifically about BTT not running
 * @param error The error message to check
 * @returns True if the error indicates BTT is not running
 */
export function isBTTNotRunningError(error: string): boolean {
  return error.includes(BTT_NOT_RUNNING_ERROR);
}
