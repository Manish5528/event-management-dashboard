export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: "Online" | "In-Person";
  category: string;
  startDateTime: string;
  endDateTime: string;
  eventLink?: string;
  location?: string;
}
