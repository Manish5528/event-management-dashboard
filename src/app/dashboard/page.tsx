"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import styles from "@/styles/Dashboard.module.css";
import { useEventContext } from "@/context/EventContext";
import { APP_ROUTES } from "@/utils/route";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return <p>Loading...</p>;
  const { filteredEvents, filters, setFilter, fetchEvents } = useEventContext();

  const handleEdit = useCallback((id: string) => {
    // TODO: implement edit logic
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    // TODO: implement delete logic
  }, []);

  const formatDate = useCallback(
    (date: string) =>
      new Date(date).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    []
  );

  const eventTable = useMemo(() => {
    if (filteredEvents.length === 0) {
      return <p>No events found.</p>;
    }

    return (
      <table className={styles.eventTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Event Type</th>
            <th>Category</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Location / Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{event.description}</td>
              <td>{event.eventType}</td>
              <td>{event.category}</td>
              <td>{formatDate(event.startDateTime)}</td>
              <td>{formatDate(event.endDateTime)}</td>
              <td>
                {event.eventType === "Online" && event.eventLink ? (
                  <a
                    href={event.eventLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {event.eventLink}
                  </a>
                ) : (
                  event.location || "-"
                )}
              </td>
              <td className={styles.actionCell}>
                <div className={styles.actionButtons}>
                  <button
                    className={styles.iconBtn}
                    onClick={() => handleEdit(event.id)}
                    title="Edit Event"
                  >
                    ✏️
                  </button>
                  <button
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    onClick={() => handleDelete(event.id)}
                    title="Delete Event"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }, [filteredEvents, handleEdit, handleDelete, formatDate]);

  return (
    <>
      {user && (
        <div className={styles.container}>
          <header className={styles.header}>
            <h1>Event Dashboard</h1>
            <div>
              <span className={styles.user}>👤 {user.username}</span>
              <button onClick={logout} className={styles.logout}>
                Logout
              </button>
            </div>
          </header>

          {/* Filters */}
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

            <button
              className={styles.createBtn}
              onClick={() => setIsModalOpen(true)}
            >
              ➕ Create Event
            </button>
          </div>

          <div className={styles.eventTableWrapper}>{eventTable}</div>
        </div>
      )}
    </>
  );
}
