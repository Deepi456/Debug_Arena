import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function StudentJoin() {
    const navigate = useNavigate();
    const { joinEvent, events } = useAppContext();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        eventCode: '',
        language: 'Python'
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const code = formData.eventCode.toUpperCase();
        const event = events[code];

        if (!event) {
            setError('Invalid Event Code. Please check and try again.');
            return;
        }

        if (event.status !== 'waiting') {
            setError('This event has already started or ended.');
            return;
        }

        const studentId = joinEvent(code, formData);

        if (studentId === 'DUPLICATE') {
            setError('You have already joined this event with this email.');
        } else if (studentId) {
            navigate(`/exam/${code}/${studentId}`);
        } else {
            setError('Failed to join the event.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-[#13151a] border border-gray-800 rounded-3xl p-10 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_-5px_#10b981]">
                        <UserPlus className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-center text-white mb-2">Join Arena</h2>
                <p className="text-gray-400 text-center mb-8 text-lg">Enter your details to enter the event</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#0a0b0d] border border-gray-800 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#0a0b0d] border border-gray-800 rounded-xl px-5 py-4 text-lg text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Event Code</label>
                        <input
                            type="text"
                            required
                            value={formData.eventCode}
                            onChange={(e) => setFormData({ ...formData, eventCode: e.target.value.toUpperCase() })}
                            className="w-full bg-[#0a0b0d] border border-gray-800 rounded-xl px-5 py-4 text-2xl tracking-widest text-center text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all uppercase"
                            placeholder="XXXXXX"
                            maxLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Language</label>
                        <select
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full bg-[#0a0b0d] border border-gray-800 rounded-xl px-5 py-4 text-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                        >
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="C++">C++</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl py-5 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4 shadow-lg shadow-emerald-900/20"
                    >
                        Join Event
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </div>
    );
}
