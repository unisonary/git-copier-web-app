export interface RepoRequest {
    name: string;
    sourceUrl: string;
    newUrl: string;
}

export interface RepoResponse {
    success: boolean;
    message: string;
    data?: any; // Optional field for additional data
}