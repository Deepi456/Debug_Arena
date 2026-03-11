import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MonitorPlay, Code2 } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    // Role detection on website load
    useEffect(() => {
        const role = localStorage.getItem('role');

        if (role === 'host') {
            navigate('/host-dashboard');
        } else if (role === 'participant') {
            navigate('/waiting-room');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />

            <div className="max-w-4xl w-full z-10 flex flex-col items-center">

                <div className="flex items-center gap-3 mb-4">
                    <Code2 className="w-12 h-12 text-blue-500" />
                    <h1 className="text-5xl font-bold tracking-tight text-white">Debug<span className="text-blue-500">Arena</span></h1>
                </div>
                <p className="text-gray-400 text-lg mb-12 text-center max-w-lg">
                    The ultimate platform for conducting real-time debugging contests.
                    Choose your role to get started.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    {/* Host Card */}
                    <button
                        onClick={() => navigate('/host')}
                        className="group relative bg-[#13151a] border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                <MonitorPlay className="w-7 h-7 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Host an Event</h2>
                            <p className="text-gray-400">
                                Create a coding round, generate an event code, and monitor the live leaderboard.
                            </p>
                        </div>
                    </button>

                    {/* Student Card */}
                    <button
                        onClick={() => navigate('/join')}
                        className="group relative bg-[#13151a] border border-gray-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-emerald-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                                <UserPlus className="w-7 h-7 text-emerald-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Join as Student</h2>
                            <p className="text-gray-400">
                                Enter your event code to join the arena and start debugging.
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
