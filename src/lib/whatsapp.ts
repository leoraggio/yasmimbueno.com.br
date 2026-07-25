/**
 * The one WhatsApp target on the site.
 *
 * The mock puts a WhatsApp CTA in the nav, the hero, the Serviços band and the
 * footer as well as the floating button; every one of them links here and
 * nowhere else. A visitor who has decided to write must never wonder whether
 * they picked the wrong button, and the greeting is drafted for them because
 * composing an opening line is the hardest part of asking for help.
 *
 * So there is one URL, not a helper each call site passes its own arguments
 * to: nothing a call site can get wrong. Changing the number is an edit here
 * and nowhere else.
 */

/** Yasmim's WhatsApp number. Punctuation is welcome; `wa.me` gets digits. */
const WHATSAPP_NUMBER = "+55 11 94304-6621";

/** Fixed, from the mock. Do not paraphrase — the wording is hers. */
const GREETING = "Olá, Yasmim! Gostaria de agendar uma sessão.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(
  /\D/g,
  "",
)}?text=${encodeURIComponent(GREETING)}`;
