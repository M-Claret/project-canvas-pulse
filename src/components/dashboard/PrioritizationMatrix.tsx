import { Project, PROJECT_COLORS } from '@/types/project';

interface PrioritizationMatrixProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const PrioritizationMatrix = ({ projects, onProjectClick }: PrioritizationMatrixProps) => {
  const gridSize = 300; // Size of the matrix grid
  const ballBaseSize = 20; // Base size for balls
  const ballMaxSize = 40; // Maximum size for balls

  // Function to calculate ball size based on effort + benefit
  const getBallSize = (effort: number, benefit: number) => {
    const total = effort + benefit;
    const maxTotal = 20; // Maximum possible (10 + 10)
    const sizeMultiplier = total / maxTotal;
    return ballBaseSize + (ballMaxSize - ballBaseSize) * sizeMultiplier;
  };

  // Function to calculate position based on effort and benefit
  const getPosition = (effort: number, benefit: number, index: number) => {
    // Convert 0-10 scale to pixel positions within the grid
    const x = (effort / 10) * (gridSize - ballMaxSize) + ballMaxSize / 2;
    const y = gridSize - (benefit / 10) * (gridSize - ballMaxSize) - ballMaxSize / 2;
    
    // Add slight offset to prevent overlapping
    const offset = (index % 3 - 1) * 5;
    
    return { x: x + offset, y: y + offset };
  };

  if (projects.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Prioritization Matrix</h2>
        <div 
          className="relative bg-muted/30 rounded-lg flex items-center justify-center"
          style={{ height: gridSize + 40 }}
        >
          <p className="text-muted-foreground">No projects to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Prioritization Matrix</h2>
      
      {/* Matrix Container */}
      <div className="relative">
        {/* Grid Background */}
        <div 
          className="relative bg-muted/30 rounded-lg border-2 border-dashed border-muted"
          style={{ height: gridSize + 40, width: gridSize + 40 }}
        >
          {/* Axis Labels */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
            Effort →
          </div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs text-muted-foreground"
            style={{ transformOrigin: 'center' }}
          >
            ← Benefit
          </div>
          
          {/* Quadrant Labels */}
          <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">
            High Benefit
            <br />
            Low Effort
          </div>
          <div className="absolute top-2 right-2 text-xs font-medium text-muted-foreground text-right">
            High Benefit
            <br />
            High Effort
          </div>
          <div className="absolute bottom-2 left-2 text-xs font-medium text-muted-foreground">
            Low Benefit
            <br />
            Low Effort
          </div>
          <div className="absolute bottom-2 right-2 text-xs font-medium text-muted-foreground text-right">
            Low Benefit
            <br />
            High Effort
          </div>

          {/* Project Balls */}
          {projects.map((project, index) => {
            const position = getPosition(project.effort, project.benefit, index);
            const size = getBallSize(project.effort, project.benefit);
            const color = PROJECT_COLORS[project.color_index % PROJECT_COLORS.length];
            
            return (
              <div
                key={project.id}
                className="absolute cursor-pointer group transition-all duration-200 hover:scale-110 hover:z-10"
                style={{
                  left: position.x,
                  top: position.y,
                  width: size,
                  height: size,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => onProjectClick(project)}
              >
                {/* Ball */}
                <div
                  className="w-full h-full rounded-full border-2 border-white shadow-lg flex items-center justify-center relative"
                  style={{ backgroundColor: color }}
                >
                  {/* Effort/Benefit Label */}
                  <div className="absolute -top-1 -right-1 bg-background border rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {project.effort}/{project.benefit}
                  </div>
                  
                  {/* Project Title Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background border rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg">
                      {project.title}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PrioritizationMatrix;