export interface Comment {
    type: 'LineComment' | 'BlockComment',
    raw: string;
    loc: {
        start: {
            line: number,
            column: number,
        },
        end: {
            line: number,
            column: number,
        },
    },
    range: {
        start: number,
        end: number,
    },
}

export default function stripComment(text: string, option?: {
    comment? : boolean,
    range? : boolean,
    loc? : boolean,
    raw? : boolean,
}) : {
    text: string,
    comments: Array<Comment>,
};
