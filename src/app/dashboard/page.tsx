"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {  useState, useCallback } from "react";
import styles from "@/styles/Dashboard.module.css";
import { useEventContext } from "@/context/EventContext";
import { APP_ROUTES } from "@/constants/appRoutes";
import CreateEventModal from "@/components/EventModal";
import toast from "react-hot-toast";
import { removeLoggedInUser } from "@/hooks/auth";
import EventTable from "@/components/EventTable";
import { Event } from "@/types/event";
import WithAuth from "@/components/hoc/WithAuth";

const DashboardPage = () => {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const { filteredEvents, fetchEvents, filters, setFilter } = useEventContext();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const formatDate = useCallback((date: string): string => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, []);

  console.log("Dashboard")

  const handleCreate = useCallback((): void => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((event: Event): void => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((): void => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  }, []);

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      if (!confirm("Are you sure you want to delete this event?")) return;

      try {
        const response = await fetch("/api/event", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          toast.success("Event deleted successfully");
          fetchEvents();
        } else {
          const result = await response.json();
          toast.error(result.error || "Failed to delete event");
        }
      } catch  {
        toast.error("Something went wrong");
      }
    },
    [fetchEvents]
  );

  const onLogout = useCallback((): void => {
    setUser(null);
    removeLoggedInUser();
    router.replace(APP_ROUTES.login);
  }, [router, setUser]);
  return (
    <>
      {user && (
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Event Dashboard</h1>
            <div>
              <span className={styles.user}>👤 {user.username}</span>
              <button onClick={onLogout} className={styles.logout}>
                Logout
              </button>
            </div>
          </header>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Search</label>
              <input
                type="text"
                placeholder="Search by title or description"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Event Type</label>
              <select
                value={filters.eventType}
                onChange={(e) => setFilter("eventType", e.target.value)}
              >
                <option value="">All Types</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilter("category", e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Conference">Conference</option>
                <option value="Meetup">Meetup</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilter("startDate", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilter("endDate", e.target.value)}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilter("sortBy", e.target.value)}
              >
                <option value="">Default</option>
                <option value="title">Title</option>
                <option value="startDate">Start Date</option>
              </select>
            </div>

            <button className={styles.createBtn} onClick={handleCreate}>
              ➕ Create Event
            </button>
          </div>

          <EventTable
            events={filteredEvents as Event[]}
            onEdit={handleEdit}
            onDelete={handleDelete}
            formatDate={formatDate}
          />
        </div>
      )}
      {isModalOpen && (
        <CreateEventModal
          onClose={handleCloseModal}
          onEventSaved={fetchEvents}
          eventToEdit={selectedEvent}
        />
      )}
    </>
  );
};

export default WithAuth(DashboardPage)
