/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, getDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    const [data, setData] = useState({ events: {} });

    // Sync state with Firestore real-time listener (Only events, participants handled by local active components)
    useEffect(() => {
        const eventsRef = collection(db, 'events');
        const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
            const newEvents = {};

            snapshot.forEach((docSnapshot) => {
                newEvents[docSnapshot.id] = docSnapshot.data();
            });

            setData({ events: newEvents });
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
            createdAt: Date.now(),
        });

        return eventCode;
    };

    const joinEvent = async (eventCode, studentInfo) => {
        const eventRef = doc(db, 'events', eventCode);

        try {
            const snap = await getDoc(eventRef);
            if (!snap.exists()) {
                return 'NOT_FOUND';
            }

            const ev = snap.data();
            if (ev.status !== 'waiting') {
                return 'NOT_WAITING';
            }

            // Check duplicate email in `participants` subcollection
            const participantsRef = collection(db, 'events', eventCode, 'participants');
            const duplicateQuery = query(participantsRef, where('email', '==', studentInfo.email));
            const duplicateSnap = await getDocs(duplicateQuery);

            if (!duplicateSnap.empty) {
                return 'DUPLICATE';
            }

            // Write to subcollection securely
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

            const studentDocRef = doc(db, 'events', eventCode, 'participants', studentId);
            await setDoc(studentDocRef, newStudent);

            return studentId;

        } catch (err) {
            console.error("Initial validation error:", err);
            return null;
        }
    };

    const startEvent = async (eventCode) => {
        const eventRef = doc(db, 'events', eventCode);
        await updateDoc(eventRef, {
            status: 'started',
            startTime: Date.now(),
        });
    };

    const updateStudentScore = async (eventCode, studentId, scoreIncrement, timeTaken = 0, status = 'active', incrementCompleted = false) => {
        try {
            if (!eventCode || !studentId) return;
            const studentRef = doc(db, 'events', eventCode, 'participants', studentId);
            const studentDoc = await getDoc(studentRef);

            if (!studentDoc.exists()) return;
            const student = studentDoc.data();

            const updatedStudent = {
                score: student.score + scoreIncrement,
                timeTaken: timeTaken > 0 ? timeTaken : student.timeTaken,
                status: status,
                questionsCompleted: incrementCompleted ? (student.questionsCompleted || 0) + 1 : (student.questionsCompleted || 0)
            };

            await updateDoc(studentRef, updatedStudent);
        } catch (err) {
            console.error(err);
        }
    };

    const disqualifyStudent = async (eventCode, studentId) => {
        await updateStudentScore(eventCode, studentId, 0, 0, 'disqualified', false);
    };

    const warnStudent = async (eventCode, studentId) => {
        try {
            if (!eventCode || !studentId) return;
            const studentRef = doc(db, 'events', eventCode, 'participants', studentId);
            const studentDoc = await getDoc(studentRef);

            if (!studentDoc.exists()) return;
            const student = studentDoc.data();
            const currentWarnings = student.warnings || 0;
            const newWarnings = currentWarnings + 1;

            const updateData = { warnings: newWarnings };
            if (newWarnings >= 2) {
                updateData.status = 'disqualified';
            }

            await updateDoc(studentRef, updateData);
        } catch (err) {
            console.error(err);
        }
    };

    const completeExam = async (eventCode, studentId, timeTaken) => {
        await updateStudentScore(eventCode, studentId, 0, timeTaken, 'completed', false);
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
            await updateDoc(eventRef, {
                status: 'waiting',
                startTime: null,
                endTime: null
            });

            // Reset all participants in subcollection
            const participantsRef = collection(db, 'events', eventCode, 'participants');
            const snapshot = await getDocs(participantsRef);

            const resetPromises = snapshot.docs.map((docSnap) => {
                const sRef = docSnap.ref;
                return updateDoc(sRef, {
                    score: 0,
                    timeTaken: 0,
                    status: 'active',
                    questionsCompleted: 0,
                    warnings: 0
                });
            });

            await Promise.all(resetPromises);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AppContext.Provider value={{
            events: data.events,
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
