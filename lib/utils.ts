import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const fetcher = (
  ...args: [string | URL | globalThis.Request, RequestInit?]
) => fetch(...args).then((res) => res.json());

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const DATE_FORMAT = "yyyy-MM-dd";
export const DATETIME_FORMAT = "yyyy-MM-dd HH:mm";
