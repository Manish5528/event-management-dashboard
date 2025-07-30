"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { API_ROUTES } from "@/constants/apiRoutes";

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

type Filters = {
  search: string;
  eventType: string;
  category: string;
  startDate: string;
  endDate: string;
  sortBy: string;
};

type EventContextType = {
  events: Event[];
  filteredEvents: Event[];
  filters: Filters;
  setFilter: (key: keyof Filters, value: string) => void;
  fetchEvents: () => void;
};

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<Filters>({
  search: "",
  eventType: "",
  category: "",
  startDate: "",
  endDate: "",
  sortBy: "",
});

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setFilters({
    search: params.get("search") || "",
    eventType: params.get("eventType") || "",
    category: params.get("category") || "",
    startDate: params.get("startDate") || "",
    endDate: params.get("endDate") || "",
    sortBy: params.get("sortBy") || "",
  });
}, []);


  const setFilter = useCallback((key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    return params.toString();
  }, [filters]);

  const fetchEvents = useCallback(async () => {
    const res = await fetch(API_ROUTES.events);
    const data = await res.json();
    setEvents(data);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const query = buildQuery();
    router.replace(`/dashboard${query ? `?${query}` : ""}`);
  }, [filters, buildQuery, router]);

  const filteredEvents = useMemo(() => {
    return events
      .filter((e) => {
        const matchSearch =
          filters.search === "" ||
          e.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          e.description.toLowerCase().includes(filters.search.toLowerCase());

        const matchType =
          filters.eventType === "" || e.eventType === filters.eventType;

        const matchCategory =
          filters.category === "" || e.category === filters.category;

        const matchStart =
          filters.startDate === "" ||
          new Date(e.startDateTime) >= new Date(filters.startDate);

        const matchEnd =
          filters.endDate === "" ||
          new Date(e.endDateTime) <= new Date(filters.endDate);

        return matchSearch && matchType && matchCategory && matchStart && matchEnd;
      })
      .sort((a, b) => {
        if (filters.sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        if (filters.sortBy === "startDate") {
          return (
            new Date(a.startDateTime).getTime() -
            new Date(b.startDateTime).getTime()
          );
        }
        return 0;
      });
  }, [events, filters]);

  const contextValue = useMemo(
    () => ({
      events,
      filteredEvents,
      filters,
      setFilter,
      fetchEvents,
    }),
    [events, filteredEvents, filters, setFilter, fetchEvents]
  );

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext)!;
