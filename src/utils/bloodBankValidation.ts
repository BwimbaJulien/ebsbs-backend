import { body } from 'express-validator';
import { handleValidationErrors } from './userValidation';

export const validateCreateBloodBank = [
  body('name')
    .isString()
    .withMessage('Name of blood bank is required')
    .isLength({ min: 3 })
    .withMessage('Blood bank name must be at least 3 characters long'),
  body('googleLocation')
    .isString()
    .withMessage('Google location of blood bank is required')
    .isLength({ min: 10 })
    .withMessage('Google location must be at least 10 characters long'),
  body('phone')
    .isString()
    .withMessage('Phone number of blood bank is required')
    .isLength({ min: 10, max: 10 })
    .withMessage('Phone number must be 10 characters long'),
  body('email')
    .isString()
    .withMessage('Email of blood bank is required')
    .isEmail()
    .withMessage('Invalid email'),
  body('province')
    .isString()
    .withMessage('Province of blood bank is required')
    .isLength({ min: 3 })
    .withMessage('Province must be at least 3 characters long'),
  body('town')
    .isString()
    .withMessage('Town of blood bank is required')
    .isLength({ min: 3 })
    .withMessage('Town must be at least 3 characters long'),
  body('POBox')
    .isString()
    .withMessage('PO Box of blood bank is required')
    .isLength({ min: 7 })
    .withMessage('PO Box must be at least 7 characters long'),
  handleValidationErrors
];