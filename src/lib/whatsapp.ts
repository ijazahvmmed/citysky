import { site } from "./site";

/**
 * Build a WhatsApp deep link with a pre-filled message.
 * Project name is woven into the message when provided.
 */
export function whatsappLink(
  opts: { project?: string; message?: string } = {},
) {
  const message =
    opts.message ??
    (opts.project
      ? `Hi Citysky, I'm interested in ${opts.project}. I'd like to know more.`
      : "Hi Citysky, I'd like to know more about your homes in Kochi.");
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function catalogRequestLink(project: string) {
  return whatsappLink({
    message: `Hi Citysky, could you send me the catalogue for ${project}?`,
  });
}
