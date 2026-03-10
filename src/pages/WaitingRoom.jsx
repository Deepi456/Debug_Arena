import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function WaitingRoom() {
    const navigate = useNavigate();
    const [eventStatus, setEventStatus] = useState('waiting');
    const [eventCode, setEventCode] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        const sessionStore = localStorage.getItem('debugArenaSession');
        if (sessionStore) {
            try {
                const session = JSON.parse(sessionStore);
                setEventCode(session.eventCode);
                setStudentId(session.studentId);
            } catch (err) {
                console.error("Local session invalid", err);
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        if (!eventCode) return;
        const eventRef = doc(db, 'events', eventCode);
        const unsubscribe = onSnapshot(eventRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setEventStatus(data.status);

                if (data.status === 'started') {
                    navigate(`/exam/${eventCode}/${studentId}`);
                }
            }
        });
        return () => unsubscribe();
    }, [eventCode, studentId, navigate]);

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
            <div className="text-center w-full max-w-xl bg-[#13151a] border border-gray-800 rounded-3xl p-10 shadow-2xl">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/10 rounded-full mb-8 relative">
                    <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }} />
                    <Clock className="w-10 h-10 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">You're in the Arena!</h2>
                <h3 className="text-xl text-emerald-400 mb-6 font-mono tracking-widest">{eventCode}</h3>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Waiting for the host to start the contest. <br />
                    <span className="text-sm border-b border-gray-700 pb-1 mt-4 inline-block">The exam will begin automatically. Do not leave this page.</span>
                </p>
                <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-blue-500 h-1.5 rounded-full w-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
