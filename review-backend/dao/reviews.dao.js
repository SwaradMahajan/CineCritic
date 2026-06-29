import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn) {
        if (reviews) {
            return;
        }

        try {
            reviews = await conn
                .db(process.env.REVIEWS_NS)
                .collection("reviews");
        } catch (e) {
            console.error(
                `Unable to establish collection handles in ReviewsDAO: ${e}`
            );
        }
    }

    static async addReview(movieId, user, review) {
        try {
            const reviewDoc = {
                user: user,
                review: review,
                movieId: movieId
            };

            return await reviews.insertOne(reviewDoc);

        } catch (e) {
            console.error(`Unable to post review: ${e}`);

            return {
                error: e
            };
        }
    }

    static async getReview(reviewId) {
        try {
            return await reviews.findOne({
                _id: new ObjectId(reviewId)
            });

        } catch (e) {
            console.error(`Unable to get review: ${e}`);

            return {
                error: e
            };
        }
    }

    static async getReviewsByMovieId(movieId) {
        try {
            const cursor = await reviews.find({
                movieId: movieId
            });

            return cursor.toArray();

        } catch (e) {
            console.error(`Unable to get reviews: ${e}`);

            return {
                error: e
            };
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
            return await reviews.updateOne(
                {
                    _id: new ObjectId(reviewId),
                    user: user
                },
                {
                    $set: {
                        review: review
                    }
                }
            );

        } catch (e) {
            console.error(`Unable to update review: ${e}`);

            return {
                error: e
            };
        }
    }

    static async deleteReview(reviewId) {
        try {
            return await reviews.deleteOne({
                _id: new ObjectId(reviewId)
            });

        } catch (e) {
            console.error(`Unable to delete review: ${e}`);

            return {
                error: e
            };
        }
    }
}