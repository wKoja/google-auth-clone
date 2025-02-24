import type { RequestEvent } from "./$types";

export const load = async ({ params }: RequestEvent) => {
  const groupId: string = params.groupId;
  return {
    groupId: groupId 
  };
};
