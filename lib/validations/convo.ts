import * as z from "zod";

export const ConvoValidation = z.object({
  convo: z.string().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  convo: z.string().min(3, { message: "Minimum 3 characters." }),
});