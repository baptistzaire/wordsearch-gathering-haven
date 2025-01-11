import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AuthButton = () => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      onClick={handleGoogleSignIn}
      className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
};