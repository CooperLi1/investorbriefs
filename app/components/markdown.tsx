import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom'; // For internal navigation (React Router)

const CustomMarkdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      children={content}
      components={{
        // Handle external links
        a: ({ node, ...props }: any) => {
          // Check if the link is internal or external
          const isExternal = /^(https?:|mailto:)/.test(props.href);

          return isExternal ? (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#1D4ED8',
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            />
          ) : (
            // Internal link using React Router's Link component
            <Link
              to={props.href}
              style={{
                color: '#1D4ED8',
                textDecoration: 'underline',
                fontWeight: 'bold',
              }}
            >
              {props.children}
            </Link>
          );
        },

        // Customize other markdown elements like headings, code, etc.
        h1: ({ node, ...props }: any) => (
          <h1 {...props} style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }} />
        ),
        h2: ({ node, ...props }: any) => (
          <h2 {...props} style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }} />
        ),
        h3: ({ node, ...props }: any) => (
          <h3 {...props} style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937' }} />
        ),
        strong: ({ node, ...props }: any) => (
          <strong {...props} style={{ fontWeight: '600', color: '#1f2937' }} />
        ),
        em: ({ node, ...props }: any) => (
          <em {...props} style={{ fontStyle: 'italic', color: '#1f2937' }} />
        ),
        code: ({ node, inline, ...props }: any) => (
          <code
            {...props}
            style={{
              backgroundColor: '#f4f4f4',
              padding: '0.2rem 0.4rem',
              borderRadius: '4px',
              fontSize: '1rem',
              color: '#D63A00',
            }}
          />
        ),
        blockquote: ({ node, ...props }: any) => (
          <blockquote
            {...props}
            style={{
              borderLeft: '4px solid #ddd',
              paddingLeft: '1rem',
              fontStyle: 'italic',
              color: '#1f2937', // Text color for blockquotes
            }}
          />
        ),
        ul: ({ node, ...props }: any) => (
          <ul {...props} style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#1f2937' }} />
        ),
        ol: ({ node, ...props }: any) => (
          <ol {...props} style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', color: '#1f2937' }} />
        ),
        li: ({ node, ...props }: any) => (
          <li {...props} style={{ marginBottom: '0.5rem', color: '#1f2937' }} />
        ),
      }}
    />
  );
};

export default CustomMarkdown;
