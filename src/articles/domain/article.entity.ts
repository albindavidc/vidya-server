import { ArticleStatus } from '../article-status.enum';

export class ArticleEntity {
  private constructor(
    public readonly id: string,
    private _title: string,
    private _description: string | undefined,
    private _content: string,
    private _summary: string | undefined,
    private _status: ArticleStatus,
    public readonly authorId: string,
    private _slug: string,
    private _readTime: number,
    private _deletedAt: Date | undefined,
    public readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  static create(props: {
    id?: string;
    authorId: string;
    title: string;
    description?: string;
    content: string;
    summary?: string;
    status?: ArticleStatus;
    slug?: string;
    readTime?: number;
  }): ArticleEntity {
    if (!props.title || !props.content) {
      throw new Error('Title and content are required to create an article.');
    }
    const now = new Date();
    return new ArticleEntity(
      props.id || '',
      props.title,
      props.description,
      props.content,
      props.summary,
      props.status ?? ArticleStatus.DRAFT,
      props.authorId,
      props.slug || '',
      props.readTime ?? 1,
      undefined,
      now,
      now,
    );
  }

  static fromPersistence(props: {
    id: string;
    title: string;
    description?: string;
    content: string;
    summary?: string;
    status: ArticleStatus;
    authorId: string;
    slug: string;
    readTime: number;

    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
  }): ArticleEntity {
    return new ArticleEntity(
      props.id,
      props.title,
      props.description,
      props.content,
      props.summary,
      props.status,
      props.authorId,
      props.slug,
      props.readTime,
      props.deletedAt,
      props.createdAt,
      props.updatedAt,
    );
  }

  updateDetails(data: {
    title?: string;
    description?: string;
    content?: string;
    summary?: string;

    slug?: string;
    status?: ArticleStatus;
  }) {
    if (data.title !== undefined) this._title = data.title;
    if (data.description !== undefined) this._description = data.description;
    if (data.content !== undefined) this._content = data.content;
    if (data.summary !== undefined) this._summary = data.summary;

    if (data.slug !== undefined) this._slug = data.slug;
    if (data.status !== undefined) this._status = data.status;
    this._updatedAt = new Date();
  }

  get title() {
    return this._title;
  }
  get description() {
    return this._description;
  }
  get content() {
    return this._content;
  }
  get summary() {
    return this._summary;
  }
  get status() {
    return this._status;
  }
  get slug() {
    return this._slug;
  }

  get readTime() {
    return this._readTime;
  }

  get deletedAt() {
    return this._deletedAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
}
