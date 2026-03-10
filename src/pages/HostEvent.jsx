import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Users, Play, Trophy, Clock, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function HostEvent() {
    const { eventCode } = useParams();
    const navigate = useNavigate();
    const { events, startEvent, endEvent, pauseEvent, resetEvent } = useAppContext();
    const [participants, setParticipants] = useState([]);

    const event = events[eventCode];

    // If event doesn't exist, redirect after giving context a moment to sync from Firebase
    useEffect(() => {
        let timeout;
        if (!event) {
            timeout = setTimeout(() => {
                navigate('/host');
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [event, navigate]);

    useEffect(() => {
        if (!eventCode) return;
        const participantsRef = collection(db, 'events', eventCode, 'participants');
        const unsubscribe = onSnapshot(participantsRef, (snapshot) => {
            const list = [];
            snapshot.forEach(doc => {
                list.push(doc.data());
            });
            setParticipants(list);
        });
        return () => unsubscribe();
    }, [eventCode]);

    if (!event) {
        return (
            <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Loading Arena Data...</h2>
                </div>
            </div>
        );
    }

    const handleStart = () => {
        startEvent(eventCode);
    };

    const handleEnd = () => {
        endEvent(eventCode);
    };

    // Sort students for leaderboard: by score descending, then by time taken ascending
    const sortedStudents = [...participants].sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.timeTaken - b.timeTaken;
    });

    return (
        <div className="min-h-screen bg-[#0a0b0d] p-6 lg:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-gray-800 pb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                            Event Code: <span className="text-blue-500 tracking-widest bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/20">{eventCode}</span>
                        </h1>
                        <p className="text-gray-400 mt-2 text-lg">Hosted by {event.hostName}</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex items-center gap-3 bg-[#13151a] border border-gray-800 px-6 py-3 rounded-xl">
                            <Users className="text-blue-500 w-6 h-6" />
                            <div>
                                <p className="text-sm text-gray-400">Participants Joined</p>
                                <p className="text-2xl font-bold text-white">{participants.length}</p>
                            </div>
                        </div>

                        {event.status === 'waiting' && (
                            <button
                                disabled={participants.length === 0}
                                onClick={handleStart}
                                className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${participants.length > 0
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                                    }`}
                            >
                                <Play className="fill-current w-5 h-5" />
                                Start Round
                            </button>
                        )}

                        {event.status === 'started' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => pauseEvent(eventCode)}
                                    className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500 hover:text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    Pause Contest
                                </button>
                                <button
                                    onClick={handleEnd}
                                    className="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    End Contest
                                </button>
                            </div>
                        )}

                        {event.status === 'paused' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleStart}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg"
                                >
                                    <Play className="fill-current w-4 h-4" />
                                    Resume Contest
                                </button>
                                <button
                                    onClick={handleEnd}
                                    className="bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    End Contest
                                </button>
                            </div>
                        )}

                        {event.status === 'ended' && (
                            <div className="flex gap-2">
                                <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    Event Completed
                                </div>
                                <button
                                    onClick={() => resetEvent(eventCode)}
                                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
                                >
                                    Reset Contest
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {event.status === 'waiting' && (
                    <div className="bg-[#13151a] border border-gray-800 rounded-3xl p-10 text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/10 rounded-full mb-6 relative">
                            <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-ping" />
                            <Users className="w-10 h-10 text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Waiting for students to join...</h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
                            Share the event code <strong className="text-white">{eventCode}</strong> with your students.
                            They can join using the student portal. When everyone is ready, click Start Round.
                        </p>

                        {participants.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8 pt-8 border-t border-gray-800">
                                {participants.map((student, i) => (
                                    <div key={i} className="bg-[#0a0b0d] border border-gray-800 p-4 rounded-xl flex items-center flex-col gap-2">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold">
                                            {student.name.charAt(0).toUpperCase()}
                                        </div>
                                        <p className="text-white font-medium text-sm text-center truncate w-full">{student.name}</p>
                                        <span className="text-xs text-gray-500 font-mono bg-[#13151a] px-2 py-1 rounded">{student.language}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {(event.status === 'started' || event.status === 'ended') && (
                    <div className="bg-[#13151a] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-gray-800 bg-[#161920] flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                                Live Leaderboard
                            </h2>
                            {event.status === 'started' && (
                                <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 px-4 py-2 rounded-full text-sm font-medium">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                    Live Updates
                                </div>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[#0a0b0d] text-gray-400 border-b border-gray-800 text-sm">
                                    <tr>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Student Name</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Language</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Score (/10)</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Completed</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Time</th>
                                        <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {sortedStudents.map((student, index) => (
                                        <tr key={student.id} className="hover:bg-gray-800/20 transition-colors">
                                            <td className="px-6 py-5">
                                                {index === 0 && student.score > 0 ? (
                                                    <span className="w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold border border-yellow-500/30">1</span>
                                                ) : index === 1 && student.score > 0 ? (
                                                    <span className="w-8 h-8 rounded-full bg-gray-400/20 text-gray-400 flex items-center justify-center font-bold border border-gray-400/30">2</span>
                                                ) : index === 2 && student.score > 0 ? (
                                                    <span className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 flex items-center justify-center font-bold border border-amber-700/30">3</span>
                                                ) : (
                                                    <span className="text-gray-500 font-medium pl-2">{index + 1}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 font-medium text-white">{student.name}</td>
                                            <td className="px-6 py-5">
                                                <span className="bg-[#0a0b0d] border border-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                                                    {student.language}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`font-bold text-lg ${student.score > 0 ? 'text-emerald-500' : 'text-gray-500'}`}>
                                                    {student.score}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-gray-400 font-medium">{student.questionsCompleted || 0} / 10</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1.5 text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    {Math.floor(student.timeTaken / 60)}:{String(student.timeTaken % 60).padStart(2, '0')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {student.status === 'active' && <span className="text-blue-400 flex items-center gap-1.5 text-sm font-medium"><span className="w-1.5 h-1.5 bg-blue-400 rounded-full" /> In Progress</span>}
                                                {student.status === 'completed' && <span className="text-emerald-500 flex items-center gap-1.5 text-sm font-medium"><CheckCircle2 className="w-4 h-4" /> Completed</span>}
                                                {student.status === 'disqualified' && <span className="text-red-500 flex items-center gap-1.5 text-sm font-medium"><AlertTriangle className="w-4 h-4" /> Disqualified</span>}
                                            </td>
                                        </tr>
                                    ))}

                                    {sortedStudents.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                No students joined this event.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
