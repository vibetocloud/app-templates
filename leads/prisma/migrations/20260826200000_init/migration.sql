CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "handledAt" TIMESTAMP(3),
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Lead_handledAt_createdAt_idx" ON "Lead"("handledAt", "createdAt");

-- Demo data, so the inbox is not empty the first time it is opened.
-- Removable from the interface.
INSERT INTO "Lead" ("id", "name", "email", "company", "message", "createdAt", "handledAt", "isDemo") VALUES
    ('eeeeeeee-1111-1111-1111-111111111111', 'Hannah Weiss', 'hannah@meadowcafe.example', 'Meadow Cafe',
     'Do you take bookings for groups of 20 on a weekday evening? We are planning a leaving do in October.',
     now() - interval '25 minutes', NULL, true),
    ('eeeeeeee-2222-2222-2222-222222222222', 'Daniel Okafor', 'd.okafor@example.com', NULL,
     'Could you send me a quote for rewiring a two bedroom flat? No rush.',
     now() - interval '3 hours', NULL, true),
    ('eeeeeeee-3333-3333-3333-333333333333', 'Sofia Marchetti', 'sofia@brightpath.example', 'Brightpath',
     'We spoke at the trade fair last week — sending the details you asked for. Happy to jump on a call.',
     now() - interval '1 day', now() - interval '20 hours', true),
    ('eeeeeeee-4444-4444-4444-444444444444', 'Marcus Feld', 'marcus.feld@example.com', 'Feld & Sons',
     'We need someone to look at a leaking flat roof on our workshop. Is that something you cover?',
     now() - interval '6 hours', NULL, true),
    ('eeeeeeee-5555-5555-5555-555555555555', 'Lena Vos', 'lena@studiovos.example', 'Studio Vos',
     'Following up on my message from last month about the summer project. Are you taking on new work in September? Happy to send over the brief and the timings we had in mind, and we can go from there.',
     now() - interval '2 days', now() - interval '2 days' + interval '4 hours', true),
    ('eeeeeeee-6666-6666-6666-666666666666', 'Priya Nair', 'priya.nair@example.com', NULL,
     'Are you open on Saturdays? I would rather come at the weekend if that works.',
     now() - interval '90 minutes', NULL, true);
