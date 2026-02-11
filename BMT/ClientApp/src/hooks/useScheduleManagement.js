import { useState, useCallback, useMemo } from 'react';
import dayjs from 'dayjs';

/**
 * Custom hook for managing schedule CRUD operations
 */
export const useScheduleManagement = (initialSchedules = []) => {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [editingScheduleId, setEditingScheduleId] = useState(null);

  // Format schedules for grid display
  const scheduleRows = useMemo(() => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return schedules.map((item, index) => {
      let parsedDays = [];

      if (Array.isArray(item.days)) {
        parsedDays = item.days;
      } else if (typeof item.days === 'string') {
        try {
          const parsed = JSON.parse(item.days);
          parsedDays = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Failed to parse days:', item.days);
        }
      }

      return {
        id: item.id || item?.gridId,
        originalId: item.id, // Keep original ID for editing
        interval: item?.Intervalval ?? '',
        budget: item.Budget ?? '',
        NetworkId: item.NetworkId ?? '',
        days: parsedDays.length > 0 ? parsedDays.map((d) => dayNames[d - 1]).join(', ') : '',
        startTime: dayjs(item.StartTime).isValid()
          ? dayjs(item.StartTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        finishTime: dayjs(item.FinishTime).isValid()
          ? dayjs(item.FinishTime).format('YYYY-MM-DD HH:mm:ss')
          : '',
        rawData: item, // Store full schedule data for editing
      };
    });
  }, [schedules]);

  const addSchedule = useCallback((newSchedule) => {
    setSchedules((prev) => [...prev, newSchedule]);
  }, []);

  const updateSchedule = useCallback((scheduleId, updatedSchedule) => {
    setSchedules((prev) =>
      prev.map((s) => {
        // Match by id or by NetworkId + Budget combination if id is missing

        if (s.gridId === scheduleId) {
          return { ...s, ...updatedSchedule };
        }
        return s;
      }),
    );
    setEditingScheduleId(null);
  }, []);

  const deleteSchedule = useCallback(
    (scheduleId) => {
      setSchedules((prev) => {
        // Find the schedule to delete
        const scheduleToDelete = scheduleRows.find((row) => row.id === scheduleId);
        if (!scheduleToDelete) return prev;

        // If schedule has an id, filter by id
        if (scheduleToDelete.originalId) {
          return prev.filter((s) => s.id !== scheduleToDelete.originalId);
        }
        // Otherwise filter by NetworkId + Budget combination
        return prev.filter((s) => s.gridId !== scheduleToDelete.id);
      });
    },
    [scheduleRows],
  );

  const getScheduleById = useCallback(
    (scheduleId) => {
      return schedules.find((s) => s.id === scheduleId) || null;
    },
    [schedules],
  );

  const startEditing = useCallback((scheduleId) => {
    setEditingScheduleId(scheduleId);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingScheduleId(null);
  }, []);

  const isEditing = useCallback(
    (scheduleId) => {
      return editingScheduleId === scheduleId;
    },
    [editingScheduleId],
  );

  return {
    schedules,
    scheduleRows,
    editingScheduleId,
    setSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    startEditing,
    cancelEditing,
    isEditing,
  };
};
