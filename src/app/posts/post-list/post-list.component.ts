import { PostsService } from './../posts.service';
import { Post } from './../post';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'social-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub = new Subscription();
  isLoading = false;
  totalPosts = 10;

  constructor(public postsService: PostsService) {}

  onDelete(id: string) {
    this.postsService.deletePost(id);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postSub = this.postsService
      .updatePostListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
