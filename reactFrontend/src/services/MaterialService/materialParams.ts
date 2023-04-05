interface Params {
    depId: string;
}

export interface FileParams extends Params {
    fileName: string;
}

export interface PostParams extends Params {
    data: FormData;
}
