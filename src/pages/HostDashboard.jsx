import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MonitorPlay, ArrowRight } from 'lucide-react';

export default function HostDashboard() {
    const [hostName, setHostName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { createEvent } = useAppContext();

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!hostName.trim()) return;
        setError('');

        try {
            const eventCode = await createEvent(hostName);

            localStorage.setItem("role", "host");
            localStorage.setItem("eventCode", eventCode);

            navigate(`/host-dashboard`);
        } catch (err) {
            console.error("Create event error:", err);
            if (err.code === 'permission-denied') {
                setError("Firestore permission denied. Please deploy your Firestore security rules.");
            } else {
                setError(`Failed to create event: ${err.code || err.message || 'Unknown error'}`);
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#13151a] border border-gray-800 rounded-3xl p-8 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_#3b82f6]">
                        <MonitorPlay className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-center text-white mb-2">Create Event</h2>
                <p className="text-gray-400 text-center mb-8">Set up your debugging arena</p>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Organizer Name
                        </label>
                        <input
                            type="text"
                            value={hostName}
                            onChange={(e) => setHostName(e.target.value)}
                            placeholder="e.g. John Doe / Tech Club"
                            className="w-full bg-[#0a0b0d] border border-gray-800 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg py-4 rounded-xl flex items-center justify-center gap-2 transition-colors group"
                    >
                        Generate Event Code
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}
