import { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Simple mock store and sync across tabs via localStorage
export const AppProvider = ({ children }) => {
    const [data, setData] = useState(() => {
        const saved = localStorage.getItem('debug_arena_state');
        return saved ? JSON.parse(saved) : { events: {}, students: {} };
    });

    // Sync state across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'debug_arena_state') {
                setData(JSON.parse(e.newValue || '{"events":{},"students":{}}'));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const updateState = (updater) => {
        setData((prev) => {
            // Always fetch the freshest state from localStorage to protect against concurrent tab overrides
            const raw = localStorage.getItem('debug_arena_state');
            const latestState = raw ? JSON.parse(raw) : prev;

            const next = updater(latestState);
            localStorage.setItem('debug_arena_state', JSON.stringify(next));
            return next;
        });
    };

    const createEvent = (hostName) => {
        const eventCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        updateState((latestState) => ({
            ...latestState,
            events: {
                ...latestState.events,
                [eventCode]: {
                    hostName,
                    status: 'waiting',
                    students: [],
                    createdAt: Date.now(),
                },
            },
        }));
        return eventCode;
    };

    const joinEvent = (eventCode, studentInfo) => {
        let success = false;
        let existingId = null;

        updateState((latestState) => {
            const event = latestState.events[eventCode];
            if (!event || event.status !== 'waiting') return latestState;

            // Check for duplicates by email
            const isDuplicate = event.students.find(s => s.email.toLowerCase() === studentInfo.email.toLowerCase());
            if (isDuplicate) {
                existingId = 'DUPLICATE';
                return latestState;
            }

            const studentId = crypto.randomUUID();
            const newStudent = {
                ...studentInfo,
                id: studentId,
                score: 0,
                status: 'active',
                timeTaken: 0,
                joinedAt: Date.now(),
                questionsCompleted: 0,
                warnings: 0
            };

            success = studentId;

            return {
                ...latestState,
                events: {
                    ...latestState.events,
                    [eventCode]: {
                        ...event,
                        students: [...event.students, newStudent],
                    },
                },
                students: {
                    ...latestState.students,
                    [studentId]: {
                        ...newStudent,
                        eventCode
                    }
                }
            };
        });

        if (existingId === 'DUPLICATE') return 'DUPLICATE';
        return success;
    };

    const startEvent = (eventCode) => {
        updateState((latestState) => ({
            ...latestState,
            events: {
                ...latestState.events,
                [eventCode]: {
                    ...latestState.events[eventCode],
                    status: 'started',
                    startTime: Date.now(),
                },
            },
        }));
    };

    const updateStudentScore = (studentId, scoreIncrement, timeTaken = 0, status = 'active', incrementCompleted = false) => {
        updateState((latestState) => {
            const student = latestState.students[studentId];
            if (!student) return latestState;

            const eventCode = student.eventCode;
            const event = latestState.events[eventCode];

            const updatedStudent = {
                ...student,
                score: student.score + scoreIncrement,
                timeTaken: timeTaken > 0 ? timeTaken : student.timeTaken,
                status: status,
                questionsCompleted: incrementCompleted ? (student.questionsCompleted || 0) + 1 : (student.questionsCompleted || 0)
            };

            const updatedStudentsList = event.students.map(s => s.id === studentId ? updatedStudent : s);

            return {
                ...latestState,
                events: {
                    ...latestState.events,
                    [eventCode]: {
                        ...event,
                        students: updatedStudentsList,
                    }
                },
                students: {
                    ...latestState.students,
                    [studentId]: updatedStudent
                }
            };
        });
    };

    const disqualifyStudent = (studentId) => {
        updateStudentScore(studentId, 0, 0, 'disqualified', false);
    };

    const warnStudent = (studentId) => {
        updateState((latestState) => {
            const student = latestState.students[studentId];
            if (!student) return latestState;

            const eventCode = student.eventCode;
            const event = latestState.events[eventCode];

            const currentWarnings = student.warnings || 0;
            const updatedStudent = { ...student, warnings: currentWarnings + 1 };

            // Auto disqualify if warnings >= 2
            if (updatedStudent.warnings >= 2) {
                updatedStudent.status = 'disqualified';
            }

            const updatedStudentsList = event.students.map(s => s.id === studentId ? updatedStudent : s);

            return {
                ...latestState,
                events: {
                    ...latestState.events,
                    [eventCode]: {
                        ...event,
                        students: updatedStudentsList,
                    }
                },
                students: {
                    ...latestState.students,
                    [studentId]: updatedStudent
                }
            };
        });
    }

    const completeExam = (studentId, timeTaken) => {
        updateStudentScore(studentId, 0, timeTaken, 'completed', false);
    };

    const endEvent = (eventCode) => {
        updateState((latestState) => ({
            ...latestState,
            events: {
                ...latestState.events,
                [eventCode]: {
                    ...latestState.events[eventCode],
                    status: 'ended',
                    endTime: Date.now(),
                },
            },
        }));
    };

    const pauseEvent = (eventCode) => {
        updateState((latestState) => ({
            ...latestState,
            events: {
                ...latestState.events,
                [eventCode]: {
                    ...latestState.events[eventCode],
                    status: 'paused',
                },
            },
        }));
    };

    const resetEvent = (eventCode) => {
        updateState((latestState) => {
            const event = latestState.events[eventCode];
            if (!event) return latestState;

            // Reset all students
            const resetStudents = event.students.map(s => ({
                ...s,
                score: 0,
                timeTaken: 0,
                status: 'active',
                questionsCompleted: 0,
                warnings: 0
            }));

            // Build reset student dict
            const studentDict = { ...latestState.students };
            resetStudents.forEach(s => {
                studentDict[s.id] = s;
            });

            return {
                ...latestState,
                events: {
                    ...latestState.events,
                    [eventCode]: {
                        ...event,
                        status: 'waiting',
                        students: resetStudents,
                        startTime: null,
                        endTime: null
                    },
                },
                students: studentDict
            };
        });
    };

    return (
        <AppContext.Provider value={{
            events: data.events,
            students: data.students,
            createEvent,
            joinEvent,
            startEvent,
            updateStudentScore,
            disqualifyStudent,
            warnStudent,
            completeExam,
            endEvent,
            pauseEvent,
            resetEvent
        }}>
            {children}
        </AppContext.Provider>
    );
};
