'use client';

import React, { JSX } from 'react';

export interface LexicalNode {
    type: string;
    tag?: string | number;
    listType?: string;
    url?: string;
    format?: string[] | string;
    text?: string;
    children?: LexicalNode[];
    value?: {
        filename?: string;
        url?: string;
        [key: string]: unknown;
    }; // Added for upload nodes
}

export interface LexicalRoot {
    root?: {
        children?: LexicalNode[];
    };
}

export type SerializedEditorState = LexicalRoot | string | null | undefined;

export const RichTextRenderer: React.FC<{
    data: SerializedEditorState;
}> = ({ data }) => {
    if (!data) {
        return (
            <p className="font-medium text-muted-foreground italic">
                No description provided
            </p>
        );
    }

    try {
        const parsed: LexicalRoot =
            typeof data === 'string' ? JSON.parse(data) : data;
        const content = parsed?.root?.children || [];

        return (
            <div className="prose max-w-none">
                {content.map((node, i) => renderNode(node, i))}
            </div>
        );
    } catch (err) {
        console.error('Failed to render RichText:', err);
        return <p>Error rendering content</p>;
    }
};

function renderNode(node: LexicalNode, key: number): React.ReactNode {
    if (!node) return null;

    switch (node.type) {
        case 'paragraph':
            return <p key={key}>{renderChildren(node.children)}</p>;

        case 'heading': {
            let tagNum = 2; // Default to h2
            if (typeof node.tag === 'string') {
                const match = node.tag.match(/^h([1-6])$/);
                if (match && match[1]) {
                    tagNum = parseInt(match[1], 10);
                }
            } else if (typeof node.tag === 'number' && node.tag >= 1 && node.tag <= 6) {
                tagNum = node.tag;
            }
            const HeadingTag = `h${tagNum}` as keyof JSX.IntrinsicElements;
            return (
                <HeadingTag key={key}>{renderChildren(node.children)}</HeadingTag>
            );
        }

        case 'list':
            if (node.listType === 'bullet') {
                return (
                    <ul key={key}>
                        {node.children?.map((c, i) => renderNode(c, i))}
                    </ul>
                );
            }
            if (node.listType === 'number') {
                return (
                    <ol key={key}>
                        {node.children?.map((c, i) => renderNode(c, i))}
                    </ol>
                );
            }
            return null;

        case 'listitem':
            return <li key={key}>{renderChildren(node.children)}</li>;

        case 'quote':
            return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;

        case 'link':
            return (
                <a
                    key={key}
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {renderChildren(node.children)}
                </a>
            );

        case 'upload': {
            if (!node.value?.filename || !node.value?.url) {
                return null;
            }
            return (
                <a
                    key={key}
                    href={node.value.url}
                    download={node.value.filename}
                    className="text-blue-600 hover:underline"
                >
                    {node.value.filename}
                </a>
            );
        }

        case 'text': {
            let textElement: React.ReactNode = node.text ?? '';
            if (node.format) {
                let formats: string[];
                if (Array.isArray(node.format)) {
                    formats = node.format;
                } else if (typeof node.format === 'string') {
                    formats = node.format.split(/\s+/).filter(Boolean);
                } else {
                    formats = [];
                }
                if (formats.includes('bold')) {
                    textElement = <strong>{textElement}</strong>;
                }
                if (formats.includes('italic')) {
                    textElement = <em>{textElement}</em>;
                }
                if (formats.includes('underline')) {
                    textElement = <u>{textElement}</u>;
                }
            }
            return <React.Fragment key={key}>{textElement}</React.Fragment>;
        }

        default:
            // For unknown node types, just render children
            return (
                <React.Fragment key={key}>
                    {renderChildren(node.children)}
                </React.Fragment>
            );
    }
}

function renderChildren(children?: LexicalNode[]): React.ReactNode {
    if (!children) return null;
    return children.map((child, i) => renderNode(child, i));
}