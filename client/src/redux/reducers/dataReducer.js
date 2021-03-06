import {
	SET_SEEKS,
	SET_SEEK,
	LOADING_DATA,
	UPVOTE_SEEK,
	DOWNVOTE_SEEK,
	DELETE_SEEK,
	CLEAR_SEEK,
	POST_SEEK,
	EDIT_SEEK,
	SET_EDITED_TO_FALSE,
	POST_COMMENT,
	DELETE_COMMENT,
	UPVOTE_COMMENT,
	DOWNVOTE_COMMENT,
	EDIT_COMMENT,
	UPLOAD_PHOTO,
	SET_MULTIPLE_ERRORS,
	CLEAR_MULTIPLE_ERRORS,
} from '../types';

const initialState = {
	seeks: [],
	seek: {},
	loading: false,
	edited: false,
	errors: {
		title: null,
		body: null,
	},
};

const reducer = (state = initialState, action) => {
	const isSeekEmpty = JSON.stringify(state.seek) === '{}' || !state.seek;
	switch (action.type) {
		case LOADING_DATA:
			return {
				...state,
				loading: true,
			};
		case UPLOAD_PHOTO:
			let userIndex = state.seeks.findIndex(
				(seek) => seek.author._id === action.user
			);

			if (userIndex !== -1) state.seeks[userIndex].author.photo = action.photo;

			return {
				...state,
			};
		case SET_SEEKS:
			return {
				...state,
				seeks: action.payload,
				loading: false,
			};
		case SET_SEEK:
			const expertComments = [];
			const payloadHolder = [...action.payload.comments];

			payloadHolder.forEach((comment, index) => {
				if (comment.author.rank === 'expert') {
					payloadHolder.splice(index, 1);
					expertComments.push(comment);
				}
			});

			action.payload.comments = [...expertComments, ...payloadHolder];

			return {
				...state,
				seek: action.payload,
			};
		case CLEAR_SEEK:
			return {
				...state,
				seek: {},
			};
		case DOWNVOTE_SEEK:
		case UPVOTE_SEEK:
			let index = state.seeks.findIndex(
				(seek) => seek.id === action.payload.id
			);
			state.seeks[index] = { ...action.payload };
			if (!isSeekEmpty) state.seek = { ...action.payload };

			return {
				...state,
				edited: true,
			};
		case DELETE_SEEK:
			const tempSeeks = [...state.seeks];
			const i = state.seeks.findIndex((seek) => seek.id === action.payload.id);
			tempSeeks.splice(i, 1);

			return {
				...state,
				seeks: [...tempSeeks],
				edited: true,
			};
		case POST_SEEK:
			return {
				...state,
				seeks: [action.payload, ...state.seeks],
				errors: {
					title: null,
					body: null,
				},
			};
		case EDIT_SEEK:
			const targetSeek = state.seeks.findIndex(
				(seek) => seek._id === action.payload._id
			);
			state.seeks[targetSeek] = { ...action.payload };
			state.seek =
				JSON.stringify(state.seek) !== '{}' ? { ...action.payload } : {};

			return { ...state, edited: true };
		case SET_EDITED_TO_FALSE:
			return { ...state, edited: false };
		case POST_COMMENT:
			const seekIndex = state.seeks.findIndex(
				(seek) => seek.id === action.payload.seek
			);
			state.seeks[seekIndex].commentCount++;
			const expertComment = [];
			const payloadCopyHolder = [
				action.payload,
				...state.seeks[seekIndex].comments,
			];

			payloadCopyHolder.forEach((comment, index) => {
				if (comment.author.rank === 'expert') {
					payloadCopyHolder.splice(index, 1);
					expertComment.push(comment);
				}
			});
			state.seeks[seekIndex].comments = [
				...expertComment,
				...payloadCopyHolder,
			];
			state.seek.commentCount++;
			state.seek.comments = [...expertComment, ...payloadCopyHolder];
			return {
				...state,
			};
		case DELETE_COMMENT:
			state.seek.comments = state.seek.comments.filter(
				(comment) => comment._id !== action.payload._id
			);
			const delIndex = state.seeks.findIndex(
				(seek) => seek.id === action.payload.seek
			);

			state.seeks[delIndex].comments = state.seek.comments;
			state.seeks[delIndex].commentCount--;

			return {
				...state,
				seek: { ...state.seek, commentCount: --state.seek.commentCount },
			};
		case UPVOTE_COMMENT:
		case DOWNVOTE_COMMENT:
			const commentIndex = state.seek.comments.findIndex(
				(comment) => comment._id === action.payload._id
			);
			const tempComments = state.seek.comments;
			const { upvotes, downvotes } = action.payload;

			tempComments[commentIndex] = {
				...tempComments[commentIndex],
				upvotes,
				downvotes,
			};
			const isOwnComment =
				tempComments[commentIndex].author === state.seek.author;

			if (action.type === DOWNVOTE_COMMENT) {
				isOwnComment && state.seek.author.points--;
				tempComments[commentIndex].author.points--;
				if (
					(tempComments[commentIndex].author.rank =
						'apprentice' && tempComments[commentIndex].author.points < 50 - 10)
				) {
					if (isOwnComment) state.seek.author.rank = 'user';
					tempComments[commentIndex].author.rank = 'user';
				} else if (
					(tempComments[commentIndex].author.rank =
						'shaman' && tempComments[commentIndex].author.points < 150 - 10)
				) {
					if (isOwnComment) state.seek.author.rank = 'apprentice';
					tempComments[commentIndex].author.rank = 'apprentice';
				} else if (
					(tempComments[commentIndex].author.rank =
						'expert' && tempComments[commentIndex].author.points < 500 - 10)
				) {
					if (isOwnComment) state.seek.author.rank = 'shaman';
					tempComments[commentIndex].author.rank = 'shaman';
				}
			} else {
				state.seek.author.points++;
				tempComments[commentIndex].author.points++;
				if (tempComments[commentIndex].author.points >= 150) {
					if (isOwnComment) state.seek.author.rank = 'shaman';
					tempComments[commentIndex].author.rank = 'shaman';
				} else if (tempComments[commentIndex].author.points >= 50) {
					if (isOwnComment) state.seek.author.rank = 'apprentice';
					tempComments[commentIndex].author.rank = 'apprentice';
				}
			}

			return {
				...state,
				seek: { ...state.seek, comments: [...tempComments] },
			};
		case EDIT_COMMENT:
			const targetedSeek = state.seeks.findIndex(
				(seek) => seek._id === action.payload.seek
			);
			const commentInd = state.seek.comments.findIndex(
				(comment) => comment._id === action.payload._id
			);
			const tempoComments = state.seek.comments;
			const { body } = action.payload;

			tempoComments[commentInd] = {
				...tempoComments[commentInd],
				body,
			};

			state.seeks[targetedSeek].comments[commentInd] = { ...action.payload };

			return {
				...state,
				seek: { ...state.seek, comments: [...tempoComments] },
			};
		case SET_MULTIPLE_ERRORS:
			return {
				...state,
				errors: action.errors,
			};
		case CLEAR_MULTIPLE_ERRORS:
			return state.errors && !state.errors.title && !state.errors.body
				? state
				: {
						...state,
						errors: {
							...state['errors'],
							title: null,
							body: null,
						},
				  };
		default:
			return state;
	}
};

export default reducer;
