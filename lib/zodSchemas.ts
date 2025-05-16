import { z } from "zod";

export const recordSchema = z.object({
  meal: z.string().min(1, "食事名は必須です").max(100, "食事名は100文字以内にしてください"),
  calories: z
    .number({ invalid_type_error: "カロリーは数値で入力してください" })
    .min(0, "カロリーは0以上で入力してください")
    .max(5000, "カロリーは5000以下で入力してください"),
  datetime: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "日時は YYYY-MM-DDThh:mm 形式で入力してください（例：2025-05-16T12:00）"
    )
    .refine((val) => !isNaN(Date.parse(val)), "有効な日時を入力してください"),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "運動名は必須です").max(100, "運動名は100文字以内にしてください"),
  calories: z
    .number({ invalid_type_error: "カロリーは数値で入力してください" })
    .min(0, "カロリーは0以上で入力してください")
    .max(5000, "カロリーは5000以下で入力してください"),
  datetime: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "日時は YYYY-MM-DDThh:mm 形式で入力してください（例：2025-05-16T12:00）"
    )
    .refine((val) => !isNaN(Date.parse(val)), "有効な日時を入力してください"),
});