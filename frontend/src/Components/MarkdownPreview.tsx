import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  onInternalLinkClick: (href: string) => void;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, onInternalLinkClick }) => {
  const CustomLink = ({ href, children, ...props }: any) => {
    const handleClick = (e: React.MouseEvent) => {
      if (!href) return;

      if (href.startsWith("http://") || href.startsWith("https://")) {
        return;
      }

      e.preventDefault();
      onInternalLinkClick(href);
    };

    const isExternal = href?.startsWith("http");

    return (
      <a
        href={href}
        onClick={handleClick}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  };

  return (
    <div className="absolute inset-0 overflow-y-auto markdown-preview p-8">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: CustomLink
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
