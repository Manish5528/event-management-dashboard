import React from "react";
import styles from "@/styles/Dashboard.module.css";
import {Event} from "@/types/event"

export interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  formatDate: (date: string) => string;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  onEdit,
  onDelete,
  formatDate,
}) => {
  if (!events.length) return <p>No events found.</p>;

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
        {events.map((event) => (
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
                  onClick={() => onEdit(event)}
                  title="Edit Event"
                >
                  ✏️
                </button>
                <button
                  className={`${styles.iconBtn} ${styles.deleteBtn}`}
                  onClick={() => onDelete(event.id)}
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
};

export default EventTable;
