import { Comment } from 'parse-comment-es6';

export interface Identifier {
    type: 'Import' | 'ImportedDefaultBinding' | 'NameSpaceImport' | 'NamedImports' | 'From' | 'ModuleSpecifier';
    identifier: string;
    loc: {
        start: {
            line: number,
            column: number,
        },
        end: {
            line: number,
            column: number,
        },
    }
    range: {
        start: number,
        end: number,
    };
}

export interface IdentifierComment extends Comment {
    identifier: Identifier;
}

export interface ImportDeclaration {
    importedDefaultBinding: string;
    namedImports: Array<string>;
    nameSpaceImport: string;
    loc: {
        start: {
            line: number,
            column: number,
        },
        end: {
            line: number,
            column: number,
        },
    }
    range: {
        start: number,
        end: number,
    };
    raw: string;
    middleComments: any;
    leadComments: Array<Comment>;
    trailingComments: Array<Comment>;
    moduleSpecifier: string;
    error: number;
}

export default function parseImport(text: string): Array<ImportDeclaration>;
