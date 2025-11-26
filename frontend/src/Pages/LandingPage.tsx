import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Code2, Terminal, Cpu, Globe, Server, FileJson, FileCode, Layers } from "lucide-react";
import { cn } from "../lib/utils";
import { buildApiUrl } from "../utils/api";
import { PlaygroundTemplate } from "../Types/types";

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  react: <Code2 className="w-8 h-8 text-blue-400" />,
  vue: <Layers className="w-8 h-8 text-green-400" />,
  angular: <Cpu className="w-8 h-8 text-red-500" />,
  svelte: <Code2 className="w-8 h-8 text-orange-400" />,
  javascript: <FileCode className="w-8 h-8 text-yellow-400" />,
  typescript: <FileCode className="w-8 h-8 text-blue-500" />,
  node: <Server className="w-8 h-8 text-green-500" />,
  express: <Server className="w-8 h-8 text-gray-400" />,
};

export const LandingPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<PlaygroundTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(buildApiUrl("/templates"))
      .then((resp) => {
        const fetchedTemplates: PlaygroundTemplate[] = resp.data?.templates || [];
        setTemplates(fetchedTemplates);
        setLoadError(null);
      })
      .catch((error) => {
        console.error(error);
        setLoadError("Failed to load templates");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleCreatePlayground = (templateId: string) => {
    if (!templateId) return;

    axios
      .post(buildApiUrl("/playgrounds"), { template: templateId })
      .then((resp) => {
        navigate(`/playground/${resp.data.playgroundId}`);
      })
      .catch((error) => {
        console.error(error);
        // Ideally show a toast here
      });
  };

  return (
    <div className="h-screen bg-jb-dark text-jb-text flex flex-col items-center py-4 px-4 overflow-hidden">
      <div className="max-w-5xl w-full flex flex-col h-full">

        {/* Header */}
        <div className="text-center space-y-2 flex-shrink-0 mb-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Choose a starting template
          </h1>
          <p className="text-sm text-jb-text-muted max-w-2xl mx-auto">
            We scaffold the project, install dependencies, and start the dev server for you.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-4">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-jb-accent"></div>
            </div>
          ) : loadError ? (
            <div className="text-center text-red-400 py-10">
              {loadError}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map((template) => {
                const icon = TEMPLATE_ICONS[template.id] ?? <Terminal className="w-6 h-6 text-gray-400" />;

                return (
                  <button
                    key={template.id}
                    onClick={() => handleCreatePlayground(template.id)}
                    className="group flex flex-col text-left bg-jb-panel hover:bg-jb-panel-hover border border-jb-border rounded-lg p-4 transition-all hover:border-jb-accent/50 hover:shadow-lg hover:-translate-y-1 h-fit"
                  >
                    <div className="flex items-start justify-between w-full mb-3">
                      <div className="p-1.5 bg-jb-dark rounded-md border border-jb-border group-hover:border-jb-accent/30 transition-colors">
                        {icon}
                      </div>
                      <span className={cn(
                        "text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border",
                        template.hasPreview
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      )}>
                        {template.hasPreview ? "Preview" : "Console"}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-jb-accent transition-colors">
                      {template.title}
                    </h3>

                    <p className="text-xs text-jb-text-muted line-clamp-2 mb-3">
                      {template.description}
                    </p>

                    {template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-jb-border/50">
                        {template.tags.map((tag) => (
                          <span key={`${template.id}-${tag}`} className="text-[10px] text-jb-text-muted bg-jb-dark px-1.5 py-0.5 rounded border border-jb-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
