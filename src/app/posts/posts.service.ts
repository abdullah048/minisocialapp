import { Post } from './post';
import { Subject } from 'rxjs';

export class PostsService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<Post[]>();

  getPosts() {
    return [...this.posts];
  }

  updatePostListener() {
    return this.updatedPosts.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      title: title,
      content: content,
    };
    this.posts.push(post);
    this.updatedPosts.next([...this.posts]);
  }
}
