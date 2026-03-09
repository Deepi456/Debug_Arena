import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Trophy, Clock, Medal, Home } from 'lucide-react';

export default function ResultPage() {
    const { eventCode, studentId } = useParams();
    const navigate = useNavigate();
    const { events, students } = useAppContext();

    const event = events?.[eventCode];
    const student = students?.[studentId];

    useEffect(() => {
        if (!event || !student) {
            navigate('/');
        }
    }, [event, student, navigate]);

    if (!event || !student) return null;

    const getPerformanceMessage = (score) => {
        if (score >= 8) return "Excellent Performance";
        if (score >= 5) return "Good Attempt";
        return "Needs Improvement";
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const correctAnswers = student.score;
    const wrongAnswers = 10 - student.score;
    const message = getPerformanceMessage(student.score);
    const isExcellent = student.score >= 8;

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-4xl bg-[#13151a] border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">

                {/* Background glow depends on performance */}
                <div className={`absolute top-0 inset-x-0 h-64 bg-gradient-to-b pointer-events-none ${isExcellent ? 'from-yellow-500/10 to-transparent' : 'from-blue-500/10 to-transparent'}`} />

                <div className="relative z-10 text-center mb-12">
                    {isExcellent ? (
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-500/10 rounded-full mb-6 border border-yellow-500/30 shadow-[0_0_30px_-5px_#eab308]">
                            <Trophy className="w-12 h-12 text-yellow-500" />
                        </div>
                    ) : (
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-500/10 rounded-full mb-6 relative">
                            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
                            <Medal className="w-12 h-12 text-blue-500" />
                        </div>
                    )}

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Exam Completed!
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Great job, <strong className="text-white">{student.name}</strong>. Here are your final results for <strong className="text-white">{student.language}</strong>.
                    </p>
                </div>

                <div className="bg-[#0d0e12] border border-gray-800 rounded-2xl p-8 mb-8 text-center">
                    <h2 className={`text-3xl font-bold mb-2 ${isExcellent ? 'text-yellow-400' : 'text-blue-400'}`}>
                        {message}
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-[#0d0e12] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Total Score</span>
                        <div className="text-4xl font-bold text-white">
                            {student.score} <span className="text-xl text-gray-600">/ 10</span>
                        </div>
                    </div>

                    <div className="bg-[#0d0e12] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Correct Answers</span>
                        <div className="text-4xl font-bold text-emerald-500">
                            {correctAnswers}
                        </div>
                    </div>

                    <div className="bg-[#0d0e12] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Wrong Answers</span>
                        <div className="text-4xl font-bold text-red-500">
                            {wrongAnswers}
                        </div>
                    </div>

                    <div className="bg-[#0d0e12] border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Time Taken</span>
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            <Clock className="w-6 h-6 text-blue-500" />
                            {formatTime(student.timeTaken)}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
