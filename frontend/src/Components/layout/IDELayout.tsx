import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { ReactNode } from "react";

interface IDELayoutProps {
  sidebar: ReactNode;
  editor: ReactNode;
  terminal: ReactNode;
  preview: ReactNode;
}

export const IDELayout = ({ sidebar, editor, terminal, preview }: IDELayoutProps) => {
  return (
    <div className="flex flex-col h-screen w-screen text-jb-text overflow-hidden">
      {/* Main Workspace */}
      <div className="flex-1 min-h-0 p-2"> {/* Added outer padding */}
        <Allotment separator={false}>
          {/* Sidebar */}
          <Allotment.Pane minSize={200} preferredSize={250} maxSize={400}>
            <div className="h-full pr-2"> {/* Right gap for sidebar */}
              {sidebar}
            </div>
          </Allotment.Pane>
          
          {/* Editor + Terminal Group */}
          <Allotment.Pane minSize={400}>
            <div className="h-full flex flex-col">
              <Allotment vertical separator={false}>
                <Allotment.Pane minSize={200}>
                  <div className="h-full pb-2"> {/* Bottom gap for editor */}
                    {editor}
                  </div>
                </Allotment.Pane>
                <Allotment.Pane minSize={100} preferredSize={200}>
                  {terminal}
                </Allotment.Pane>
              </Allotment>
            </div>
          </Allotment.Pane>

          {/* Preview */}
          <Allotment.Pane minSize={300} preferredSize={450}>
            <div className="h-full pl-2"> {/* Left gap for preview */}
              {preview}
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
