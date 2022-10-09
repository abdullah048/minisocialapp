import { PostsService } from './../posts.service';
import { Post } from './../post';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'social-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postSub = new Subscription();
  isLoading = false;
  totalPosts = 0;
  pageSize = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postsService: PostsService) {}

  onPageChange(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.pageSize = pageData.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postsService.deletePost(id).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage);
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.postSub = this.postsService
      .updatePostListener()
      .subscribe((postData: { posts: Post[]; totalPosts: number }) => {
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
