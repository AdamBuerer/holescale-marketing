import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  showHomeButton?: boolean;
  className?: string;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  action,
  showHomeButton = true,
  className = ''
}: ErrorStateProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
    } else if (action?.href) {
      navigate(action.href);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="max-w-md mx-auto">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <Button onClick={handleAction} variant="default">
              {action.href ? (
                <>
                  <Home className="w-4 h-4 mr-2" />
                  {action.label}
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {action.label}
                </>
              )}
            </Button>
          )}

          {showHomeButton && (
            <Button onClick={() => navigate('/buyer/dashboard')} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
