// import { Box } from "@radix-ui/themes";

import Markdown from "react-markdown";
import { Prose } from "~/components/Prose";
import { copyTextToClipboard } from "~/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type MarkdownViewProps = {
  document: string;
};

export const MarkdownView = ({ document }: MarkdownViewProps) => {
  return (    
      <Prose>
        <Markdown
          children={document}
          //   remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, style, ...rest }) {
              const match = /language-(\w+)/.exec(className || "");

              //can we match a node by the actual content? i.e. is a code link
              return match ? (
                //@ts-ignore
                <SyntaxHighlighter
                  {...rest}
                  PreTag="div"
                  lineProps={{
                    style: {
                      wordBreak: "break-all",
                      whiteSpace: "pre-wrap",
                    },
                  }}
                  wrapLines={true}
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={oneDark}
                />
              ) : (
                //Could also do on click of code file links "expand"
                <code
                  onClick={() => copyTextToClipboard(children as string)}
                  {...rest}
                  className={`cursor-pointer inlineCode ${className}`}
                >
                  {children}
                </code>
              );
            },
          }}
        />
      </Prose>    
  );
};
