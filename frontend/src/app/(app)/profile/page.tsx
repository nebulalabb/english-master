'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Zap, Clock, BookOpen, Settings as SettingsIcon, Edit2, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/axios';

const GOALS = [
  { value: 'travel', label: 'Travel & Culture' },
  { value: 'ielts', label: 'IELTS Preparation' },
  { value: 'toeic', label: 'TOEIC Preparation' },
  { value: 'communication', label: 'Daily Communication' },
  { value: 'business', label: 'Business English' },
];

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    learningGoals: user?.learningGoals || '',
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/me/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats');
      }
    };
    fetchStats();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put('/users/me', formData);
      setAuth(response.data, localStorage.getItem('token') || '');
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const response = await api.post('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAuth(response.data.user, localStorage.getItem('token') || '');
      toast.success('Avatar updated');
    } catch (error) {
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header Profile */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 bg-card p-8 rounded-2xl border shadow-sm">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-primary/10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
            <Camera className="w-5 h-5" />
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={isUploading} />
          </label>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto md:mx-0 py-1 px-3">
              {user.level} Level
            </Badge>
            {user.isPremium && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                PRO Member
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-foreground">{user.streak}</span> Day Streak
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-foreground">{user.xp}</span> Total XP
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-foreground">{(user as any).badges?.length || 0}</span> Badges
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="w-4 h-4" /> Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>Update your personal information and learning preferences.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Display Name</Label>
                    <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-goal">Learning Goal</Label>
                    <Select value={formData.learningGoals} onValueChange={(val) => setFormData({...formData, learningGoals: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOALS.map((g) => (
                          <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <Tabs defaultValue="stats" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="badges">My Badges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedLessons || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Keep going!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Words Learned</CardTitle>
                <Zap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.vocabLearned || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">+12 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.studyTimeMinutes || 0}m</div>
                <p className="text-xs text-muted-foreground mt-1">Consistency is key</p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Streak Progress</CardTitle>
              <CardDescription>Daily activity for the last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px] flex items-end justify-between gap-2 px-8">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className={`w-full rounded-t-lg transition-all ${i === 6 ? 'bg-primary' : 'bg-muted'}`} 
                    style={{ height: `${[20, 45, 30, 80, 55, 90, 40][i]}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground uppercase">Day {i+1}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badges">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {((user as any).badges && (user as any).badges.length > 0) ? (
              (user as any).badges.map((ub: any) => (
                <Card key={ub.id} className="aspect-square flex flex-col items-center justify-center p-4 text-center group hover:border-primary transition-colors">
                  <div className="w-16 h-16 bg-muted rounded-full mb-3 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Trophy className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-sm font-bold">{ub.badge.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-1">{new Date(ub.earnedAt).toLocaleDateString()}</span>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-muted-foreground bg-muted/20 rounded-xl border-2 border-dashed">
                <p>No badges earned yet. Complete lessons to unlock them!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
