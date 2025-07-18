import { useState } from 'react';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSave: (projectData: Partial<Project>) => Promise<boolean>;
  onDelete?: (projectId: string) => Promise<boolean>;
  mode: 'create' | 'edit';
}

const ProjectFormDialog = ({
  open,
  onOpenChange,
  project,
  onSave,
  onDelete,
  mode,
}: ProjectFormDialogProps) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    effort: project?.effort || 1,
    benefit: project?.benefit || 1,
    discovery_scope: project?.discovery_scope || '',
    complexity_factors: project?.complexity_factors || '',
    blockers: project?.blockers || '',
    needs_dependencies: project?.needs_dependencies || '',
    next_steps: project?.next_steps || '',
    research_focus: project?.research_focus || '',
    assigned_date: project?.assigned_date || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    const success = await onSave(formData);
    if (success) {
      onOpenChange(false);
      // Reset form if creating new project
      if (mode === 'create') {
        setFormData({
          title: '',
          effort: 1,
          benefit: 1,
          discovery_scope: '',
          complexity_factors: '',
          blockers: '',
          needs_dependencies: '',
          next_steps: '',
          research_focus: '',
          assigned_date: null,
        });
      }
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!project?.id || !onDelete) return;
    
    setIsDeleting(true);
    const success = await onDelete(project.id);
    if (success) {
      onOpenChange(false);
    }
    setIsDeleting(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      assigned_date: date ? format(date, 'yyyy-MM-dd') : null,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create New Project' : 'Edit Project'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Fill in the details for your new project.' 
              : 'Update your project details.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter project title"
              required
            />
          </div>

          {/* Effort and Benefit Sliders */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>Effort: {formData.effort}/10</Label>
              <Slider
                value={[formData.effort]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, effort: value[0] }))}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Benefit: {formData.benefit}/10</Label>
              <Slider
                value={[formData.benefit]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, benefit: value[0] }))}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Assigned Date */}
          <div className="space-y-2">
            <Label>Assigned Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.assigned_date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.assigned_date ? (
                    format(new Date(formData.assigned_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.assigned_date ? new Date(formData.assigned_date) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Text Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="discovery_scope">Discovery and Scope</Label>
              <Textarea
                id="discovery_scope"
                value={formData.discovery_scope}
                onChange={(e) => setFormData(prev => ({ ...prev, discovery_scope: e.target.value }))}
                placeholder="Describe the project scope and discovery phase..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity_factors">Complexity Factors</Label>
              <Textarea
                id="complexity_factors"
                value={formData.complexity_factors}
                onChange={(e) => setFormData(prev => ({ ...prev, complexity_factors: e.target.value }))}
                placeholder="What makes this project complex?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blockers">Blockers</Label>
              <Textarea
                id="blockers"
                value={formData.blockers}
                onChange={(e) => setFormData(prev => ({ ...prev, blockers: e.target.value }))}
                placeholder="Current blockers or obstacles..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="needs_dependencies">Needs and Dependencies</Label>
              <Textarea
                id="needs_dependencies"
                value={formData.needs_dependencies}
                onChange={(e) => setFormData(prev => ({ ...prev, needs_dependencies: e.target.value }))}
                placeholder="What does this project depend on?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_steps">Next Steps</Label>
              <Textarea
                id="next_steps"
                value={formData.next_steps}
                onChange={(e) => setFormData(prev => ({ ...prev, next_steps: e.target.value }))}
                placeholder="What are the immediate next steps?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="research_focus">Research Focus</Label>
              <Textarea
                id="research_focus"
                value={formData.research_focus}
                onChange={(e) => setFormData(prev => ({ ...prev, research_focus: e.target.value }))}
                placeholder="Areas requiring research or investigation..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div>
              {mode === 'edit' && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Project'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
              >
                {isSubmitting 
                  ? (mode === 'create' ? 'Creating...' : 'Saving...')
                  : (mode === 'create' ? 'Create Project' : 'Save Changes')
                }
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;