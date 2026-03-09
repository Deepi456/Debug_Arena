import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getQuestionsForExam } from '../utils/questions';
import { executeCode } from '../utils/judge0';
import Editor from '@monaco-editor/react';
import { Clock, Play, CheckCircle2, ChevronRight, ChevronLeft, AlertCircle, RefreshCw } from 'lucide-react';

const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

export default function ExamArea() {
    const { eventCode, studentId } = useParams();
    const navigate = useNavigate();
    const { events, students, disqualifyStudent, completeExam, updateStudentScore, warnStudent } = useAppContext();

    const event = events?.[eventCode];
    const student = students?.[studentId];

    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [codeValues, setCodeValues] = useState({});
    const [results, setResults] = useState({});
    const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
    const [isExecuting, setIsExecuting] = useState(false);
    const editorRef = useRef(null);

    // Initialize questions
    useEffect(() => {
        if (student && event && questions.length === 0) {
            const qs = getQuestionsForExam(student.language, eventCode);
            setQuestions(qs);

            const initialCodes = {};
            qs.forEach((q, idx) => {
                initialCodes[idx] = q.buggyCode;
            });
            setCodeValues(initialCodes);
        }
    }, [student, event, eventCode, questions.length]);

    // Anti-cheating & Timer logic
    useEffect(() => {
        if (!event || !student) {
            navigate('/');
            return;
        }

        if (student.status === 'disqualified') {
            navigate(`/disqualified/${eventCode}/${studentId}`);
            return;
        }

        if (student.status === 'completed') {
            navigate(`/result/${eventCode}/${studentId}`);
            return;
        }

        if (event.status === 'started') {
            // Request Fullscreen
            try {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(e => console.log(e));
                }
            } catch (e) { }

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleCompleteExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            // Anti-cheating listeners (Warning system)
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    warnStudent(studentId);
                    alert("WARNING: You left the exam tab. Further violations will result in disqualification.");
                }
            };

            const handleFullscreenChange = () => {
                if (!document.fullscreenElement) {
                    warnStudent(studentId);
                    alert("WARNING: You exited fullscreen mode. Further violations will result in disqualification.");
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('fullscreenchange', handleFullscreenChange);

            return () => {
                clearInterval(timer);
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                document.removeEventListener('fullscreenchange', handleFullscreenChange);
            };
        } else if (event.status === 'ended' || event.status === 'paused') {
            if (event.status === 'ended') handleCompleteExam();
        }
    }, [event?.status, student?.status, eventCode, studentId]);

    // Global shortcut disabler
    useEffect(() => {
        const handleGlobalKeyDown = (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))) {
                e.preventDefault();
            }
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'C' || e.key === 'V' || e.key === 'X')) {
                e.preventDefault();
            }
        };
        const handleContextMenu = (e) => e.preventDefault();

        window.addEventListener('keydown', handleGlobalKeyDown);
        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, []);

    const handleDisqualify = () => {
        disqualifyStudent(studentId);
        navigate(`/disqualified/${eventCode}/${studentId}`);
    };

    const handleCompleteExam = () => {
        const timeTaken = EXAM_DURATION - timeLeft;
        completeExam(studentId, timeTaken);
        navigate(`/result/${eventCode}/${studentId}`);
    };

    // Editor configuration
    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        // Disable right click (context menu) and copy/paste
        editor.onContextMenu((e) => {
            e.event.preventDefault();
        });

        editor.onKeyDown((e) => {
            // CMD/CTRL + C, V, X
            if ((e.ctrlKey || e.metaKey) && (e.keyCode === monaco.KeyCode.KeyC || e.keyCode === monaco.KeyCode.KeyV || e.keyCode === monaco.KeyCode.KeyX)) {
                e.preventDefault();
            }
        });
    };

    const handleCodeChange = (value) => {
        setCodeValues(prev => ({ ...prev, [currentIndex]: value }));
    };

    const mapLangToMonaco = (lang) => {
        if (lang === 'Python') return 'python';
        if (lang === 'Java') return 'java';
        if (lang === 'C++') return 'cpp';
        return 'plaintext';
    };

    const mapLangToJudge0 = (lang) => {
        if (lang === 'Python') return 71;
        if (lang === 'Java') return 62;
        if (lang === 'C++') return 54;
        return 71;
    };

    const handleRunCode = async (isSubmit = false) => {
        const currentQ = questions[currentIndex];
        const sourceCode = codeValues[currentIndex];

        setIsExecuting(true);
        try {
            const response = await executeCode(sourceCode, mapLangToJudge0(student.language), currentQ.testInput);

            let outputStr = response.stdout ? response.stdout.trim() : '';
            let errorStr = response.stderr ? response.stderr.trim() : response.compile_output ? response.compile_output.trim() : '';
            let statusId = response.status?.id || 3;

            let isCorrect = false;
            let uiMessage = '';

            if (statusId === 3) {
                // Accepted (syntactically)
                if (outputStr === currentQ.expectedOutput) {
                    isCorrect = true;
                    uiMessage = 'Correct Answer';
                } else {
                    uiMessage = 'Wrong Output';
                }
            } else if (statusId >= 6 && statusId <= 12) {
                uiMessage = 'Runtime Error or Compile Error';
                errorStr = response.compile_output || response.stderr || 'Unknown execution error';
            } else {
                uiMessage = response.status?.description || 'Error';
            }

            setResults(prev => ({
                ...prev,
                [currentIndex]: {
                    outputStr,
                    errorStr,
                    uiMessage,
                    isCorrect,
                    isSubmitAction: isSubmit
                }
            }));

            if (isSubmit) {
                const prevResult = results[currentIndex];
                const isFirstSubmit = !prevResult?.isSubmitAction;
                const wasPreviouslyCorrect = prevResult?.isCorrect && prevResult?.isSubmitAction;

                if (isFirstSubmit) {
                    updateStudentScore(studentId, isCorrect ? 1 : 0, EXAM_DURATION - timeLeft, 'active', true);
                } else if (!wasPreviouslyCorrect && isCorrect) {
                    updateStudentScore(studentId, 1, EXAM_DURATION - timeLeft, 'active', false);
                }
            }

        } catch (err) {
            setResults(prev => ({
                ...prev,
                [currentIndex]: {
                    outputStr: '',
                    errorStr: err.message,
                    uiMessage: 'Network Error / Judge0 Unreachable',
                    isCorrect: false,
                    isSubmitAction: isSubmit
                }
            }));
        } finally {
            setIsExecuting(false);
        }
    };

    if (!event || !student) return null;

    if (event.status === 'waiting') {
        return (
            <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6 relative">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full animate-spin" style={{ borderTopColor: 'transparent' }} />
                        <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Waiting for the host to start the contest.</h2>
                    <p className="text-gray-400">The exam will begin shortly. Do not leave this page.</p>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const qResult = results[currentIndex];

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="h-screen bg-[#0a0b0d] flex flex-col overflow-hidden">
            {/* Navbar */}
            <header className="h-16 border-b border-gray-800 bg-[#13151a] flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-bold text-white leading-none">Debug<span className="text-blue-500">Arena</span></h1>
                    <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded font-mono">{student.language}</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-white font-mono bg-[#0a0b0d] border border-gray-800 px-4 py-2 rounded-lg">
                        <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`} />
                        <span className={timeLeft < 300 ? 'text-red-500 font-bold' : ''}>{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        onClick={handleCompleteExam}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                    >
                        End Exam
                    </button>
                </div>
            </header>

            {/* Main Content Split */}
            {questions.length > 0 && (
                <div className="flex-1 flex overflow-hidden">

                    {/* Left Panel: Question Info */}
                    <div className="w-1/3 min-w-[300px] border-r border-gray-800 bg-[#0d0e12] flex flex-col z-10 shadow-[5px_0_30px_-10px_rgba(0,0,0,0.5)]">

                        {/* Question Navigator */}
                        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#13151a]">
                            <button
                                disabled={currentIndex === 0}
                                onClick={() => setCurrentIndex(c => c - 1)}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            <div className="text-center flex flex-col items-center">
                                <span className="text-sm font-bold text-gray-200">
                                    Question {currentIndex + 1} of {questions.length}
                                </span>
                                <span className="text-xs text-blue-400 font-medium tracking-wide mt-1">
                                    {student.questionsCompleted || 0} Answered, {questions.length - (student.questionsCompleted || 0)} Remaining
                                </span>
                            </div>

                            <button
                                disabled={currentIndex === questions.length - 1}
                                onClick={() => setCurrentIndex(c => c + 1)}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-2.5 py-1 rounded text-xs font-bold ${currentQ.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                                    currentQ.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                    }`}>
                                    {currentQ.difficulty}
                                </span>
                                <h2 className="text-xl font-bold text-white">{currentQ.title}</h2>
                            </div>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                {currentQ.description}
                            </p>

                            <div className="bg-[#13151a] border border-gray-800 rounded-xl p-4 mb-4">
                                <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">Buggy Code Focus</h3>
                                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                                    {currentQ.buggyCode}
                                </pre>
                            </div>
                        </div>

                        {/* Quick Question Map */}
                        <div className="p-4 border-t border-gray-800 bg-[#13151a]">
                            <div className="flex flex-wrap gap-2">
                                {questions.map((_, idx) => {
                                    const state = results[idx]?.isSubmitAction && results[idx]?.isCorrect ? 'correct' :
                                        results[idx]?.isSubmitAction ? 'wrong' : null;

                                    let bgClass = "bg-gray-800 text-gray-400 hover:bg-gray-700";
                                    if (state === 'correct') bgClass = "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50";
                                    if (state === 'wrong') bgClass = "bg-red-500/20 text-red-500 border border-red-500/50";
                                    if (currentIndex === idx) bgClass += " ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0d0e12]";

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold transition-all ${bgClass}`}
                                        >
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Editor & Output */}
                    <div className="w-2/3 flex flex-col bg-[#1e1e1e]">

                        {/* Action Bar */}
                        <div className="h-14 border-b border-gray-800 bg-[#13151a] flex items-center justify-end px-4 gap-3 shrink-0">
                            <button
                                disabled={isExecuting}
                                onClick={() => handleRunCode(false)}
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                            >
                                {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                Run Code
                            </button>
                            <button
                                disabled={isExecuting}
                                onClick={() => handleRunCode(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                            >
                                {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                Submit Answer
                            </button>
                        </div>

                        {/* Editor Area */}
                        <div className="flex-1 relative">
                            <Editor
                                height="100%"
                                language={mapLangToMonaco(student.language)}
                                theme="vs-dark"
                                value={codeValues[currentIndex]}
                                onChange={handleCodeChange}
                                onMount={handleEditorDidMount}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 15,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    contextmenu: false,
                                    fontFamily: "'JetBrains Mono', 'Courier New', monospace"
                                }}
                            />
                        </div>

                        {/* Output Console */}
                        <div className="h-48 border-t border-gray-800 bg-[#13151a] flex flex-col shrink-0">
                            <div className="h-10 border-b border-gray-800 flex items-center px-4 shrink-0 bg-[#0d0e12]">
                                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold shrink-0">Output Console</span>
                                {qResult?.uiMessage && (
                                    <div className={`ml-4 flex items-center gap-1.5 text-sm font-bold px-2 py-0.5 rounded ${qResult.isCorrect ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'
                                        }`}>
                                        {qResult.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                        {qResult.uiMessage}
                                        {qResult.isSubmitAction && <span className="ml-2 text-xs opacity-75 uppercase">({qResult.isCorrect ? '+1 Pt' : '0 Pts'})</span>}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                                {!qResult ? (
                                    <p className="text-gray-600">Click &quot;Run Code&quot; or &quot;Submit Answer&quot; to see output.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {qResult.outputStr && (
                                            <div>
                                                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Stdout:</p>
                                                <pre className="text-gray-300">{qResult.outputStr}</pre>
                                            </div>
                                        )}
                                        {qResult.errorStr && (
                                            <div>
                                                <p className="text-red-500/50 text-xs mb-1 uppercase tracking-wider">Stderr / Compile Error:</p>
                                                <pre className="text-red-400">{qResult.errorStr}</pre>
                                            </div>
                                        )}
                                        {currentQ.expectedOutput && qResult.isSubmitAction && (
                                            <div className="pt-2 border-t border-gray-800">
                                                <p className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Expected Stdout Output:</p>
                                                <pre className="text-gray-400">{currentQ.expectedOutput}</pre>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
