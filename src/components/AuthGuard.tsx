import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User, Calendar } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  onLogin: () => void;
  message?: string;
  showIcon?: boolean;
}

export const AuthGuard = ({ children, onLogin, message, showIcon = true }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        {showIcon && (
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
        )}
        <CardTitle className="text-xl font-bold text-gray-900">
          Authentication Required
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-gray-600">
          {message || "Please sign in to access this feature."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onLogin}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <User className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          
          <Button 
            onClick={onLogin}
            variant="outline"
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Create Account
          </Button>
        </div>
        
        <p className="text-xs text-gray-500">
          Sign in to book courts, view your profile, and manage bookings
        </p>
      </CardContent>
    </Card>
  );
}; 