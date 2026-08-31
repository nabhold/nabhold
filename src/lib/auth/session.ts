export type GroupRole =
  | "group-executive"
  | "board-member"
  | "investment-analyst"
  | "subsidiary-executive"
  | "administrator";

export type Session = {
  subject: string;
  displayName: string;
  roles: GroupRole[];
};

export async function getSession(): Promise<Session | null> {
  if (process.env.NABHOLD_DASHBOARD_PREVIEW !== "true") {
    return null;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NABHOLD_DASHBOARD_PREVIEW must never be enabled in production.",
    );
  }

  return {
    subject: "preview",
    displayName: "Executive preview",
    roles: ["group-executive"],
  };
}
