import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './Card';

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-red-900/50 bg-slate-900/90 shadow-[0_0_50px_rgba(220,38,38,0.1)]">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-12 h-12 bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-500" size={24} />
                    </div>
                    <CardTitle className="text-xl text-red-100">System Critical Error</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-slate-400 text-sm">
                        The application encountered an unexpected error and needs to restart.
                    </p>

                    <div className="bg-black/40 rounded p-3 text-xs font-mono text-red-300 break-all border border-red-900/30">
                        {error.message}
                    </div>

                    <Button
                        onClick={resetErrorBoundary}
                        className="w-full bg-red-600 hover:bg-red-700 text-white"
                        leftIcon={<RefreshCw size={16} />}
                    >
                        Reload Application
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorFallback;
