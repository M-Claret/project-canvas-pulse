import { useState } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';
import Header from '@/components/dashboard/Header';
import PrioritizationMatrix from '@/components/dashboard/PrioritizationMatrix';
import ProjectFormDialog from '@/components/dashboard/ProjectFormDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const handleCreateProject = () => {
    setSelectedProject(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleProjectClick = (project: Project) => {
    handleEditProject(project);
  };

  const handleSaveProject = async (projectData: Partial<Project>) => {
    if (formMode === 'create') {
      const result = await createProject(projectData as typeof projectData & { title: string });
      return !!result;
    } else if (selectedProject) {
      const result = await updateProject(selectedProject.id, projectData);
      return !!result;
    }
    return false;
  };

  const handleDeleteProject = async (projectId: string) => {
    return await deleteProject(projectId);
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

        {/* Project Form Dialog */}
        <ProjectFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          project={selectedProject}
          onSave={handleSaveProject}
          onDelete={formMode === 'edit' ? handleDeleteProject : undefined}
          mode={formMode}
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
