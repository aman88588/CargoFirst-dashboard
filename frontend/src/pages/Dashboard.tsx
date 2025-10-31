import { useState, useEffect } from 'react';
import { dashboardAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Pencil, Trash2, Plus, Calendar, Building2 } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  _id: string;
  jobTitle: string;
  jobDescription: string;
  lastDateToApply: string;
  companyName: string;
}

const Dashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    lastDateToApply: '',
    companyName: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.listJobs();
      console.log('Full API Response:', response); // Log full response
      console.log('Jobs API Response:', response.data); // Log response.data
      
      // Handle different response structures
      let jobsArray = [];
      
      // Check various possible structures
      if (Array.isArray(response.data)) {
        // Response is directly an array
        jobsArray = response.data;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Response is { data: [...] }
        jobsArray = response.data.data;
      } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
        // Response is { jobs: [...] }
        jobsArray = response.data.jobs;
      } else if (response.data.data?.jobs && Array.isArray(response.data.data.jobs)) {
        // Response is { data: { jobs: [...] } }
        jobsArray = response.data.data.jobs;
      } else {
        console.error('Unexpected response structure:', response.data);
      }
      
      console.log('Extracted jobs array:', jobsArray);
      setJobs(jobsArray);
    } catch (error) {
      console.error('Fetch jobs error:', error);
      toast.error('Failed to fetch jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobTitle || !formData.jobDescription || !formData.lastDateToApply || !formData.companyName) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await dashboardAPI.updateJob(editingId, formData);
        toast.success('Job updated successfully');
        setEditingId(null);
      } else {
        await dashboardAPI.createJob(formData);
        toast.success('Job created successfully');
      }
      setFormData({ jobTitle: '', jobDescription: '', lastDateToApply: '', companyName: '' });
      fetchJobs();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || (editingId ? 'Failed to update job' : 'Failed to create job'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (job: Job) => {
    setEditingId(job._id);
    setFormData({
      jobTitle: job.jobTitle,
      jobDescription: job.jobDescription,
      lastDateToApply: job.lastDateToApply.split('T')[0],
      companyName: job.companyName,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await dashboardAPI.deleteJob(id);
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ jobTitle: '', jobDescription: '', lastDateToApply: '', companyName: '' });
  };

  return (
    <div className="container max-w-6xl py-8">
      {/* Job Form */}
      <Card className="mb-8 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            {editingId ? 'Edit Job Posting' : 'Create New Job Posting'}
          </CardTitle>
          <CardDescription>
            {editingId ? 'Update the job details below' : 'Fill in the details to post a new job'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Tech Innovations Inc"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Describe the role, responsibilities, and requirements..."
                rows={4}
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastDateToApply">Last Date to Apply</Label>
              <Input
                id="lastDateToApply"
                type="date"
                value={formData.lastDateToApply}
                onChange={(e) => setFormData({ ...formData, lastDateToApply: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{editingId ? 'Update Job' : 'Create Job'}</>
                )}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Job History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Job History</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="py-8 text-center text-muted-foreground">
              No jobs posted yet. Create your first job above!
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job) => (
              <Card key={job._id} className="shadow-md transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">{job.jobTitle}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {job.companyName}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{job.jobDescription}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Apply by: {new Date(job.lastDateToApply).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(job)}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(job._id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;