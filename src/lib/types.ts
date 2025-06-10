export interface User {
  access: string;
  refresh: string;
  user: {
    pk: number;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
  };
}
export interface Movie {
  id: number;
  film: {
    id: number;
    title: string;
    release_date: string;
    language: string;
    overview: string;
    poster_url: string;
    tmdb_id: number;
    created_at: string;
    modified_at: string;
    actors_count: number;
    directors_count: number;
    categories_count: number;
  };
  user_username: string;
  review?: number;
  created_at: string;
  modified_at: string;
}

export interface StreamingService {
  id: number;
  created_at: string;
  modified_at: string;
  name: string;
  tmdb_provider_id: number;
  logo_path: string;
}
