
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Room_name_key" ON "Room"("name");

CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bookedBy" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "isDemo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "Booking_roomId_startsAt_idx" ON "Booking"("roomId", "startsAt");
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_roomId_fkey"
    FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Demo data, so the app looks alive on first open. Removable from the UI.
INSERT INTO "Room" ("id", "name", "capacity") VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ground floor meeting room', 8),
    ('22222222-2222-2222-2222-222222222222', 'Quiet room', 2),
    ('33333333-3333-3333-3333-333333333333', 'Workshop space', 20);

INSERT INTO "Booking" ("id", "roomId", "title", "bookedBy", "startsAt", "endsAt", "isDemo") VALUES
    ('aaaaaaaa-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
     'Monday stand-up', 'Sam', date_trunc('hour', now() + interval '2 hours'), date_trunc('hour', now() + interval '3 hours'), true),
    ('aaaaaaaa-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222',
     'Interview', 'Robin', date_trunc('hour', now() + interval '1 day'), date_trunc('hour', now() + interval '1 day 1 hour'), true),
    ('aaaaaaaa-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333',
     'Client workshop', 'Alex', date_trunc('hour', now() + interval '2 days'), date_trunc('hour', now() + interval '2 days 4 hours'), true);
