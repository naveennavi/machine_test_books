const Book = require("../models/BookModel");
const { body,validationResult } = require("express-validator");
const msgResponse = require("../helpers/msgResponse");
var mongoose = require("mongoose");

function BookData(data) {
	this.id = data._id;
	this.title= data.title;
	this.author = data.author;
	this.summary = data.summary;
	this.bookNo = data.bookNo;
	this.createdAt = data.createdAt;
}

/**
 * Book List.
 * 
 * @returns {Object}
 */
exports.bookList = [
	
	function (req, res) {
		try {
			Book.find().then((books)=>{
				if(books.length > 0){
					return msgResponse.successResponseWithData(res, "List", books);
				}else{
					return msgResponse.successResponseWithData(res, "No Data", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return msgResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.bookDetail = [
	
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return msgResponse.ErrorResponse(res, "No Data", {});
		}
		try {
			Book.findOne({_id: req.params.id}).then((book)=>{    
				console.log(book);            
				if(book !== null){
					let bookData = new BookData(book);
					return msgResponse.successResponseWithData(res, "Info", bookData);
				}else{
					return msgResponse.successResponseWithData(res, "No Info found", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return msgResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book store.
 * 
 * @param {string}      title 
 * @param {string}      author
 * @param {string}      summary
 * @param {string}      bookNo
 * 
 * 
 * @returns {Object}
 */
exports.bookStore = [
	
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
	body("summary", "Summary must not be empty").isLength({ min: 1 }).trim(),
	body("bookNo", "Book Number must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({bookNo : value}).then(book => {
			if (book) {
				return Promise.reject("Book already exist with this Book Number.");
			}
		});
	}),

	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{ title: req.body.title,
					author: req.body.author,
					summary: req.body.summary,
					bookNo: req.body.bookNo
				});

			if (!errors.isEmpty()) {
				return msgResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save book.
				book.save(function (err) {
					if (err) { return msgResponse.ErrorResponse(res, err); }
					let bookData = new BookData(book);
					return msgResponse.successResponseWithData(res,"Book add Success.", bookData);
				});
			}
		} catch (err) { 
			return msgResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book update.
 * 
 * @param {string}      title 
 * @param {string}      author
 * @param {string}      summary
 * @param {string}      bookNo
 * 
 * @returns {Object}
 */
exports.bookUpdate = [
	
	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
	body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
	body("summary", "Summary must not be empty").isLength({ min: 1 }).trim(),
	body("bookNo", "Book Number must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
		return Book.findOne({bookNo : value, _id: { "$ne": req.params.id }}).then(book => {
			if (book) {
				return Promise.reject("Book already exist with this Book no.");
			}
		});
	}),

	(req, res) => {
		try {
			const errors = validationResult(req);
			var book = new Book(
				{ title: req.body.title,
					author: req.body.author,
					summary: req.body.summary,
					bookNo: req.body.bookNo,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return msgResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return msgResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					Book.findById(req.params.id, function (err, foundBook) {
						if(foundBook === null){
							return msgResponse.notFoundResponse(res,"Book not exists with this id");
						}else{
								//update book.
								Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
									if (err) { 
										return msgResponse.ErrorResponse(res, err); 
									}else{
										let bookData = new BookData(book);
										return msgResponse.successResponseWithData(res,"Book update Success.", bookData);
									}
								});
						}
					});
				}
			}
		} catch (err) {
			return msgResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
exports.bookDelete = [
	
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return msgResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			Book.findById(req.params.id, function (err, foundBook) {
				if(foundBook === null){
					return msgResponse.notFoundResponse(res,"Book not exists with this id");
				}else{
						//delete book.
						Book.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return msgResponse.ErrorResponse(res, err); 
							}else{
								return msgResponse.successResponse(res,"Book delete Success.");
							}
						});
				}
			});
		} catch (err) { 
			return msgResponse.ErrorResponse(res, err);
		}
	}
];