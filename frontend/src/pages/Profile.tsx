import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, MapPin, Shield, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileData {
  email: string;
  role: string;
  address: string;
  memberSince?: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        console.log('Profile API Response:', response.data); // Debug log
        
        // Handle different response structures
        let profileData = null;
        if (response.data.data) {
          // Response is { success: true, data: {...} }
          profileData = response.data.data;
        } else if (response.data.email) {
          // Response is directly the profile object
          profileData = response.data;
        }
        
        console.log('Extracted profile:', profileData);
        setProfile(profileData);
      } catch (error) {
        console.error('Profile fetch error:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-2xl py-8">
        <Card className="shadow-md">
          <CardContent className="py-8 text-center text-muted-foreground">
            Failed to load profile data
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Profile Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
              <Mail className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
              <Shield className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="font-medium capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
              <MapPin className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-medium">{profile.address || 'Not provided'}</p>
              </div>
            </div>

            {profile.memberSince && (
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(profile.memberSince).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;