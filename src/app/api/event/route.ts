import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import{Event} from "@/types/event"

const eventsFile = path.join(process.cwd(), "src", "data", "events.json");

const readEvents = (): Event[] => {
  if (!fs.existsSync(eventsFile)) {
    fs.writeFileSync(eventsFile, JSON.stringify([]));
  }
  let data = fs.readFileSync(eventsFile, "utf8");
  if (!data.trim()) data = "[]";
  return JSON.parse(data);
};

const saveEvents = (events: Event[]) => {
  fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2));
};

const hasConflict = (events: Event[], newStart: string, newEnd: string, ignoreId?: string) => {
  const start = new Date(newStart).getTime();
  const end = new Date(newEnd).getTime();

  return events.some((e) => {
    if (ignoreId && e.id === ignoreId) return false;
    const eStart = new Date(e.startDateTime).getTime();
    const eEnd = new Date(e.endDateTime).getTime();
    return start < eEnd && end > eStart;
  });
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const events = readEvents();

    if (hasConflict(events, body.startDateTime, body.endDateTime)) {
      return NextResponse.json(
        { error: "Time conflict with another event!" },
        { status: 400 }
      );
    }

    const newEvent: Event = {
      id: Date.now().toString(),
      ...body,
    };

    events.push(newEvent);
    saveEvents(events);

    return NextResponse.json(newEvent, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(readEvents());
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;

    const events = readEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (hasConflict(events, data.startDateTime, data.endDateTime, id)) {
      return NextResponse.json(
        { error: "Time conflict with another event!" },
        { status: 400 }
      );
    }

    events[index] = { ...events[index], ...data };
    saveEvents(events);

    return NextResponse.json(events[index]);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const events = readEvents();

    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    events.splice(index, 1);
    saveEvents(events);

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
