const RESERVED_USERNAME_SOURCE = [
  "onlyfrangos",
  "admin",
  "administrator",
  "administrador",
  "moderator",
  "moderador",
  "mod",
  "staff",
  "suporte",
  "support",
  "help",
  "ajuda",
  "security",
  "seguranca",
  "safety",
  "trustandsafety",
  "trust_safety",
  "verified",
  "verificado",
  "official",
  "oficial",
  "officialaccount",
  "contaoficial",
  "system",
  "sistema",
  "root",
  "owner",
  "proprietario",
  "founder",
  "fundador",
  "ceo",
  "team",
  "equipe",
  "developer",
  "desenvolvedor",
  "developers",
  "supportbot",
  "securitybot",
  "suporte_oficial",
  "official_support",
  "customer_support",
  "atendimento",
  "atendimentooficial",
  "faleconosco",
  "contato",
  "contact",
  "api",
  "bot",
  "bots",
  "robot",
  "automated",
  "automation",
  "notification",
  "notifications",
  "notificacao",
  "notificacoes",
  "no_reply",
  "noreply",
  "mail",
  "email",
  "privacy",
  "privacidade",
  "legal",
  "juridico",
  "terms",
  "termos",
  "copyright",
  "copyrights",
  "abuse",
  "report",
  "reports",
  "denuncia",
  "denuncias",
  "moderation",
  "moderacao",
  "community",
  "comunidade",
  "trust",
  "login",
  "signin",
  "signup",
  "register",
  "registro",
  "account",
  "conta",
  "accounts",
  "user",
  "usuario",
  "users",
  "usuarios",
  "news",
  "noticias",
  "press",
  "imprensa",
  "blog",
  "media",
  "midia",
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "twitter",
  "x",
  "whatsapp",
  "telegram",
  "discord",
  "reddit",
  "linkedin",
  "snapchat"
] as const;

export const USERNAME_UNAVAILABLE_MESSAGE = "Este nome de usuário não está disponível.";

export function normalizeUsernameForPolicy(username: string) {
  return username
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[\s._-]+/g, "");
}

const reservedUsernames = new Set(RESERVED_USERNAME_SOURCE.map(normalizeUsernameForPolicy));

export function isReservedUsername(username: string) {
  const normalized = normalizeUsernameForPolicy(username);
  if (!normalized) return false;
  if (reservedUsernames.has(normalized)) return true;

  const withoutNumericSuffix = normalized.replace(/\d+$/, "");
  if (withoutNumericSuffix !== normalized && reservedUsernames.has(withoutNumericSuffix))
    return true;

  const tokens = username
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .split(/[\s._-]+/)
    .filter(Boolean);
  return tokens.length > 1 && tokens.every((token) => reservedUsernames.has(token));
}
