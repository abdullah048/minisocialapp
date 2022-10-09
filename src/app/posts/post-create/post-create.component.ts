import { PostsService } from './../posts.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'social-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  private _mode = 'create';
  private _postId: string = '';
  post: Post = {
    id: '',
    title: '',
    content: '',
    imagePath: '',
  };
  isLoading = false;
  form: FormGroup = new FormGroup({
    title: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    content: new FormControl(null, {
      validators: [Validators.required, Validators.minLength(5)],
    }),
    image: new FormControl(null, {
      validators: [Validators.required],
      asyncValidators: [mimeType],
    }),
  });
  imagePreview: string = '';

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this._mode === 'create') {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.editPost(
        this._postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  handleChange(event: Event) {
    const file = (<HTMLInputElement>event.target).files?.item(0);
    this.form.patchValue({ image: file });
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string>reader.result;
    };
    reader.readAsDataURL(<Blob>file);
  }

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('postId')) {
        this._mode = 'edit';
        this._postId = params.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this._postId).subscribe((post) => {
          this.isLoading = false;
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this._mode = 'create';
        this._postId = '';
      }
    });
  }
}
