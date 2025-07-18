import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
import Header from '@/components/dashboard/Header';
import PrioritizationMatrix from '@/components/dashboard/PrioritizationMatrix';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const { projects, loading, createProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleCreateProject = async () => {
    await createProject({
      title: 'New Project',
      effort: 5,
      benefit: 5,
    });
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    // TODO: Open project card modal
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Create Project Button */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Projects</h2>
            <p className="text-muted-foreground mt-1">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <Button onClick={handleCreateProject} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Prioritization Matrix */}
        <PrioritizationMatrix 
          projects={projects} 
          onProjectClick={handleProjectClick}
        />

        {/* Timeline Section - TODO */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Timeline</h2>
          <p className="text-muted-foreground">Timeline view coming soon...</p>
        </div>

        {/* Backlog Section - TODO */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Backlog</h2>
          <p className="text-muted-foreground">Backlog view coming soon...</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
