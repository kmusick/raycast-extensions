import { Action, ActionPanel, Detail, Icon, Keyboard, LaunchProps, openExtensionPreferences } from "@raycast/api";
import { usePromise, showFailureToast } from "@raycast/utils";
import { useEffect } from "react";
import { getVariable } from "./api";

export default function Command(props: LaunchProps<{ arguments: Arguments.GetVariable }>) {
  const { variableName } = props.arguments;

  const { data, isLoading, error, revalidate } = usePromise(
    async (variableName: string) => {
      return await getVariable(variableName);
    },
    [variableName],
  );

  useEffect(() => {
    if (error) {
      void showFailureToast(error, {
        title: "Unable to Load Variable",
        primaryAction: {
          title: "View Preferences",
          onAction: () => openExtensionPreferences(),
        },
      });
    }
  }, [error]);

  function formatVariableValue(): string {
    const result = data;
    if (!result) return "";

    if (result.status === "error") {
      return `\`Error: ${result.error}\``;
    }

    if (result.data.type === "null") {
      return "`Variable does not exist or has null value`";
    }

    const typeLabel = result.data.type === "string" ? "String" : "Number";
    return `**Type:** ${typeLabel}\n\n**Value:** \`${result.data.value}\``;
  }

  const markdown = error
    ? `# ${variableName}\n\n\`There was an error retrieving the variable: ${error.message}\``
    : `# ${variableName}\n\n${isLoading ? "" : formatVariableValue()}`;

  return (
    <Detail
      markdown={markdown}
      isLoading={isLoading}
      actions={
        <ActionPanel>
          {data?.status === "success" && data.data.type !== "null" && (
            <Action.CopyToClipboard
              title="Copy Value"
              content={String(data.data.value)}
              shortcut={Keyboard.Shortcut.Common.Copy}
            />
          )}
          <Action
            title="Refresh"
            onAction={revalidate}
            shortcut={Keyboard.Shortcut.Common.Refresh}
            icon={Icon.RotateClockwise}
          />
        </ActionPanel>
      }
    />
  );
}
