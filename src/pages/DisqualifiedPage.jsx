import { AlertTriangle } from 'lucide-react';

export default function DisqualifiedPage() {
    return (
        <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#13151a] border border-red-500/20 rounded-3xl p-10 text-center shadow-2xl shadow-red-900/10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 rounded-full mb-6">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">Disqualified</h1>
                <p className="text-gray-400 text-lg">
                    You are disqualified for leaving the exam environment.
                </p>
            </div>
        </div>
    );
}
