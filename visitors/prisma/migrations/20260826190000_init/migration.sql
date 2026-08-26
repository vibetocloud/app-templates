CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "host" TEXT NOT NULL,
    "signedInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signedOutAt" TIMESTAMP(3),
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Visit_signedOutAt_signedInAt_idx" ON "Visit"("signedOutAt", "signedInAt");

-- Demo data, so the screen has something on it the first time it is opened.
-- Removable from the interface.
INSERT INTO "Visit" ("id", "name", "company", "host", "signedInAt", "signedOutAt", "isDemo") VALUES
    ('dddddddd-1111-1111-1111-111111111111', 'Priya Raman', 'Northwind Design', 'Sam',
     now() - interval '40 minutes', NULL, true),
    ('dddddddd-2222-2222-2222-222222222222', 'Tom Buckley', 'Buckley Electrical', 'Facilities',
     now() - interval '2 hours', NULL, true),
    ('dddddddd-3333-3333-3333-333333333333', 'Ana Sousa', NULL, 'Robin',
     now() - interval '5 hours', now() - interval '4 hours 10 minutes', true);
