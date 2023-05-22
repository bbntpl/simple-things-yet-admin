import BlogComment from './BlogComment';

export default function BlogCommentList({ comments }) {
	return (
		<div>
			{comments.map(comment => (
				<BlogComment key={comment.id} comment={comment} />
			))}
		</div>
	);
}