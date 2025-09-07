export interface PostData {
  title: string;
  image: string;
  body: string;
  tags: string[];
  uid: string;
  createdBy: string;
}

export interface Post extends PostData {
  id: string;
}
