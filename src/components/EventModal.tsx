"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useEventContext } from "@/context/EventContext";
import styles from "@/styles/Dashboard.module.css";
import { useEffect } from "react";
import {Event} from "@/types/event"
import { API_ROUTES } from "@/constants/apiRoutes";

const schema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().required("Description is required"),
  eventType: yup.string().oneOf(["Online", "In-Person"]).required("Event type is required"),
  location: yup.string().when("eventType", {
    is: "In-Person",
    then: (s) => s.required("Location is required"),
  }),
  eventLink: yup.string().when("eventType", {
    is: "Online",
    then: (s) => s.required("Event link is required"),
  }),
  startDateTime: yup
    .string()
    .required("Start date is required"),
  endDateTime: yup
    .string()
    .required("End date is required")
    .test(
      "is-greater",
      "End date must be after start date",
      function (value) {
        const { startDateTime } = this.parent;
        return !startDateTime || !value || new Date(value) > new Date(startDateTime);
      }
    ),
  category: yup.string().required("Category is required"),
});

type EventFormInputs = yup.InferType<typeof schema>;

interface CreateEventModalProps {
  onClose: () => void;
  onEventSaved: () => void;
  eventToEdit?: Event | null;
}

const EventModal: React.FC<CreateEventModalProps> = ({
  onClose,
  onEventSaved,
  eventToEdit,
}) => {
  const { user } = useAuth();
  const { events,setFilter } = useEventContext();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(eventToEdit);

  const eventType = watch("eventType");

  useEffect(() => {
    if (eventToEdit) {
      reset({
        title: eventToEdit.title,
        description: eventToEdit.description,
        eventType: eventToEdit.eventType,
        location: eventToEdit.location || "",
        eventLink: eventToEdit.eventLink || "",
        startDateTime: eventToEdit.startDateTime.slice(0, 16),
        endDateTime: eventToEdit.endDateTime.slice(0, 16),
        category: eventToEdit.category,
      });
    }
  }, [eventToEdit, reset]);

  const hasTimeConflict = (newEvent: EventFormInputs) => {
    const newStart = new Date(newEvent.startDateTime).getTime();
    const newEnd = new Date(newEvent.endDateTime).getTime();

    return events.some((e) => {
      if (eventToEdit && e.id === eventToEdit.id) return false;
      const eStart = new Date(e.startDateTime).getTime();
      const eEnd = new Date(e.endDateTime).getTime();
      return newStart < eEnd && newEnd > eStart;
    });
  };

  const onSubmit: SubmitHandler<EventFormInputs> = async (data) => {
    if (hasTimeConflict(data)) {
      toast.error("Time conflict! Event overlaps with another event.");
      return;
    }

    const body = eventToEdit
      ? { id: eventToEdit.id, ...data }
      : { ...data, organizer: user?.username };

    const method = eventToEdit ? "PUT" : "POST";
    const url = API_ROUTES.events;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(result.error || "Failed to save event");
    } else {
      setFilter('search',"")
      setFilter('category',"")
      setFilter('startDate',"")
      setFilter('endDate',"")
      setFilter('eventType',"")
   
      toast.success(eventToEdit ? "Event updated!" : "Event created!");
      onEventSaved();
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>{eventToEdit ? "Edit Event" : "Create Event"}</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <label>Title <span className={styles.required}>*</span></label>
          <input {...register("title")} className={styles.input} />
          {errors.title && (
            <p className={styles.error}>{errors.title.message}</p>
          )}

          <label>Description <span className={styles.required}>*</span></label>
          <textarea {...register("description")} className={styles.textarea} />
          {errors.description && (
            <p className={styles.error}>{errors.description.message}</p>
          )}

          <label>Event Type <span className={styles.required}>*</span></label>
          <select {...register("eventType")} className={styles.select}>
            <option value="">Select Type</option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
          </select>

          {eventType === "In-Person" && (
            <>
              <label>Location <span className={styles.required}>*</span></label>
              <input {...register("location")} className={styles.input} />
              {errors.location && (
                <p className={styles.error}>{errors.location.message}</p>
              )}
            </>
          )}

          {eventType === "Online" && (
            <>
              <label>Event Link <span className={styles.required}>*</span></label>
              <input {...register("eventLink")} className={styles.input} />
              {errors.eventLink && (
                <p className={styles.error}>{errors.eventLink.message}</p>
              )}
            </>
          )}

          <label>Start Date & Time <span className={styles.required}>*</span></label>
          <input
            type="datetime-local"
            {...register("startDateTime")}
            className={styles.input}
          />

          <label>End Date & Time <span className={styles.required}>*</span></label>
          <input
            type="datetime-local"
            {...register("endDateTime")}
            className={styles.input}
          />
          {errors.endDateTime && (
                <p className={styles.error}>{errors.endDateTime.message}</p>
              )}

          <label>Category <span className={styles.required}>*</span></label>
          <select {...register("category")} className={styles.select}>
            <option value="">Select Category</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Conference">Conference</option>
            <option value="Meetup">Meetup</option>
          </select>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              {eventToEdit ? "Update" : "Create"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal
