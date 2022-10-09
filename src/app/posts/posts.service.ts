import { HttpClient } from '@angular/common/http';
import { Post } from './post';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private updatedPosts = new Subject<{ posts: Post[]; totalPosts: number }>();

  constructor(private http: HttpClient, private _router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pagesize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{
        posts: [
          {
            _id: string;
            title: string;
            content: string;
            imagePath: string;
          }
        ];
        totalPosts: number;
      }>('http://localhost:3000/api/v1/posts' + queryParams)
      .pipe(
        map((data) => {
          return {
            posts: data.posts.map((post) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
              };
            }),
            totalPosts: data.totalPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.updatedPosts.next({
          posts: [...this.posts],
          totalPosts: postData.totalPosts,
        });
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
        this._router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(
      `http://localhost:3000/api/v1/post/${id}`
    );
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
