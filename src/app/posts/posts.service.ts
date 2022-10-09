import { HttpClient } from '@angular/common/http';
import { Post } from './post';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<Post[]>();

  constructor(private http: HttpClient, private _router: Router) {}

  getPosts() {
    this.http
      .get<
        [{ _id: string; title: string; content: string; imagePath: string }]
      >('http://localhost:3000/api/v1/posts')
      .pipe(
        map((data) => {
          return data.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.updatedPosts.next([...this.posts]);
      });
  }

  updatePostListener() {
    return this.updatedPosts.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/v1/post/new',
        formData
      )
      .subscribe((postData) => {
        const post: Post = {
          id: postData.post?.id,
          title,
          content,
          imagePath: postData.post?.imagePath,
        };
        this.posts.push(post);
        this.updatedPosts.next([...this.posts]);
        this._router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/api/v1/post/${id}`)
      .subscribe((msg) => {
        console.log(msg.message);
        const updatedPosts = this.posts.filter((post) => post.id !== id);
        this.posts = updatedPosts;
        this.updatedPosts.next([...this.posts]);
      });
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }
    this.http
      .put<{ message: string }>(
        `http://localhost:3000/api/v1/post/${id}`,
        postData
      )
      .subscribe((msg) => {
        console.log(msg.message);
        this._router.navigate(['/']);
      });
  }

  getPost(id: string) {
    // return { ...this.posts.find((p) => p.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/v1/post/' + id);
  }
}
