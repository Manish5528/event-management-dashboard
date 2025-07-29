import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const eventsFile = path.join(process.cwd(), "src", "data", "events.json");

type Event = {
  id: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  location?: string;
  eventLink?: string;
  startDateTime: string;
  endDateTime: string;
  category: string;
  organizer: string;
};

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


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      eventType,
      location,
      eventLink,
      startDateTime,
      endDateTime,
      category,
      organizer,
    } = body;

    const events = readEvents();

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      eventType,
      location,
      eventLink,
      startDateTime,
      endDateTime,
      category,
      organizer,
    };

    events.push(newEvent);
    saveEvents(events);

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const events = readEvents(); 
  return NextResponse.json(events);
}

