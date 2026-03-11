import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Trophy, Clock, Medal, Home, RefreshCw } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getQuestionsForExam } from '../utils/questions';
import Editor from '@monaco-editor/react';

export default function ResultPage() {
    const { eventCode, studentId } = useParams();
    const navigate = useNavigate();
    const { events } = useAppContext();
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const event = events?.[eventCode];

    useEffect(() => {
        const fetchStudent = async () => {
            if (!eventCode || !studentId) return;
            try {
                const docRef = doc(db, 'events', eventCode, 'participants', studentId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setStudent(docSnap.data());
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudent();
    }, [eventCode, studentId]);

    // Allow some time for AppContext (events) to sync before forcing a redirect
    useEffect(() => {
        let timeout;
        if (!isLoading && (!event || !student)) {
            timeout = setTimeout(() => {
                navigate('/');
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [event, student, isLoading, navigate]);

    if (isLoading || !event || !student) {
        return (
            <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Generating Results...</h2>
                </div>
            </div>
        );
    }

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

    const questions = getQuestionsForExam(student.language, eventCode, studentId);

    const mapLangToMonaco = (lang) => {
        if (lang === 'Python') return 'python';
        if (lang === 'Java') return 'java';
        if (lang === 'C++') return 'cpp';
        return 'plaintext';
    };

    const monacoLanguage = mapLangToMonaco(student.language);

    const checkCorrectness = (submitted, target) => {
        if (!submitted) return false;
        // Strip whitespace and compare for exact structural equality as a UI fallback indicator
        return submitted.replace(/\s/g, '') === target.replace(/\s/g, '');
    };

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
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Total Questions</span>
                        <div className="text-4xl font-bold text-white">
                            10
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
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2 text-center">Final Score</span>
                        <div className="text-4xl font-bold text-blue-500">
                            {student.score} <span className="text-xl text-gray-600">/ 10</span>
                        </div>
                    </div>
                </div>

                {/* Question Review Section */}
                <div className="mt-16 border-t border-gray-800 pt-10">
                    <h2 className="text-3xl font-bold text-white mb-2 text-center">Question Review</h2>
                    <p className="text-gray-400 text-center mb-10">Analyze the buggy code, the correct solution, and your submitted answer.</p>

                    <div className="space-y-12">
                        {questions.map((q, idx) => {
                            const submittedAns = student.submittedCode ? student.submittedCode[idx] : null;
                            const isQCorrect = checkCorrectness(submittedAns, q.correctCode);

                            return (
                                <div key={idx} className="bg-[#0d0e12] border border-gray-800 rounded-2xl overflow-hidden shadow-lg">
                                    <div className="p-6 border-b border-gray-800 bg-[#13151a] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">Question {idx + 1}: {q.title}</h3>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                    q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                                                        'bg-red-500/10 text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {q.difficulty}
                                                </span>
                                                {isQCorrect ? (
                                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/50 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>Correct</span>
                                                ) : (
                                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/50 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>Incorrect</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-300 text-sm md:max-w-xl md:text-right">{q.description}</p>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {/* Buggy Code */}
                                        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[160px]">
                                            <div className="bg-[#13151a] border-b border-gray-800 px-4 py-2 flex items-center gap-2">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                                <span className="text-xs uppercase tracking-wider text-gray-300 font-bold">Buggy Code</span>
                                            </div>
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-0">
                                                    <Editor
                                                        height="100%"
                                                        language={monacoLanguage}
                                                        theme="vs-dark"
                                                        value={q.buggyCode}
                                                        options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13, padding: { top: 12 } }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Correct Code */}
                                        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[160px]">
                                            <div className="bg-[#13151a] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                                                    <span className="text-xs uppercase tracking-wider text-gray-300 font-bold">Correct Debugged Code</span>
                                                </div>
                                                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 rounded-full py-0.5 border border-emerald-500/30">Verified</span>
                                            </div>
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-0">
                                                    <Editor
                                                        height="100%"
                                                        language={monacoLanguage}
                                                        theme="vs-dark"
                                                        value={q.correctCode}
                                                        options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13, padding: { top: 12 } }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submitted Code */}
                                        <div className="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-inner flex flex-col min-h-[160px]">
                                            <div className="bg-[#13151a] border-b border-gray-800 px-4 py-2 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                                    <span className="text-xs uppercase tracking-wider text-gray-300 font-bold">Your Answer</span>
                                                </div>
                                            </div>
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-0">
                                                    {student.submittedCode && student.submittedCode[idx] ? (
                                                        <Editor
                                                            height="100%"
                                                            language={monacoLanguage}
                                                            theme="vs-dark"
                                                            value={student.submittedCode[idx]}
                                                            options={{ readOnly: true, minimap: { enabled: false }, scrollBeyondLastLine: false, fontSize: 13, padding: { top: 12 } }}
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]">
                                                            <span className="text-gray-500 italic text-sm">No code submitted for this question.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Explanation */}
                                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                                            <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wide">Explanation</h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {q.explanation}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={() => {
                            localStorage.removeItem('eventCode');
                            localStorage.removeItem('debugArenaSession');
                            navigate('/');
                        }}
                        className="inline-flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors font-bold w-full md:w-auto"
                    >
                        <Home className="w-5 h-5" />
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
