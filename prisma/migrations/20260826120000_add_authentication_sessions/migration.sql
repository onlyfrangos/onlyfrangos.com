CREATE TYPE "SessionClient" AS ENUM ('WEB', 'MOBILE');

CREATE TABLE "AuthenticationSession" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "clientType" "SessionClient" NOT NULL,
    "deviceId" VARCHAR(128),
    "deviceName" VARCHAR(100),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthenticationSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PolicyAcceptance" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "termsVersion" VARCHAR(32) NOT NULL,
    "privacyPolicyVersion" VARCHAR(32) NOT NULL,
    "communityGuidelinesVersion" VARCHAR(32) NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PolicyAcceptance_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AuthenticationSession_tokenHash_key"
ON "AuthenticationSession"("tokenHash");
CREATE INDEX "AuthenticationSession_userId_revokedAt_idx"
ON "AuthenticationSession"("userId", "revokedAt");
CREATE INDEX "AuthenticationSession_expiresAt_idx"
ON "AuthenticationSession"("expiresAt");

CREATE UNIQUE INDEX "PolicyAcceptance_userId_termsVersion_privacyPolicyVersion_c_key"
ON "PolicyAcceptance"(
    "userId",
    "termsVersion",
    "privacyPolicyVersion",
    "communityGuidelinesVersion"
);
CREATE INDEX "PolicyAcceptance_userId_acceptedAt_idx"
ON "PolicyAcceptance"("userId", "acceptedAt" DESC);

ALTER TABLE "AuthenticationSession"
ADD CONSTRAINT "AuthenticationSession_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PolicyAcceptance"
ADD CONSTRAINT "PolicyAcceptance_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
