import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';

const CustomMarkdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      children={content}
      components={{
        a: ({ node, ...props }: any) => {
          const isExternal = /^(https?:|mailto:)/.test(props.href);

          return isExternal ? (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 underline font-bold"
            />
          ) : (
            <Link to={props.href} className="text-blue-600 dark:text-blue-400 underline font-bold">
              {props.children}
            </Link>
          );
        },
        h1: ({ node, ...props }: any) => (
          <h1 {...props} className="text-4xl font-bold text-gray-900 dark:text-white" />
        ),
        h2: ({ node, ...props }: any) => (
          <h2 {...props} className="text-3xl font-bold text-gray-900 dark:text-white" />
        ),
        h3: ({ node, ...props }: any) => (
          <h3 {...props} className="text-2xl font-bold text-gray-900 dark:text-white" />
        ),
        strong: ({ node, ...props }: any) => (
          <strong {...props} className="font-semibold text-gray-900 dark:text-white" />
        ),
        em: ({ node, ...props }: any) => (
          <em {...props} className="italic text-gray-900 dark:text-white" />
        ),
        code: ({ node, inline, ...props }: any) => (
          <code
            {...props}
            className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 rounded"
          />
        ),
        blockquote: ({ node, ...props }: any) => (
          <blockquote
            {...props}
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-900 dark:text-white"
          />
        ),
        ul: ({ node, ...props }: any) => (
          <ul {...props} className="list-disc pl-5 text-gray-900 dark:text-white" />
        ),
        ol: ({ node, ...props }: any) => (
          <ol {...props} className="list-decimal pl-5 text-gray-900 dark:text-white" />
        ),
        li: ({ node, ...props }: any) => (
          <li {...props} className="mb-1 text-gray-900 dark:text-white" />
        ),
      }}
    />
  );
};

export default CustomMarkdown;
