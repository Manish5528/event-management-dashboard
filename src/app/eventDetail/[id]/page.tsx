"use client";

import { useEventContext } from "@/context/EventContext";
import { Event } from "@/types/event";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ViewPage = () => {
  const { events } = useEventContext();

   const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  useEffect(() => {
    const viewEvent = events.filter((e) => e.id === id);
    setEvent(viewEvent[0]);
  }, [id]);
  return (
    <>
      <div>
        <p>{event?.title}</p>
        <p>{event?.category}</p>
        <p>{event?.description}</p>
        <p>{event?.startDateTime}</p>
        <p>{event?.eventType}</p>
      </div>
    </>
  );
};

export default ViewPage;
