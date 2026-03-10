/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, runTransaction, getDoc } from 'firebase/firestore';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [data, setData] = useState({ events: {}, students: {} });

    // Sync state with Firestore real-time listener
    useEffect(() => {
        const eventsRef = collection(db, 'events');
        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const newEvents = {};
            const newStudents = {};

            snapshot.forEach((docSnapshot) => {
                const ev = docSnapshot.data();
                // Map participants to students for backward compatibility with UI components
                ev.students = ev.participants || [];
                newEvents[docSnapshot.id] = ev;

                if (ev.participants) {
                    ev.participants.forEach(s => {
                        newStudents[s.id] = { ...s, eventCode: docSnapshot.id };
                    });
                }
            });

            setData({ events: newEvents, students: newStudents });
        }, (error) => {
            console.error("Error connecting to Firestore: ", error);
        });

        return () => unsubscribe();
    }, []);

    const createEvent = async (hostName) => {
        const eventCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const eventRef = doc(db, 'events', eventCode);

        await setDoc(eventRef, {
            hostName,
            status: 'waiting',
            participants: [],
            createdAt: Date.now(),
        });

        return eventCode;
    };

    const joinEvent = async (eventCode, studentInfo) => {
        const eventRef = doc(db, 'events', eventCode);

        // Fire an explicit native Firestore read check per user request
        try {
            const snap = await getDoc(eventRef);
            if (!snap.exists()) {
                return 'NOT_FOUND';
            }
        } catch (err) {
            console.error("Initial validation error:", err);
            // Optionally could return an error, but let transaction retry catch it as fallback
        }

        let attempts = 0;
        const maxAttempts = 2; // initial attempt + 1 retry

        while (attempts < maxAttempts) {
            try {
                let successId = null;
                let isDuplicate = false;

                const eventRef = doc(db, 'events', eventCode);

                await runTransaction(db, async (transaction) => {
                    const eventDoc = await transaction.get(eventRef);
                    if (!eventDoc.exists()) {
                        throw new Error("NOT_FOUND");
                    }

                    const ev = eventDoc.data();
                    if (ev.status !== 'waiting') {
                        throw new Error("NOT_WAITING");
                    }

                    const participants = ev.participants || [];

                    // Check duplicate email
                    const duplicate = participants.find(s => s.email.toLowerCase() === studentInfo.email.toLowerCase());
                    if (duplicate) {
                        isDuplicate = true;
                        return;
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

                    const newParticipants = [...participants, newStudent];
                    transaction.update(eventRef, { participants: newParticipants });
                    successId = studentId;
                });

                if (isDuplicate) return 'DUPLICATE';
                return successId;

            } catch (error) {
                if (error.message === 'NOT_FOUND') return 'NOT_FOUND';
                if (error.message === 'NOT_WAITING') return 'NOT_WAITING';

                console.error(`Transaction failed attempt ${attempts + 1}: `, error);
                attempts++;

                if (attempts >= maxAttempts) return null;

                // optional small delay before retry
                await new Promise(res => setTimeout(res, 500));
            }
        }
    };

    const startEvent = async (eventCode) => {
        const eventRef = doc(db, 'events', eventCode);
        await updateDoc(eventRef, {
            status: 'started',
            startTime: Date.now(),
        });
    };

    const updateStudentScore = async (studentId, scoreIncrement, timeTaken = 0, status = 'active', incrementCompleted = false) => {
        try {
            // Need to find which event this student belongs to, we use local state `data.students`
            const studentData = data.students[studentId];
            if (!studentData) return;

            const eventCode = studentData.eventCode;
            const eventRef = doc(db, 'events', eventCode);

            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) return;

                const ev = eventDoc.data();
                const participants = ev.participants || [];

                const pIndex = participants.findIndex(s => s.id === studentId);
                if (pIndex === -1) return;

                const student = participants[pIndex];

                const updatedStudent = {
                    ...student,
                    score: student.score + scoreIncrement,
                    timeTaken: timeTaken > 0 ? timeTaken : student.timeTaken,
                    status: status,
                    questionsCompleted: incrementCompleted ? (student.questionsCompleted || 0) + 1 : (student.questionsCompleted || 0)
                };

                const newParticipants = [...participants];
                newParticipants[pIndex] = updatedStudent;

                transaction.update(eventRef, { participants: newParticipants });
            });
        } catch (err) {
            console.error(err);
        }
    };

    const disqualifyStudent = async (studentId) => {
        await updateStudentScore(studentId, 0, 0, 'disqualified', false);
    };

    const warnStudent = async (studentId) => {
        try {
            const studentData = data.students[studentId];
            if (!studentData) return;

            const eventCode = studentData.eventCode;
            const eventRef = doc(db, 'events', eventCode);

            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) return;

                const ev = eventDoc.data();
                const participants = ev.participants || [];

                const pIndex = participants.findIndex(s => s.id === studentId);
                if (pIndex === -1) return;

                const student = participants[pIndex];
                const currentWarnings = student.warnings || 0;

                const updatedStudent = { ...student, warnings: currentWarnings + 1 };

                if (updatedStudent.warnings >= 2) {
                    updatedStudent.status = 'disqualified';
                }

                const newParticipants = [...participants];
                newParticipants[pIndex] = updatedStudent;

                transaction.update(eventRef, { participants: newParticipants });
            });
        } catch (err) {
            console.error(err);
        }
    };

    const completeExam = async (studentId, timeTaken) => {
        await updateStudentScore(studentId, 0, timeTaken, 'completed', false);
    };

    const endEvent = async (eventCode) => {
        const eventRef = doc(db, 'events', eventCode);
        await updateDoc(eventRef, {
            status: 'ended',
            endTime: Date.now(),
        });
    };

    const pauseEvent = async (eventCode) => {
        const eventRef = doc(db, 'events', eventCode);
        await updateDoc(eventRef, {
            status: 'paused',
        });
    };

    const resetEvent = async (eventCode) => {
        try {
            const eventRef = doc(db, 'events', eventCode);
            await runTransaction(db, async (transaction) => {
                const eventDoc = await transaction.get(eventRef);
                if (!eventDoc.exists()) return;

                const ev = eventDoc.data();
                const participants = ev.participants || [];

                const resetParticipants = participants.map(s => ({
                    ...s,
                    score: 0,
                    timeTaken: 0,
                    status: 'active',
                    questionsCompleted: 0,
                    warnings: 0
                }));

                transaction.update(eventRef, {
                    status: 'waiting',
                    participants: resetParticipants,
                    startTime: null,
                    endTime: null
                });
            });
        } catch (err) {
            console.error(err);
        }
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
