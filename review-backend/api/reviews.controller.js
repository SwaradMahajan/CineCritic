import ReviewsDAO from "../dao/reviews.dao.js"
export default class ReviewsController{
    static async apiPostReview(req, res, next){
        try{
            const movieId = parseInt(req.body.movieId);
            const review = req.body.review;
            const user = req.body.user;
            
            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                user,
                review
            );
            res.json({
                status:"success"
            });
        }
        catch(e){
            res.status(500).json({
                error:e.message
            });
        }
    }

    static async apiGetReview(req, res, next) {
    try {
        // Get the review ID from the URL
        let id = req.params.id || {};

        // Ask the DAO to fetch the review from MongoDB
        let review = await ReviewsDAO.getReview(id);

        // If no review exists with that ID
        if (!review) {
            res.status(404).json({
                error: "Not found"
            });
            return; // Stop execution
        }
        // Send the review back as JSON
        res.json(review);

        } catch (e) {
            // Handle unexpected server/database errors
            console.log(`api, ${e}`);

            res.status(500).json({
                error: e
            });
        }
    }
    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const review = req.body.review;
            const user = req.body.user;

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                user,
                review
            );

            var { error } = reviewResponse;

            if (error) {
                res.status(400).json({ error });
            }

            if (reviewResponse.modifiedCount === 0) {
                throw new Error(
                    "unable to update review"
                );
            }

            res.json({ status: "success" });
        } 
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id;
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId);
            res.json({ status: "success" });
        } 
        catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
    static async apiGetReviews(req, res, next) {
        try {
            let id = parseInt(req.params.id || {});

            let reviews = await ReviewsDAO.getReviewsByMovieId(id);

            if (!reviews) {
                res.status(404).json({
                    error: "Not found"
                });
                return;
            }

            res.json(reviews);

        } catch (e) {
            console.log(`api, ${e}`);

            res.status(500).json({
                error: e
            });
        }
    }   
}